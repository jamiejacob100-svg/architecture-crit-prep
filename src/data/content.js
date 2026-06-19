// Knowledge ported from the architecture-crit-prep skill reference files.
// This is the static domain content the interactive stages draw on.

export const STAGES = [
  {
    id: 'intake',
    no: 1,
    title: 'Intake',
    blurb: 'Pull the essentials out of your head so there’s something to build on.',
  },
  {
    id: 'narrative',
    no: 2,
    title: 'Narrative spine',
    blurb: 'The through-line everything else hangs off.',
  },
  {
    id: 'boards',
    no: 3,
    title: 'Board plan',
    blurb: 'What goes where, in what order — and how the orthographics are arranged.',
  },
  {
    id: 'layouts',
    no: 4,
    title: 'Drawing layouts',
    blurb: 'Drop in images of your drawings and generate board layout options.',
  },
  {
    id: 'script',
    no: 5,
    title: 'Speaking script',
    blurb: 'A timed script with board cues you can read off the wall.',
  },
  {
    id: 'defense',
    no: 6,
    title: 'Defense drill',
    blurb: 'Anticipate the hard questions and rehearse the answers.',
  },
  {
    id: 'overview',
    no: 7,
    title: 'Review & export',
    blurb: 'See the whole prep on one page and export it.',
  },
];

// ---- Stage 1 / 2: concept-finding prompts (narrative-frameworks.md) ----
export const CONCEPT_PROMPTS = [
  'What first interested you about this site or brief? The instinct is often the seed of the concept.',
  'If you could only keep one move, what would it be? Forces a hierarchy and reveals the organizing idea.',
  'What is the building doing that an ordinary version wouldn’t? Locates the project’s actual argument.',
  'What’s the one-sentence version a friend would understand? A concept that can’t survive plain language is usually unresolved.',
  'What problem does the site or brief pose, and what’s your answer? The most defensible structure in a crit.',
];

export const CONCEPT_TEST =
  'Pressure-test it: does the concept explain the plan? The section? The materials? A real concept generates decisions; a slogan just sits on the first board.';

// ---- Stage 2: narrative arcs ----
export const ARCS = [
  {
    id: 'default',
    name: 'Default (problem → idea → development → resolution)',
    when: 'Best for most undergrad design projects. Use unless another arc fits better.',
    risk: null,
    beats: [
      ['Site & context', 'What’s the situation, what does it demand?'],
      ['Brief & program', 'What has to happen here, and any reframing of the brief you made.'],
      ['Concept / big idea', 'The move that answers the site and brief.'],
      ['Parti', 'The concept reduced to a diagram; the organizing principle.'],
      ['Development', 'How the parti becomes spaces, circulation, form, structure, materiality.'],
      ['Key moments', 'The two or three spaces or experiences that carry the project.'],
      ['Resolution', 'Plans, sections, the technical and environmental logic that proves it works.'],
    ],
  },
  {
    id: 'problem',
    name: 'Problem-led',
    when: 'Strong when the site has an obvious tension — flood risk, a severed neighborhood, a derelict structure. Frame the whole project as the solution.',
    risk: 'The building can feel like a diagram of the problem rather than architecture — make sure spatial quality still gets airtime.',
    beats: [
      ['The problem', 'Open hard on the site or social problem.'],
      ['The stakes', 'Why it matters, who it affects.'],
      ['The answer', 'Frame the project as the response.'],
      ['Development', 'How the response becomes building.'],
      ['Spatial quality', 'Prove it’s architecture, not just a diagram.'],
      ['Resolution', 'Orthographics that show it holds up.'],
    ],
  },
  {
    id: 'precedent',
    name: 'Precedent-led',
    when: 'Strong for students with genuine precedent knowledge and a more academic jury. Position the project as a development or critique of one or two precedents.',
    risk: 'Looking derivative — be explicit about what you changed and why.',
    beats: [
      ['The precedents', 'Open with one or two reference projects.'],
      ['What they get right / wrong', 'Your reading of them.'],
      ['Your position', 'Develop or critique them.'],
      ['Concept', 'The move that follows from that position.'],
      ['Development', 'How it plays out in the building.'],
      ['Resolution', 'Orthographics and proof.'],
    ],
  },
  {
    id: 'experiential',
    name: 'Experiential',
    when: 'Strong when the project’s strength is atmosphere, procession, or a choreographed journey. Structure the talk as a walk through the building.',
    risk: 'Losing the analytical thread — anchor the experience back to the concept at each step.',
    beats: [
      ['Approach', 'How a visitor first meets the building.'],
      ['Threshold', 'The moment of entry.'],
      ['Sequence', 'The procession of spaces as experienced.'],
      ['Climax space', 'The key moment the journey builds to.'],
      ['Concept anchor', 'Tie the experience back to the idea.'],
      ['Resolution', 'Plans/sections that underwrite the journey.'],
    ],
  },
  {
    id: 'polemical',
    name: 'Polemical',
    when: 'Strong for studios that reward conceptual ambition. Lead with a position or provocation and present the project as the argument’s proof.',
    risk: 'Over-promising — the building must actually deliver on the claim or critics will pounce.',
    beats: [
      ['The provocation', 'Lead with the position, e.g. “housing should not be designed around the car.”'],
      ['The argument', 'Why the position holds.'],
      ['The proof', 'Present the project as the demonstration.'],
      ['Development', 'How the claim shapes the building.'],
      ['Key moments', 'Where the argument is most visible.'],
      ['Resolution', 'Orthographics that deliver on the claim.'],
    ],
  },
];

