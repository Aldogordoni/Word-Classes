export interface FormulaCard {
  shape: string;
  formula: string;
  formulaNote?: string;
  example: string;
}

export interface WorkedExample {
  question: string;
  steps: string[];
  answer: string;
}

export interface MathTopicContent {
  id: string;
  label: string;
  icon: string;
  colour: string;
  definition: string;
  keyFact: string;
  formulas: FormulaCard[];
  workedExamples: WorkedExample[];
  watchOut: string[];
  satsTip: string;
}

export const MATH_LEARN_CONTENT: MathTopicContent[] = [
  {
    id: 'area',
    label: 'Area',
    icon: '📐',
    colour: '#e17055',
    definition: 'Area is the amount of space inside a 2D shape. It is measured in square units such as cm², m², or mm².',
    keyFact: 'Think of area as how many unit squares would fit inside the shape. The ² in cm² means "square" — always include it in your answer!',
    formulas: [
      {
        shape: 'Rectangle',
        formula: 'Area = length × width',
        example: 'length = 8 cm, width = 5 cm → Area = 8 × 5 = 40 cm²',
      },
      {
        shape: 'Square',
        formula: 'Area = side × side',
        formulaNote: 'A square is just a rectangle where length = width.',
        example: 'side = 6 cm → Area = 6 × 6 = 36 cm²',
      },
      {
        shape: 'Triangle',
        formula: 'Area = ½ × base × height',
        formulaNote: 'The height must be the perpendicular height — straight up from the base at a right angle.',
        example: 'base = 10 cm, height = 4 cm → Area = ½ × 10 × 4 = 20 cm²',
      },
      {
        shape: 'Parallelogram',
        formula: 'Area = base × height',
        formulaNote: 'Same as a rectangle! The height is perpendicular to the base, not the slanted side.',
        example: 'base = 9 cm, height = 3 cm → Area = 9 × 3 = 27 cm²',
      },
    ],
    workedExamples: [
      {
        question: 'A rectangle is 12 cm long and 4 cm wide. What is its area?',
        steps: ['Write the formula: Area = length × width', 'Substitute: Area = 12 × 4', 'Calculate: Area = 48 cm²'],
        answer: '48 cm²',
      },
      {
        question: 'A triangle has base 8 cm and perpendicular height 5 cm. What is its area?',
        steps: ['Write the formula: Area = ½ × base × height', 'Substitute: Area = ½ × 8 × 5', 'Calculate: Area = ½ × 40 = 20 cm²'],
        answer: '20 cm²',
      },
      {
        question: 'A rectangle has area 36 cm² and width 4 cm. What is its length?',
        steps: ['Write the formula: Area = length × width', 'Rearrange: length = Area ÷ width', 'Calculate: length = 36 ÷ 4 = 9 cm'],
        answer: '9 cm',
      },
    ],
    watchOut: [
      'Always use the perpendicular height for triangles and parallelograms — not the slanted side length.',
      'Remember to write cm² (not just cm) in your answer.',
      'For a triangle, don\'t forget the ½ — it\'s easy to miss under test pressure!',
      'Area and perimeter are easy to mix up. Area is the space inside; perimeter is the distance around.',
    ],
    satsTip: 'If a question asks you to "find the length" given the area and width, rearrange the formula: length = area ÷ width.',
  },

  {
    id: 'perimeter',
    label: 'Perimeter',
    icon: '📏',
    colour: '#0984e3',
    definition: 'Perimeter is the total distance around the outside of a 2D shape. It is measured in units such as cm, m, or mm (not squared).',
    keyFact: '"Peri" means around. Think of a perimeter fence going all the way around a field. Add up all the side lengths.',
    formulas: [
      {
        shape: 'Rectangle',
        formula: 'Perimeter = 2 × (length + width)',
        formulaNote: 'You can also write this as: 2 × length + 2 × width.',
        example: 'length = 7 cm, width = 3 cm → Perimeter = 2 × (7 + 3) = 2 × 10 = 20 cm',
      },
      {
        shape: 'Square',
        formula: 'Perimeter = 4 × side',
        formulaNote: 'All four sides are equal, so just multiply one side by 4.',
        example: 'side = 9 cm → Perimeter = 4 × 9 = 36 cm',
      },
      {
        shape: 'Any shape',
        formula: 'Perimeter = sum of all sides',
        formulaNote: 'For triangles, pentagons, or irregular shapes — just add up every side.',
        example: 'Triangle with sides 5 cm, 8 cm, 6 cm → Perimeter = 5 + 8 + 6 = 19 cm',
      },
    ],
    workedExamples: [
      {
        question: 'A rectangle has length 11 cm and width 5 cm. What is its perimeter?',
        steps: ['Write the formula: Perimeter = 2 × (length + width)', 'Substitute: Perimeter = 2 × (11 + 5)', 'Calculate: Perimeter = 2 × 16 = 32 cm'],
        answer: '32 cm',
      },
      {
        question: 'A square has perimeter 28 cm. What is the length of one side?',
        steps: ['Write the formula: Perimeter = 4 × side', 'Rearrange: side = Perimeter ÷ 4', 'Calculate: side = 28 ÷ 4 = 7 cm'],
        answer: '7 cm',
      },
      {
        question: 'A rectangle has perimeter 40 cm and length 12 cm. What is its width?',
        steps: [
          'Perimeter = 2 × (length + width)',
          '40 = 2 × (12 + width)',
          '20 = 12 + width',
          'width = 20 − 12 = 8 cm',
        ],
        answer: '8 cm',
      },
    ],
    watchOut: [
      'Perimeter is NOT measured in cm² — it is just cm (or m, mm). Only area uses squared units.',
      'For a rectangle, a common mistake is to only add length + width and forget to multiply by 2.',
      'Don\'t mix up perimeter (distance around) with area (space inside).',
      'When a question mentions "fencing" or "border", it almost always means perimeter.',
    ],
    satsTip: 'To find a missing side from the perimeter: subtract the sides you know from the total perimeter.',
  },

  {
    id: 'circle',
    label: 'Circles',
    icon: '⭕',
    colour: '#6c5ce7',
    definition: 'A circle is a round 2D shape where every point on the edge is the same distance from the centre. Two key measurements are the radius and the diameter.',
    keyFact: 'π (pi) ≈ 3.14. The diameter always passes through the centre. The radius is half the diameter: r = d ÷ 2.',
    formulas: [
      {
        shape: 'Circumference (distance around)',
        formula: 'C = π × diameter   or   C = 2 × π × r',
        formulaNote: 'Both versions give the same answer. Use whichever you\'re given.',
        example: 'diameter = 10 cm → C = 3.14 × 10 = 31.4 cm',
      },
      {
        shape: 'Area',
        formula: 'A = π × r²',
        formulaNote: 'r² means radius × radius. Square the radius first, then multiply by π.',
        example: 'radius = 5 cm → A = 3.14 × 5² = 3.14 × 25 = 78.5 cm²',
      },
      {
        shape: 'Radius from diameter',
        formula: 'radius = diameter ÷ 2',
        example: 'diameter = 14 cm → radius = 14 ÷ 2 = 7 cm',
      },
      {
        shape: 'Diameter from radius',
        formula: 'diameter = radius × 2',
        example: 'radius = 6 cm → diameter = 6 × 2 = 12 cm',
      },
    ],
    workedExamples: [
      {
        question: 'A circle has diameter 20 cm. What is its circumference? (Use π = 3.14)',
        steps: ['Write the formula: C = π × diameter', 'Substitute: C = 3.14 × 20', 'Calculate: C = 62.8 cm'],
        answer: '62.8 cm',
      },
      {
        question: 'A circle has radius 4 cm. What is its area? (Use π = 3.14)',
        steps: ['Write the formula: A = π × r²', 'Square the radius: 4² = 16', 'Substitute: A = 3.14 × 16', 'Calculate: A = 50.24 cm²'],
        answer: '50.24 cm²',
      },
      {
        question: 'A circle has diameter 8 cm. What is its radius?',
        steps: ['radius = diameter ÷ 2', 'radius = 8 ÷ 2 = 4 cm'],
        answer: '4 cm',
      },
    ],
    watchOut: [
      'Always square the radius before multiplying by π when finding area. A = π × r² NOT π × r.',
      'Circumference uses the diameter; area uses the radius. Don\'t muddle them up.',
      'Area of a circle is in cm² — circumference is just in cm.',
      'If a question gives you the diameter and asks for area, halve it to get the radius first.',
    ],
    satsTip: 'In SATs you are usually told to use π = 3.14. Write this at the top of your working so you don\'t forget.',
  },

  {
    id: 'volume',
    label: 'Volume',
    icon: '📦',
    colour: '#00cec9',
    definition: 'Volume is the amount of 3D space inside a solid shape. It is measured in cubic units such as cm³, m³, or mm³.',
    keyFact: 'Think of volume as how many unit cubes would fit inside the shape. The ³ in cm³ means "cubed" — always include it in your answer!',
    formulas: [
      {
        shape: 'Cuboid',
        formula: 'Volume = length × width × height',
        formulaNote: 'A cuboid is a 3D box shape (like a cereal box). Multiply all three dimensions together.',
        example: 'l = 5 cm, w = 4 cm, h = 3 cm → Volume = 5 × 4 × 3 = 60 cm³',
      },
      {
        shape: 'Cube',
        formula: 'Volume = side × side × side',
        formulaNote: 'A cube is a special cuboid where all three sides are equal.',
        example: 'side = 4 cm → Volume = 4 × 4 × 4 = 64 cm³',
      },
    ],
    workedExamples: [
      {
        question: 'A cuboid has length 6 cm, width 3 cm, and height 4 cm. What is its volume?',
        steps: ['Write the formula: Volume = length × width × height', 'Substitute: Volume = 6 × 3 × 4', 'Calculate: Volume = 72 cm³'],
        answer: '72 cm³',
      },
      {
        question: 'A cube has sides of 5 cm. What is its volume?',
        steps: ['Write the formula: Volume = side × side × side', 'Substitute: Volume = 5 × 5 × 5', 'Calculate: Volume = 125 cm³'],
        answer: '125 cm³',
      },
      {
        question: 'A cuboid has volume 120 cm³, length 10 cm, and width 4 cm. What is its height?',
        steps: ['Volume = length × width × height', 'Rearrange: height = Volume ÷ (length × width)', 'height = 120 ÷ (10 × 4) = 120 ÷ 40 = 3 cm'],
        answer: '3 cm',
      },
    ],
    watchOut: [
      'Volume is measured in cm³ (cubic centimetres), not cm² — remember the ³!',
      'Don\'t confuse volume (3D) with area (2D). Volume needs three measurements; area needs two.',
      'For a cube, it\'s easy to accidentally do side × 3 instead of side × side × side.',
      'When finding a missing dimension: rearrange the formula by dividing the volume by the known dimensions.',
    ],
    satsTip: 'To find a missing dimension from volume, divide: height = volume ÷ (length × width). Do the multiplication in the brackets first.',
  },
];
