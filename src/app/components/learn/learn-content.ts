export interface Example {
  sentence: string;
  word: string;
  note?: string;
}

export interface WordClassContent {
  id: string;
  label: string;
  icon: string;
  colour: string;
  definition: string;
  keyFact: string;
  types: { name: string; description: string; examples: string[] }[];
  sentenceExamples: Example[];
  watchOut: string[];
  satsTip: string;
}

export const LEARN_CONTENT: WordClassContent[] = [
  {
    id: 'noun',
    label: 'Noun',
    icon: '📦',
    colour: '#e74c3c',
    definition: 'A noun is a word that names a person, place, thing, or idea.',
    keyFact:
      "Ask yourself: \"Can I put 'the' or 'a' in front of it?\" If yes, it is probably a noun.",
    types: [
      {
        name: 'Common nouns',
        description: 'General names for people, places or things.',
        examples: ['dog', 'city', 'book', 'teacher', 'river'],
      },
      {
        name: 'Proper nouns',
        description: 'Specific names — always start with a capital letter.',
        examples: ['London', 'Mrs Smith', 'Tuesday', 'Thames', 'England'],
      },
      {
        name: 'Abstract nouns',
        description: 'Names for ideas, feelings or qualities you cannot touch.',
        examples: ['happiness', 'courage', 'justice', 'freedom', 'childhood'],
      },
      {
        name: 'Collective nouns',
        description: 'Names for groups of people, animals or things.',
        examples: ['team', 'flock', 'audience', 'government', 'class'],
      },
    ],
    sentenceExamples: [
      { sentence: 'The dog chased the cat.', word: 'dog / cat', note: 'Common nouns' },
      { sentence: 'She was born in London.', word: 'London', note: 'Proper noun' },
      {
        sentence: 'Her courage inspired the team.',
        word: 'courage / team',
        note: 'Abstract + collective',
      },
      {
        sentence: 'She went for a run before breakfast.',
        word: 'run',
        note: '"Run" is a noun here (after "a"), not a verb!',
      },
    ],
    watchOut: [
      'The same word can be a noun in one sentence and a verb in another. "I need a drink" (noun) vs "I drink water" (verb).',
      'Gerunds look like verbs (-ing) but act as nouns: "Swimming is fun."',
      '"The poor", "the elderly" — adjectives can be used as nouns.',
    ],
    satsTip:
      'In SATs, nouns are often tested as part of expanded noun phrases. Remember: abstract nouns name ideas and feelings, not physical objects.',
  },
  {
    id: 'verb',
    label: 'Verb',
    icon: '🏃',
    colour: '#3498db',
    definition:
      'A verb is a word that describes an action, state, or occurrence. Every sentence must have at least one verb.',
    keyFact:
      'Ask yourself: "Can this word change tense?" (walk → walked, is → was). If yes, it is a verb.',
    types: [
      {
        name: 'Action verbs',
        description: 'Describe a physical or mental action.',
        examples: ['run', 'jump', 'think', 'write', 'whispered'],
      },
      {
        name: 'Linking (state) verbs',
        description: 'Connect the subject to a description rather than showing an action.',
        examples: ['is', 'are', 'seem', 'appear', 'become', 'feel', 'look'],
      },
      {
        name: 'Auxiliary verbs',
        description: 'Helping verbs that work with a main verb to form tenses or voice.',
        examples: [
          'have',
          'has',
          'had',
          'do',
          'does',
          'did',
          'be',
          'am',
          'is',
          'are',
          'was',
          'were',
        ],
      },
      {
        name: 'Modal verbs',
        description: 'Show possibility, ability, permission or obligation. They never change form.',
        examples: [
          'can',
          'could',
          'will',
          'would',
          'shall',
          'should',
          'may',
          'might',
          'must',
          'ought to',
        ],
      },
    ],
    sentenceExamples: [
      { sentence: 'She ran quickly across the field.', word: 'ran', note: 'Action verb' },
      { sentence: 'The flowers are blooming.', word: 'are', note: 'Auxiliary verb' },
      { sentence: 'You should finish your homework.', word: 'should', note: 'Modal verb' },
      { sentence: 'She seems very happy.', word: 'seems', note: 'Linking verb' },
      {
        sentence: 'The report was written by the teacher.',
        word: 'was written',
        note: 'Passive verb (auxiliary + past participle)',
      },
    ],
    watchOut: [
      '"Have" can be a main verb ("I have a dog") or an auxiliary verb ("I have finished").',
      'Modal verbs are always followed by the base form of a verb: "She must go" (not "must goes").',
      '"Run" and "light" can also be nouns — check how the word is being used in the sentence.',
    ],
    satsTip:
      'SATs often ask about modal verbs and passive voice. Remember: modal verbs never add -s in the third person. "She can" NOT "she cans".',
  },
  {
    id: 'adjective',
    label: 'Adjective',
    icon: '🎨',
    colour: '#2ecc71',
    definition: 'An adjective is a word that describes or modifies a noun.',
    keyFact: 'Ask yourself: "Does this word describe a noun?" If yes, it is probably an adjective.',
    types: [
      {
        name: 'Attributive adjectives',
        description: 'Come directly before the noun they describe.',
        examples: ['a tall building', 'the ancient castle', 'a brilliant idea'],
      },
      {
        name: 'Predicative adjectives',
        description: 'Come after a linking verb and describe the subject.',
        examples: ['She is happy.', 'The door was open.', 'It seems cold.'],
      },
      {
        name: 'Comparative & superlative',
        description: 'Used to compare nouns. Add -er/-est or use more/most.',
        examples: ['taller / tallest', 'more beautiful / most beautiful', 'better / best'],
      },
      {
        name: 'Participial adjectives',
        description: 'Verb forms (-ing or -ed) used as adjectives.',
        examples: [
          'a broken window',
          'an exhausted runner',
          'a sparkling river',
          'a sleeping child',
        ],
      },
    ],
    sentenceExamples: [
      {
        sentence: 'The enormous elephant walked slowly.',
        word: 'enormous',
        note: 'Attributive — before the noun',
      },
      {
        sentence: 'The water was freezing cold.',
        word: 'freezing',
        note: 'Predicative — after a linking verb',
      },
      {
        sentence: 'The broken window let in the cold air.',
        word: 'broken',
        note: 'Participial adjective (-ed form)',
      },
      {
        sentence: 'He walked at a fast pace.',
        word: 'fast',
        note: 'Describes "pace" (a noun), so it is an adjective here',
      },
    ],
    watchOut: [
      '"Fast" can be an adjective ("a fast car") or an adverb ("she runs fast"). Check what it is modifying.',
      '"Freezing", "sparkling", "sleeping" look like verbs (-ing) but are used as adjectives.',
      '"Open", "content", "present" are adjectives when they describe a noun or follow a linking verb.',
    ],
    satsTip:
      'In SATs, expanded noun phrases with adjectives are important: "the ancient, crumbling castle". Remember that adjectives can come before or after the noun.',
  },
  {
    id: 'adverb',
    label: 'Adverb',
    icon: '⚡',
    colour: '#9b59b6',
    definition: 'An adverb modifies (adds detail to) a verb, an adjective, or another adverb.',
    keyFact:
      'Ask yourself: "Does this word tell us how, when, where, how often, or to what degree?" If yes, it is an adverb.',
    types: [
      {
        name: 'Manner (how)',
        description: 'Describe how an action is done. Many end in -ly.',
        examples: ['quickly', 'carefully', 'silently', 'beautifully', 'hard', 'fast'],
      },
      {
        name: 'Time (when)',
        description: 'Say when something happens.',
        examples: ['yesterday', 'now', 'soon', 'already', 'still', 'yet', 'recently'],
      },
      {
        name: 'Place (where)',
        description: 'Say where something happens.',
        examples: ['here', 'there', 'everywhere', 'nearby', 'outside'],
      },
      {
        name: 'Frequency (how often)',
        description: 'Say how often something happens.',
        examples: ['always', 'usually', 'often', 'sometimes', 'rarely', 'never'],
      },
      {
        name: 'Degree (how much)',
        description: 'Modify adjectives or other adverbs to show degree.',
        examples: ['very', 'quite', 'rather', 'extremely', 'almost', 'nearly', 'just', 'enough'],
      },
      {
        name: 'Sentence adverbs',
        description: 'Modify the whole sentence and often come first.',
        examples: ['Frankly', 'Hopefully', 'Fortunately', 'Obviously', 'Sadly'],
      },
    ],
    sentenceExamples: [
      {
        sentence: 'The tortoise moved slowly.',
        word: 'slowly',
        note: 'Manner — modifies the verb "moved"',
      },
      {
        sentence: 'The weather was extremely cold.',
        word: 'extremely',
        note: 'Degree — modifies the adjective "cold"',
      },
      {
        sentence: 'She almost missed the bus.',
        word: 'almost',
        note: 'Degree — modifies the verb "missed"',
      },
      { sentence: 'He could not believe it.', word: 'not', note: '"Not" is always an adverb' },
      {
        sentence: 'Frankly, I think the plan needs work.',
        word: 'Frankly',
        note: 'Sentence adverb — modifies the whole statement',
      },
    ],
    watchOut: [
      '"Not" is always an adverb — it negates the verb.',
      '"Fast", "hard", "well", "early", "late" can be adjectives OR adverbs: check what they modify.',
      '"Enough" after an adjective is an adverb ("good enough"), but before a noun it is a determiner ("enough cake").',
    ],
    satsTip:
      'SATs often test adverbs of degree (very, quite, extremely) and sentence adverbs. These are easy to confuse with adjectives — remember that adverbs modify verbs, adjectives, or other adverbs, NOT nouns.',
  },
  {
    id: 'pronoun',
    label: 'Pronoun',
    icon: '👤',
    colour: '#e67e22',
    definition: 'A pronoun is a word used in place of a noun (or noun phrase) to avoid repetition.',
    keyFact: 'Ask yourself: "Is this word replacing a noun?" If yes, it is a pronoun.',
    types: [
      {
        name: 'Personal pronouns',
        description:
          'Refer to people or things. Change form depending on their role (subject/object).',
        examples: ['I / me', 'you', 'he / him', 'she / her', 'it', 'we / us', 'they / them'],
      },
      {
        name: 'Possessive pronouns',
        description:
          'Show ownership and stand ALONE (no noun follows them). Do not confuse with possessive determiners!',
        examples: ['mine', 'yours', 'his', 'hers', 'ours', 'theirs'],
      },
      {
        name: 'Reflexive pronouns',
        description: 'Refer back to the subject. End in -self or -selves.',
        examples: ['myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves'],
      },
      {
        name: 'Indefinite pronouns',
        description: 'Refer to people or things in a non-specific way.',
        examples: [
          'someone',
          'nobody',
          'everyone',
          'everything',
          'anything',
          'none',
          'each',
          'both',
          'one',
        ],
      },
      {
        name: 'Relative pronouns',
        description: 'Introduce relative clauses — link back to a noun already mentioned.',
        examples: ['who', 'whom', 'whose', 'which', 'that'],
      },
    ],
    sentenceExamples: [
      { sentence: 'She went to the shop.', word: 'She', note: 'Personal pronoun (subject)' },
      { sentence: 'The prize is mine.', word: 'mine', note: 'Possessive pronoun — stands alone' },
      {
        sentence: 'Compare: "My prize" — here "my" is a possessive DETERMINER (before a noun).',
        word: 'my',
        note: 'NOT a pronoun — it precedes a noun',
      },
      {
        sentence: 'The children entertained themselves.',
        word: 'themselves',
        note: 'Reflexive pronoun',
      },
      { sentence: 'This is the house that Jack built.', word: 'that', note: 'Relative pronoun' },
    ],
    watchOut: [
      'Possessive PRONOUNS (mine, yours, hers, ours, theirs) stand alone.',
      'Possessive DETERMINERS (my, your, her, our, their) come before a noun.',
      '"Both", "each", "none" can be pronouns (stand alone) or determiners (before a noun).',
      '"This/that/these/those" are pronouns when they stand alone, but determiners when before a noun.',
    ],
    satsTip:
      'The possessive pronoun vs possessive determiner distinction is a common SATs question. Key rule: if the word stands alone without a noun following, it is a pronoun. If it is followed by a noun, it is a determiner.',
  },
  {
    id: 'preposition',
    label: 'Preposition',
    icon: '📍',
    colour: '#1abc9c',
    definition:
      'A preposition shows the relationship between a noun or pronoun and another word in the sentence. It usually relates to place, direction, or time.',
    keyFact:
      'Prepositions are always followed by a noun or noun phrase (called the object of the preposition).',
    types: [
      {
        name: 'Place',
        description: 'Show where something is.',
        examples: [
          'on',
          'in',
          'under',
          'over',
          'beside',
          'between',
          'above',
          'below',
          'inside',
          'outside',
        ],
      },
      {
        name: 'Direction',
        description: 'Show movement towards somewhere.',
        examples: ['to', 'towards', 'through', 'across', 'along', 'past', 'into', 'onto'],
      },
      {
        name: 'Time',
        description: 'Show when something happens.',
        examples: ['at', 'on', 'in', 'before', 'after', 'since', 'until', 'during'],
      },
      {
        name: 'Complex prepositions',
        description: 'Multi-word prepositions that work as a single unit.',
        examples: [
          'in spite of',
          'because of',
          'on behalf of',
          'apart from',
          'due to',
          'as well as',
        ],
      },
    ],
    sentenceExamples: [
      { sentence: 'The cat hid under the table.', word: 'under', note: 'Place preposition' },
      { sentence: 'We drove across the bridge.', word: 'across', note: 'Direction preposition' },
      {
        sentence: 'She arrived before everyone else.',
        word: 'before',
        note: '"before" + noun phrase = preposition',
      },
      {
        sentence: 'Following the storm, the streets were flooded.',
        word: 'Following',
        note: 'Participial preposition',
      },
    ],
    watchOut: [
      'Words like "before", "after", "since", "until", "as" can be PREPOSITIONS (+ noun phrase) or CONJUNCTIONS (+ clause). "She arrived before noon" (preposition) vs "She arrived before the lesson ended" (conjunction).',
      '"Like" is a preposition in "She swims like a fish", but a verb in "I like fish".',
      '"Past" can be a preposition ("walked past the shop"), an adjective ("in past times"), or a noun ("in the past").',
    ],
    satsTip:
      'In SATs, prepositions are often tested in the context of prepositional phrases. Remember: the preposition is always followed by a noun phrase, never a clause. If it is followed by a clause (with a verb), it is a conjunction.',
  },
  {
    id: 'conjunction',
    label: 'Conjunction',
    icon: '🔗',
    colour: '#f39c12',
    definition: 'A conjunction joins words, phrases, or clauses together.',
    keyFact:
      'There are two main types: coordinating (join equal parts) and subordinating (join a main clause to a subordinate clause).',
    types: [
      {
        name: 'Coordinating conjunctions',
        description:
          'Join two equal words, phrases, or main clauses. Remember: FANBOYS (For, And, Nor, But, Or, Yet, So).',
        examples: ['for', 'and', 'nor', 'but', 'or', 'yet', 'so'],
      },
      {
        name: 'Subordinating conjunctions',
        description: 'Introduce a subordinate clause and show how it relates to the main clause.',
        examples: [
          'because',
          'although',
          'while',
          'when',
          'if',
          'unless',
          'until',
          'since',
          'as',
          'whereas',
          'whether',
          'provided that',
          'so that',
        ],
      },
      {
        name: 'Correlative conjunctions',
        description: 'Come in pairs to link balanced parts of a sentence.',
        examples: [
          'either...or',
          'neither...nor',
          'both...and',
          'not only...but also',
          'whether...or',
        ],
      },
    ],
    sentenceExamples: [
      {
        sentence: 'I like apples and oranges.',
        word: 'and',
        note: 'Coordinating — joins two nouns',
      },
      {
        sentence: 'She was tired because she had been running.',
        word: 'because',
        note: 'Subordinating — introduces reason',
      },
      {
        sentence: 'He wanted to go out, but it was raining.',
        word: 'but',
        note: 'Coordinating — shows contrast',
      },
      {
        sentence: "You can't go out unless you tidy your room.",
        word: 'unless',
        note: 'Subordinating — shows condition',
      },
      {
        sentence: 'Neither the cake nor the biscuits were left.',
        word: 'Neither...nor',
        note: 'Correlative conjunction pair',
      },
    ],
    watchOut: [
      '"Before", "after", "since", "until" are conjunctions when followed by a clause, but prepositions when followed by a noun phrase.',
      '"Yet" is a coordinating conjunction meaning "but" ("she tried, yet she failed") — different from the adverb "yet" ("has she finished yet?").',
      '"For" is a coordinating conjunction in formal writing meaning "because" ("He smiled, for he was happy").',
    ],
    satsTip:
      'SATs often test subordinating conjunctions for complex sentences. Using a variety of conjunctions (not just "and" or "because") improves your writing marks.',
  },
  {
    id: 'determiner',
    label: 'Determiner',
    icon: '🔢',
    colour: '#e84393',
    definition:
      'A determiner is a word that introduces a noun and gives information about which one, how many, or whose it is. Determiners always come before a noun.',
    keyFact:
      'Determiners always come before a noun (or before adjectives that precede a noun). If the word stands alone, it is probably a pronoun instead.',
    types: [
      {
        name: 'Articles',
        description:
          '"The" (definite — a specific thing) and "a/an" (indefinite — any one of something).',
        examples: ['the', 'a', 'an'],
      },
      {
        name: 'Demonstrative determiners',
        description: 'Point to a specific noun.',
        examples: ['this', 'that', 'these', 'those'],
      },
      {
        name: 'Possessive determiners',
        description:
          'Show who something belongs to. Come before a noun (unlike possessive pronouns which stand alone).',
        examples: ['my', 'your', 'his', 'her', 'its', 'our', 'their'],
      },
      {
        name: 'Quantifiers',
        description: 'Say how many or how much.',
        examples: [
          'some',
          'any',
          'many',
          'much',
          'few',
          'little',
          'several',
          'enough',
          'no',
          'every',
          'each',
          'both',
          'either',
          'neither',
        ],
      },
      {
        name: 'Numbers',
        description:
          'Cardinal (one, two…) and ordinal (first, second…) numbers used before a noun.',
        examples: ['one dog', 'three biscuits', 'first prize', 'second chance'],
      },
      {
        name: 'Interrogative determiners',
        description: 'Used in questions before a noun.',
        examples: ['which book?', 'what time?', 'whose umbrella?'],
      },
    ],
    sentenceExamples: [
      { sentence: 'The children played in the park.', word: 'The', note: 'Definite article' },
      {
        sentence: 'My dog loves chasing squirrels.',
        word: 'My',
        note: 'Possessive determiner — before "dog"',
      },
      {
        sentence: 'Compare: "The prize is mine" — "mine" stands alone, so it is a pronoun.',
        word: 'mine',
        note: 'Possessive PRONOUN — no noun follows',
      },
      {
        sentence: 'Every student must complete the task.',
        word: 'Every',
        note: 'Quantifier determiner',
      },
      {
        sentence: 'Whose umbrella is this?',
        word: 'Whose',
        note: 'Interrogative determiner — before "umbrella"',
      },
    ],
    watchOut: [
      'Possessive DETERMINERS (my, your, her…) come before a noun. Possessive PRONOUNS (mine, yours, hers…) stand alone.',
      '"Both", "each", "no" are determiners before a noun but pronouns/adverbs when they stand alone.',
      '"This/that/these/those" are determiners when before a noun ("this book"), pronouns when they stand alone ("this is fun").',
      '"Which" and "what" are interrogative determiners before a noun ("which car?") but interrogative pronouns when alone ("which do you want?").',
    ],
    satsTip:
      'Determiners are commonly tested in SATs. The key question is always: does the word come before a noun? If yes → determiner. If it stands alone → pronoun or adverb.',
  },
];