// ---- Stage 3: drawing layout (drawing-layout.md) ----
export const DRAWING_TYPES = [
  { type: 'Location / site plan', scales: '1:1250, 1:500', shows: 'Building in its wider context', reads: 'The setting' },
  { type: 'Site plan / ground + landscape', scales: '1:500, 1:200', shows: 'Footprint, approach, landscape', reads: 'The fit' },
  { type: 'Floor plans', scales: '1:200, 1:100, 1:50', shows: 'Organization of each level', reads: 'The logic' },
  { type: 'Sections', scales: '1:200, 1:100, 1:50', shows: 'Vertical experience, levels, light', reads: 'The experience' },
  { type: 'Elevations', scales: '1:200, 1:100, 1:50', shows: 'External face, materiality, proportion', reads: 'The face' },
  { type: 'Construction / detail sections', scales: '1:20, 1:10, 1:5, 1:1', shows: 'How it’s built at a key junction', reads: 'The proof' },
];

export const LAYOUT_PRINCIPLES = [
  { t: 'Order by scale: zoom in', d: 'Sequence from broadest (site) to finest (detail). Across the boards the eye travels context → building → junction. The single most important ordering rule.' },
  { t: 'Group by type', d: 'All plans together, all sections together, all elevations together. Scattering orthographics is the most common board-layout mistake.' },
  { t: 'Align shared scales', d: 'Same-scale drawings drawn at the same size. Where two drawings relate (a section and the plan it cuts), align them so the critic reads them as one system.' },
  { t: 'Stack plans to show rising', d: 'Multiple floor plans stacked in register on the same footprint — ground at the bottom/left, upper floors above/right — so the levels read as accumulating.' },
  { t: 'Keep orientation consistent', d: 'Every plan oriented the same way, north arrow pointing the same direction. Flipping orientation undermines confidence.' },
  { t: 'Label scale on every drawing', d: 'Each orthographic needs its scale (e.g. “1:100”), a graphic scale bar, and plans need a north arrow. Missing notation reads as incomplete.' },
];

export const LAYOUT_CHECKLIST = [
  'Drawings ordered broad-to-fine (site → plan → section/elevation → detail)?',
  'Same-type drawings grouped, not scattered?',
  'Same-scale drawings drawn at the same size?',
  'Related drawings (section/plan, elevation/plan) aligned so they project onto each other?',
  'Multiple plans stacked in register, same footprint, same orientation?',
  'North arrow + scale bar + scale figure on every relevant drawing, consistent across the set?',
];

