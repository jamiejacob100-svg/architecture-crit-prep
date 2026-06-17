import { Field, Text, Area, Card } from './ui.jsx';
import { CONCEPT_PROMPTS } from '../data/content.js';

export default function IntakeStage({ project, patch }) {
  const v = project.intake;
  const set = (k) => (val) => patch('intake', { [k]: val });

  return (
    <div className="stage">
      <div className="stage-head">
        <div className="stage-eyebrow">Stage 1</div>
        <h2>Intake</h2>
        <p>Don’t fill everything at once — that just recreates blank-page paralysis. Get the essentials down; you can refine as you go.</p>
      </div>

      <Card variant="blue">
        <h3>The one-liner</h3>
        <p className="card-sub">The whole project in one sentence a non-architect would understand. If you can nail this, everything else hangs off it.</p>
        <Field label="One-sentence version">
          <Area value={v.oneLiner} onChange={set('oneLiner')} rows={2}
            placeholder="e.g. A community library that turns a forgotten canal edge into the town’s new front porch." />
        </Field>
      </Card>

      <Card>
        <h3>Project basics</h3>
        <p className="card-sub">The essentials a critic needs to orient. Infer and flag assumptions rather than leaving blanks.</p>
        <Field label="Brief / program" hint="what is the building or intervention, and for whom?">
          <Area value={v.brief} onChange={set('brief')} rows={2} placeholder="e.g. a community library on a canal-side site" />
        </Field>
        <Field label="Site" hint="where, and what’s distinctive about it?">
          <Area value={v.site} onChange={set('site')} rows={2} placeholder="What does the site demand?" />
        </Field>
        <Field label="Concept / big idea" hint="the one-sentence reason this project is what it is">
          <Area value={v.concept} onChange={set('concept')} rows={2}
            placeholder="If you can’t articulate this yet, use the concept-finding prompts below." />
        </Field>
        <div className="row">
          <Field label="Crit format">
            <select value={v.format} onChange={(e) => set('format')(e.target.value)}>
              <option value="pin-up">Pin-up (boards on a wall)</option>
              <option value="screen">Screen / projected</option>
            </select>
          </Field>
          <Field label="Time limit (min)">
            <input type="number" min="1" max="60" value={v.timeLimit}
              onChange={(e) => set('timeLimit')(Number(e.target.value))} />
          </Field>
          <Field label="Level / year">
            <Text value={v.level} onChange={set('level')} placeholder="e.g. UG Year 2" />
          </Field>
        </div>
        <Field label="Where the work is" hint="how finished, and how long until the crit?">
          <Text value={v.progress} onChange={set('progress')} placeholder="e.g. plans + section done, no detail yet, crit in 5 days" />
        </Field>
      </Card>

      <Card variant="ochre">
        <h3>Stuck on the concept?</h3>
        <p className="card-sub">If you’re genuinely blank, don’t interrogate yourself. Work through these prompts — the concept is usually already implicit in your choices.</p>
        <ul className="inline-list">
          {CONCEPT_PROMPTS.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
        <Field label="Working notes">
          <Area value={v.conceptNotes} onChange={set('conceptNotes')} rows={3}
            placeholder="Jot fragments here. Once a candidate concept appears, test it: does it explain the plan? the section? the materials?" />
        </Field>
      </Card>
    </div>
  );
}
