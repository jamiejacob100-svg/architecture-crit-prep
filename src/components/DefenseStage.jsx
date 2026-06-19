import { Field, Area, Card } from './ui.jsx';
import { QUESTION_CATEGORIES, ANSWER_TECHNIQUE, IDK_TECHNIQUE } from '../data/content.js';

let _id = 0;
const uid = () => `q${Date.now()}${_id++}`;

export default function DefenseStage({ project, patch }) {
  const v = project.defense;

  const addFromCat = (c) =>
    patch('defense', { questions: [...v.questions, { id: uid(), cat: c.cat, q: c.q, a: '' }] });
  const addBlank = () =>
    patch('defense', { questions: [...v.questions, { id: uid(), cat: '', q: '', a: '' }] });
  const upd = (id, key, val) =>
    patch('defense', { questions: v.questions.map((q) => (q.id === id ? { ...q, [key]: val } : q)) });
  const del = (id) =>
    patch('defense', { questions: v.questions.filter((q) => q.id !== id) });

  const setPrecedent = (i, val) => {
    const next = [...v.precedents];
    next[i] = val;
    patch('defense', { precedents: next });
  };
  const addPrecedent = () => patch('defense', { precedents: [...v.precedents, ''] });

  return (
    <div className="stage">
      <div className="stage-head">
        <div className="stage-eyebrow">Stage 6</div>
        <h2>Defense drill</h2>
        <p>The Q&amp;A is where crits are won or lost. Build a question bank for <em>this</em> project — especially the two or three questions you’d least like to be asked — and rehearse the answers.</p>
      </div>

      <Card variant="blue">
        <h3>The answer technique</h3>
        <p className="card-sub">A good crit answer has three beats. Handled this way, even a critical question becomes a chance to restate the idea.</p>
        <div className="row">
          {ANSWER_TECHNIQUE.map(([k, val], i) => (
            <div className="beat" key={k} style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
              <div className="beat-label"><span className="num">{i + 1}</span> {k}</div>
              <div className="beat-desc" style={{ margin: '2px 0 0' }}>{val}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3>Build the question bank</h3>
        <p className="card-sub">Add the categories that bite hardest for your project. Always include at least one “why not the obvious alternative?” and one on precedent.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
          {QUESTION_CATEGORIES.map((c) => (
            <button key={c.cat} className="btn btn-sm" onClick={() => addFromCat(c)} title={c.note}>
              + {c.cat}
            </button>
          ))}
          <button className="btn btn-sm btn-ghost" onClick={addBlank}>+ Custom</button>
        </div>
      </Card>

      {v.questions.length > 0 && (
        <Card variant="ochre">
          <h3>Rehearse answers</h3>
          <p className="card-sub">Acknowledge → reason → tie back to the concept. A defensible thought process beats false certainty.</p>
          {v.questions.map((q, i) => (
            <div className="repeat-item" key={q.id}>
              <div className="repeat-head">
                <div className="rh-title">
                  <span className="pill">Q{i + 1}</span>
                  {q.cat && <span className="muted tiny">{q.cat}</span>}
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => del(q.id)}>Remove</button>
              </div>
              <div className="field">
                <label>Question</label>
                <input type="text" value={q.q} onChange={(e) => upd(q.id, 'q', e.target.value)} placeholder="The question…" />
              </div>
              <div className="field">
                <label>Answer <span className="hint">acknowledge → reason → tie back</span></label>
                <Area value={q.a} onChange={(val) => upd(q.id, 'a', val)} rows={3} placeholder="Your rehearsed answer…" />
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card>
        <h3>Precedents</h3>
        <p className="card-sub">Name two or three and say specifically what you took or rejected. Don’t name a famous building you only vaguely know — critics may know it well.</p>
        {v.precedents.map((p, i) => (
          <div className="field" key={i}>
            <label>Precedent {i + 1}</label>
            <input type="text" value={p} onChange={(e) => setPrecedent(i, e.target.value)} placeholder="Project — what I took / rejected" />
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={addPrecedent}>+ Add precedent</button>
      </Card>

      <Card>
        <h3>The obvious alternative</h3>
        <p className="card-sub">Critics test whether you considered alternatives. Show you saw the obvious path and chose differently for a reason tied to the concept.</p>
        <Field label="The alternative I rejected, and why">
          <Area value={v.rejectedAlternative} onChange={(val) => patch('defense', { rejectedAlternative: val })} rows={2}
            placeholder="e.g. The obvious move was to face the entrance to the street; I didn’t because…" />
        </Field>
        <div className="note" style={{ marginTop: 4 }}>
          <strong>If you genuinely don’t know:</strong>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
            {IDK_TECHNIQUE.map((t, i) => <li key={i} style={{ fontSize: 12.5 }}>{t}</li>)}
          </ul>
        </div>
      </Card>
    </div>
  );
}
