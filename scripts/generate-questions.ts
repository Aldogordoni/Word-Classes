/**
 * Word Classes Question Generator
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates ~20,000 unique word-class questions using the Claude Batches API
 * (50% cheaper than standard API calls, processes asynchronously).
 *
 * USAGE:
 *   1. Install deps:    npm install @anthropic-ai/sdk
 *   2. Set API key:     set ANTHROPIC_API_KEY=sk-ant-...
 *   3. Run:             npx ts-node --project scripts/tsconfig.json scripts/generate-questions.ts
 *
 *   Resume an interrupted run:
 *                       npx ts-node --project scripts/tsconfig.json scripts/generate-questions.ts --resume=msgbatch_xxx
 *
 * OUTPUT:
 *   src/assets/questions/all.json   (all generated questions)
 *   src/assets/questions/{class}.json  (one per word class, for lazy loading)
 *
 * COST ESTIMATE (Batches API, 50% discount):
 *   claude-opus-4-6  → ~$20-25  (default, highest quality)
 *   claude-haiku-4-5 → ~$1-2    (set MODEL=claude-haiku-4-5 env var)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

// ── Config ────────────────────────────────────────────────────────────────────

const MODEL = process.env['MODEL'] ?? 'claude-opus-4-6';
const QUESTIONS_PER_REQUEST = 25;
const REQUESTS_PER_COMBO = 14; // 8 classes × 3 difficulties × 3 types × 14 × 25 = 25,200 raw → ~20k after dedup
const POLL_INTERVAL_MS = 30_000; // 30 seconds between status checks
const OUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'questions');
const BATCH_ID_FILE = path.join(__dirname, 'last-batch-id.txt');

type WordClass = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'determiner';
type Difficulty = 'easy' | 'medium' | 'hard';
type QuestionType = 'identify' | 'classify' | 'fill-blank';

interface RawQuestion {
  type: QuestionType;
  wordClass: WordClass;
  difficulty: Difficulty;
  sentence: string;
  highlightedWord?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const WORD_CLASSES: WordClass[] = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'determiner'];
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const QUESTION_TYPES: QuestionType[] = ['identify', 'classify', 'fill-blank'];

const client = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] });

// ── Prompt helpers ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert UK primary school English teacher who creates SATs practice questions for Year 6 pupils (ages 10-11). Generate word class identification questions. ALWAYS respond with ONLY a valid JSON array — no markdown fences, no explanation, just the raw JSON array.`;

function wordClassDesc(wc: WordClass): string {
  const desc: Record<WordClass, string> = {
    noun: 'a noun (common, proper, abstract, collective, gerund)',
    verb: 'a verb (action, linking, auxiliary, modal, passive)',
    adjective: 'an adjective (attributive, predicative, participial, comparative)',
    adverb: 'an adverb (manner, time, place, frequency, degree, sentence adverb, "not")',
    pronoun: 'a pronoun (personal, possessive, reflexive, indefinite, relative)',
    preposition: 'a preposition (place, direction, time, complex multi-word)',
    conjunction: 'a conjunction (coordinating FANBOYS, subordinating, correlative)',
    determiner: 'a determiner (article, demonstrative, possessive, quantifier, number, interrogative)',
  };
  return desc[wc];
}

function difficultyDesc(d: Difficulty): string {
  const desc: Record<Difficulty, string> = {
    easy: 'Short, simple sentences. The target word is clear and unambiguous. Age-appropriate vocabulary. Example for noun: "The cat sat on the mat."',
    medium: 'More complex sentences. The word might have multiple roles — context makes the correct class clear. Include abstract nouns, modal/auxiliary verbs, participial adjectives, adverbs of degree.',
    hard: 'Tricky cases where a word changes class by context (e.g. "light" as noun/verb/adjective). Test gerunds, passive voice, nominalisation, complex prepositions, correlative conjunctions, possessive pronoun vs determiner. Require real grammar knowledge.',
  };
  return desc[d];
}

function typeInstructions(t: QuestionType, wc: WordClass): string {
  const wordClassLabels = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 'Preposition', 'Conjunction', 'Determiner'];
  switch (t) {
    case 'identify':
      return `
QUESTION TYPE: identify
- Write a sentence containing a word that is clearly ${wordClassDesc(wc)}.
- Wrap that target word in **double asterisks** (e.g. "The **cat** sat on the mat.").
- Set "highlightedWord" to that word (without asterisks).
- Set "options" to exactly 4 word-class labels chosen from: ${wordClassLabels.join(', ')}.
- Always include the correct label and 3 plausible distractors.
- Set "correctAnswer" to the correct label (e.g. "Noun").`;

    case 'classify':
      return `
QUESTION TYPE: classify
- Set "sentence" to a question like "Which of these words is ${wordClassDesc(wc)}?" or a context sentence like 'In "She swims like a fish", what word class is "like"?'.
- Set "options" to exactly 4 actual words (not word-class labels). Only ONE option should be the correct word class.
- Set "correctAnswer" to the one correct word.
- Make distractors from other word classes so students must genuinely identify the class.
- No "highlightedWord" field needed.`;

    case 'fill-blank':
      return `
QUESTION TYPE: fill-blank
- Write a sentence with ___ (three underscores) where a ${wordClassDesc(wc)} fits.
- Set "options" to exactly 4 words. Only ONE should be a ${wc} that fits grammatically.
- Set "correctAnswer" to that one word.
- Make the other 3 options words from different word classes to make the student think.
- No "highlightedWord" field needed.`;
  }
}

function buildUserPrompt(wc: WordClass, d: Difficulty, t: QuestionType, batchIndex: number): string {
  return `Generate exactly ${QUESTIONS_PER_REQUEST} UNIQUE ${d} questions about ${wordClassDesc(wc)}.

${typeInstructions(t, wc)}

DIFFICULTY: ${difficultyDesc(d)}

VARIETY: This is batch ${batchIndex + 1} of ${REQUESTS_PER_COMBO}. Use completely different sentences, vocabulary, and contexts from other batches. Cover: different topics (animals, school, weather, sport, food, travel, nature, science, history, everyday life), different sentence structures (simple, compound, complex), different tenses and registers.

QUALITY RULES:
- Every sentence must be grammatically correct British English.
- options must always contain exactly 4 items.
- correctAnswer must exactly match one of the options (same capitalisation).
- explanation must clearly explain WHY the answer is correct in one or two sentences.
- Do NOT repeat any sentence from any other batch.

Return ONLY a JSON array of ${QUESTIONS_PER_REQUEST} question objects. No other text.

JSON schema for each object:
{
  "type": "${t}",
  "wordClass": "${wc}",
  "difficulty": "${d}",
  "sentence": "string",
  "highlightedWord": "string or omit if not identify type",
  "options": ["string","string","string","string"],
  "correctAnswer": "string",
  "explanation": "string"
}`;
}

// ── Build all batch requests ───────────────────────────────────────────────────

function buildAllRequests(): Anthropic.Messages.MessageCreateParamsNonStreaming[] {
  const requests: Anthropic.Messages.MessageCreateParamsNonStreaming[] = [];
  for (const wc of WORD_CLASSES) {
    for (const d of DIFFICULTIES) {
      for (const t of QUESTION_TYPES) {
        for (let i = 0; i < REQUESTS_PER_COMBO; i++) {
          requests.push({
            model: MODEL,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: buildUserPrompt(wc, d, t, i) }],
          });
        }
      }
    }
  }
  return requests;
}

// ── Submit batch ──────────────────────────────────────────────────────────────

async function submitBatch(): Promise<string> {
  const requests = buildAllRequests();
  console.log(`\nBuilding batch: ${requests.length} requests × ${QUESTIONS_PER_REQUEST} questions = ${requests.length * QUESTIONS_PER_REQUEST} raw questions`);
  console.log(`Model: ${MODEL}`);
  console.log('Submitting to Batches API…\n');

  const batchRequests = requests.map((params, i) => {
    const wc = WORD_CLASSES[Math.floor(i / (DIFFICULTIES.length * QUESTION_TYPES.length * REQUESTS_PER_COMBO))];
    const rem = i % (DIFFICULTIES.length * QUESTION_TYPES.length * REQUESTS_PER_COMBO);
    const d = DIFFICULTIES[Math.floor(rem / (QUESTION_TYPES.length * REQUESTS_PER_COMBO))];
    const rem2 = rem % (QUESTION_TYPES.length * REQUESTS_PER_COMBO);
    const t = QUESTION_TYPES[Math.floor(rem2 / REQUESTS_PER_COMBO)];
    const b = rem2 % REQUESTS_PER_COMBO;
    return { custom_id: `${wc}_${d}_${t}_${b}`, params };
  });

  const batch = await client.messages.batches.create({ requests: batchRequests });
  fs.writeFileSync(BATCH_ID_FILE, batch.id, 'utf-8');
  console.log(`✅ Batch submitted: ${batch.id}`);
  console.log(`   Saved batch ID to ${BATCH_ID_FILE}`);
  return batch.id;
}

// ── Poll until done ───────────────────────────────────────────────────────────

async function waitForBatch(batchId: string): Promise<void> {
  console.log('\nPolling for completion…');
  let dots = 0;
  while (true) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
    const batch = await client.messages.batches.retrieve(batchId);
    const { processing, succeeded, errored, expired, canceled } = batch.request_counts;
    process.stdout.write(`\r  ${new Date().toLocaleTimeString()} — processing: ${processing}, succeeded: ${succeeded}, errored: ${errored}${'.'.repeat(++dots % 4)}   `);
    if (batch.processing_status === 'ended') {
      console.log(`\n\n✅ Batch complete — succeeded: ${succeeded}, errored: ${errored}, expired: ${expired}, canceled: ${canceled}`);
      return;
    }
  }
}

// ── Parse results ─────────────────────────────────────────────────────────────

function parseQuestions(text: string, expectedWc: WordClass, expectedD: Difficulty, expectedT: QuestionType): RawQuestion[] {
  // Strip markdown fences if present
  const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
  let arr: unknown[];
  try {
    arr = JSON.parse(cleaned);
  } catch {
    return [];
  }
  if (!Array.isArray(arr)) return [];

  const valid: RawQuestion[] = [];
  for (const item of arr) {
    if (typeof item !== 'object' || item === null) continue;
    const q = item as Record<string, unknown>;
    if (
      typeof q['sentence'] !== 'string' ||
      !Array.isArray(q['options']) ||
      (q['options'] as unknown[]).length !== 4 ||
      typeof q['correctAnswer'] !== 'string' ||
      typeof q['explanation'] !== 'string'
    ) continue;

    // Validate correctAnswer is in options
    const options = q['options'] as string[];
    if (!options.includes(q['correctAnswer'] as string)) continue;

    const validated: RawQuestion = {
      type: expectedT,
      wordClass: expectedWc,
      difficulty: expectedD,
      sentence: q['sentence'] as string,
      options,
      correctAnswer: q['correctAnswer'] as string,
      explanation: q['explanation'] as string,
    };
    if (expectedT === 'identify' && typeof q['highlightedWord'] === 'string') {
      validated.highlightedWord = q['highlightedWord'] as string;
    }
    valid.push(validated);
  }
  return valid;
}

async function downloadAndParse(batchId: string): Promise<RawQuestion[]> {
  console.log('\nDownloading results…');
  const all: RawQuestion[] = [];
  let count = 0;

  for await (const result of await client.messages.batches.results(batchId)) {
    count++;
    if (result.result.type !== 'succeeded') continue;

    // Parse custom_id to get expected types
    const [wc, d, t] = result.custom_id.split('_') as [WordClass, Difficulty, QuestionType];
    const message = result.result.message;
    const textBlock = message.content.find((b): b is Anthropic.Messages.TextBlock => b.type === 'text');
    if (!textBlock) continue;

    const questions = parseQuestions(textBlock.text, wc, d, t);
    all.push(...questions);

    if (count % 100 === 0) {
      process.stdout.write(`\r  Parsed ${count} results, ${all.length} valid questions so far…`);
    }
  }
  console.log(`\n  Parsed ${count} results → ${all.length} valid questions before dedup`);
  return all;
}

// ── Deduplication ─────────────────────────────────────────────────────────────

function deduplicate(questions: RawQuestion[]): RawQuestion[] {
  const seen = new Set<string>();
  const unique: RawQuestion[] = [];
  for (const q of questions) {
    // Key on normalised sentence + word class + type to catch near-duplicates
    const key = `${q.wordClass}|${q.type}|${q.sentence.toLowerCase().replace(/\s+/g, ' ').trim()}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(q);
    }
  }
  return unique;
}

// ── Save output ───────────────────────────────────────────────────────────────

function saveQuestions(questions: RawQuestion[]): void {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Assign IDs (starting after the existing 206 hand-crafted questions)
  const withIds = questions.map((q, i) => ({ ...q, id: 207 + i }));

  // Save combined file
  const allPath = path.join(OUT_DIR, 'all.json');
  fs.writeFileSync(allPath, JSON.stringify(withIds, null, 2), 'utf-8');
  console.log(`\n✅ Saved ${withIds.length} questions → ${allPath}`);

  // Save per-class files
  for (const wc of WORD_CLASSES) {
    const classQuestions = withIds.filter(q => q.wordClass === wc);
    const classPath = path.join(OUT_DIR, `${wc}.json`);
    fs.writeFileSync(classPath, JSON.stringify(classQuestions, null, 2), 'utf-8');
    console.log(`   ${wc}: ${classQuestions.length} questions`);
  }

  // Print breakdown
  console.log('\nBreakdown by difficulty:');
  for (const d of DIFFICULTIES) {
    const n = withIds.filter(q => q.difficulty === d).length;
    console.log(`  ${d}: ${n}`);
  }
}

// ── Stats / cost estimate ─────────────────────────────────────────────────────

function printCostEstimate(): void {
  const totalRequests = WORD_CLASSES.length * DIFFICULTIES.length * QUESTION_TYPES.length * REQUESTS_PER_COMBO;
  const estInputTokens = totalRequests * 900;
  const estOutputTokens = totalRequests * 1500;
  // Batch prices (50% off standard)
  const isHaiku = MODEL.includes('haiku');
  const inputPricePerM = isHaiku ? 0.50 : 2.50;  // $/1M tokens (batch)
  const outputPricePerM = isHaiku ? 2.50 : 12.50;
  const estCost = (estInputTokens / 1e6) * inputPricePerM + (estOutputTokens / 1e6) * outputPricePerM;
  console.log(`\nCost estimate for ${totalRequests} requests:`);
  console.log(`  Input:  ~${(estInputTokens / 1e6).toFixed(1)}M tokens × $${inputPricePerM}/M = $${((estInputTokens / 1e6) * inputPricePerM).toFixed(2)}`);
  console.log(`  Output: ~${(estOutputTokens / 1e6).toFixed(1)}M tokens × $${outputPricePerM}/M = $${((estOutputTokens / 1e6) * outputPricePerM).toFixed(2)}`);
  console.log(`  Total:  ~$${estCost.toFixed(2)} (Batches API 50% discount applied)`);
  if (!isHaiku) {
    console.log(`  Tip: set MODEL=claude-haiku-4-5 to cut cost to ~$${(estCost / 10).toFixed(2)} (lower quality)`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Word Classes Question Generator');
  console.log('═══════════════════════════════════════════════════════════');

  // Check for resume flag
  const resumeFlag = process.argv.find(a => a.startsWith('--resume='));
  let batchId: string;

  if (resumeFlag) {
    batchId = resumeFlag.split('=')[1];
    console.log(`\nResuming batch: ${batchId}`);
  } else {
    printCostEstimate();
    console.log('\nPress Ctrl+C to cancel. The batch ID will be saved so you can resume later.');
    console.log('Starting in 5 seconds…');
    await new Promise(r => setTimeout(r, 5000));
    batchId = await submitBatch();
  }

  await waitForBatch(batchId);
  const rawQuestions = await downloadAndParse(batchId);
  const unique = deduplicate(rawQuestions);
  console.log(`\nAfter deduplication: ${unique.length} unique questions`);
  saveQuestions(unique);

  // Clean up batch ID file
  if (fs.existsSync(BATCH_ID_FILE)) fs.unlinkSync(BATCH_ID_FILE);

  console.log('\n🎉 Done! The Angular app will automatically load these questions.');
  console.log('   Run `npm start` to test locally.');
}

main().catch(err => {
  console.error('\nError:', err.message ?? err);
  process.exit(1);
});
