import { Field, Area, Card } from './ui.jsx';
import { ARCS } from '../data/content.js';

export default function NarrativeStage({ project, patch }) {
  const v = project.narrative;
  const arc = ARCS.find((a) => a.id === v.arc) || ARCS[0];

  const selectArc = (id) => patch('narrative', { arc: id });
  const setBeat = (label) => (val) =>
    patch('narrative', { beats: { ...v.beats, [label]: val } });

  return (
    <div className="stage">
      <div className="stage-head">
        <div className="stage-eyebrow">Stage 2</div>
        <h2>Narrative spine</h2>
        <p>Architecture crits reward a clear through-line. The test of a good spine: every board and every decision traces back to the concept. If something doesn’t, it needs a reason — or it’s a weak point a critic will find first.</p>
      </div>

      <Card>
        <h3>Choose an arc</h3>
        <p className="card-sub">Match the arc to the project’s real strength — a beautifully atmospheric project shouldn’t be forced into a dry problem-led structure.</p>
        <div className="arc-grid">
          {ARCS.map((a) => (
            <button key={a.id} className={`arc-opt ${a.id === v.arc ? 'sel' : ''}`} onClick={() => selectArc(a.id)}>
              <div className="arc-name">
                {a.id === v.arc && <span className="pill">selected</span>}
                {a.name}
              </div>
              <div className="arc-when">{a.when}</div>
              {a.risk && <div className="arc-risk">Risk: {a.risk}</div>}
            </button>
          ))}
        </div>
      </Card>

      <Card variant="blue">
        <h3>Write the beats</h3>
        <p className="card-sub">Fill in what you actually say at each beat of the <strong>{arc.name}</strong> arc.</p>
        {arc.beats.map(([label, desc], i) => (
          <div className="beat" key={label}>
            <div className="beat-label"><span className="num">{i + 1}</span> {label}</div>
            <div className="beat-desc">{desc}</div>
            <Area value={v.beats[label] || ''} onChange={setBeat(label)} rows={2}
              placeholder="Your line for this beat…" />
          </div>
        ))}
      </Card>

      <Card variant="ochre">
        <h3>Through-line check</h3>
        <p className="card-sub">Does every beat trace back to the concept? Flag any that don’t — better you find the weak point than the critic does.</p>
        <Field label="Weak points / decisions that don’t yet follow from the concept">
          <Area value={v.throughLineFlags} onChange={(val) => patch('narrative', { throughLineFlags: val })} rows={3}
            placeholder="e.g. the roof form doesn’t obviously follow from the concept — needs a reason or it’s a target." />
        </Field>
      </Card>
    </div>
  );
}