// Layout variants the generator produces (generate_layouts.py / SKILL.md)
export const LAYOUT_VARIANTS = [
  { id: 'linear', name: 'Linear', d: 'Drawings in a row/grid in broad-to-fine scale order.' },
  { id: 'grouped', name: 'Grouped', d: 'Columns grouped by drawing type.' },
  { id: 'aligned', name: 'Aligned', d: 'Plans top, sections/elevations aligned below, details last — the projection layout.' },
  { id: 'hero', name: 'Hero', d: 'One large lead drawing with supporting drawings beside it.' },
];

export const DRAWING_TYPE_OPTIONS = [
  'site', 'plan', 'section', 'elevation', 'detail', 'perspective', 'diagram', 'axo',
];

// ---- Stage 5: defense (defense-questions.md) ----
export const ANSWER_TECHNIQUE = [
  ['Acknowledge', 'the question honestly — don’t get defensive or dodge.'],
  ['Reason', 'give the logic, constraint, or priority that drove the decision.'],
  ['Tie back', 'connect it to the concept, so the answer reinforces the through-line.'],
];

export const QUESTION_CATEGORIES = [
  { cat: 'Site response', q: 'Why this orientation / massing / relationship to the boundary?', note: 'Prepare the one sentence linking each major formal move to a site condition.' },
  { cat: 'Concept consistency', q: 'How does this decision follow from your concept?', note: 'The most common way to lose a crit is a decision that contradicts the stated idea. Trace each move to the concept — or say honestly where you departed and why.' },
  { cat: 'Program & circulation', q: 'How do people actually move through this? Where does the service access go?', note: 'Undergrads often resolve hero spaces and hand-wave the connective tissue. Walk the circulation in your head before the crit.' },
  { cat: 'Structure & materiality', q: 'What’s holding this up? Why this material?', note: '“It looked nice” is a red flag. Have a concept-level reason for the structural idea and the main materials.' },
  { cat: 'Environmental / technical', q: 'How does it deal with light, heat, water?', note: 'Increasingly expected even at undergrad level. Have a basic daylight and orientation strategy at minimum.' },
  { cat: 'Precedent', q: 'What projects informed this?', note: 'Name two or three precedents and say specifically what you took or rejected. Don’t name a famous building you only vaguely know.' },
  { cat: 'The obvious alternative', q: 'Why didn’t you just do the simpler / conventional thing?', note: 'Critics love these. Show you saw the obvious path and chose differently for a reason tied to the concept.' },
  { cat: 'Scale & ambition', q: 'Isn’t this over / under-designed for the brief?', note: 'Have a reason the project is the size and ambition it is.' },
];

export const IDK_TECHNIQUE = [
  'Acknowledge it directly: “I haven’t resolved that yet.”',
  'Show the thought process that would guide it: “but the way I’d approach it is…”',
  'Offer the next step: “the next thing I’d test is…”',
];

export const RED_FLAGS = [
  'A concept stated on board one and then never reflected in the plan.',
  'Circulation that doesn’t work or service spaces that don’t exist.',
  '“It looked good” as the reason for a major decision.',
  'Precedents named but clearly not understood.',
  'Defensiveness or arguing with the critic rather than engaging the question.',
  'Trailing off without a clear closing position.',
];

// ---- Stage 4: speaking coaching ----
export const SCRIPT_COACHING = [
  'Open with the idea, not an apology. Never start with “I didn’t have time to…”. Critics anchor on the first thing they hear.',
  'Speak to the drawings, pointing as you go — don’t read the boards aloud.',
  'Name the concept early and repeat it. Repetition makes the through-line stick.',
  'Land a closing sentence that restates what the project proves. Don’t trail off into “yeah, so… that’s it.”',
  'Plan for the overrun. Mark two or three lines that can be cut live if time runs short.',
];

// Board-plan principles (SKILL.md Stage 3)
export const BOARD_PRINCIPLES = [
  'One idea per board. Crowded boards bury the argument.',
  'Lead with the hook. Board 1 lands the concept and the single most compelling image (the “money shot”).',
  'Drawings do the arguing. If a drawing needs a paragraph to explain, it isn’t working yet.',
  'End on resolution. The orthographic set near the end shows the idea holds up as a building.',
];
