import { Field, Area, Card } from './ui.jsx';
import { SCRIPT_COACHING } from '../data/content.js';

let _id = 0;
const uid = () => `s${Date.now()}${_id++}`;

// "1:30" -> seconds; tolerant of blank / bad input
function toSeconds(t) {
  if (!t) return null;
  const m = String(t).trim().match(/^(\d+):([0-5]?\d)$/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

export default function ScriptStage({ project, patch }) {
  const v = project.script;
  const limitSec = (project.intake.timeLimit || 0) * 60;

  const upd = (id, key, val) =>
    patch('script', { cues: v.cues.map((c) => (c.id === id ? { ...c, [key]: val } : c)) });
  const add = () =>
    patch('script', { cues: [...v.cues, { id: uid(), time: '', board: '', text: '', cut: false }] });
  const del = (id) => patch('script', { cues: v.cues.filter((c) => c.id !== id) });

  // last parseable cue time, for the pacing meter
  const lastSec = v.cues.reduce((acc, c) => {
    const s = toSeconds(c.time);
    return s != null && s > acc ? s : acc;
  }, 0);
  const pct = limitSec ? Math.min(100, Math.round((lastSec / limitSec) * 100)) : 0;
  const over = limitSec && lastSec > limitSec;

  return (
    <div className="stage">
      <div className="stage-head">
        <div className="stage-eyebrow">Stage 4</div>
        <h2>Speaking script</h2>
        <p>A script paced to your {project.intake.timeLimit || '—'}-minute limit, with timing and board cues so it’s usable while standing at the wall. Leave room — students almost always overrun.</p>
      </div>

      {limitSec > 0 && (
        <Card>
          <h3>Pacing</h3>
          <p className="card-sub">
            Last cue at <strong>{Math.floor(lastSec / 60)}:{String(lastSec % 60).padStart(2, '0')}</strong> of your {project.intake.timeLimit}-minute slot{over ? ' — over time, trim or mark lines [CUT].' : '.'}
          </p>
          <div className={`meter ${over ? 'over' : ''}`}><i style={{ width: `${pct}%` }} /></div>
        </Card>
      )}

      <Card variant="blue">
        <h3>Script</h3>
        <p className="card-sub">Open with the idea, not an apology. Mark lines that can be dropped live with the “cut if over” toggle.</p>
        {v.cues.map((c, i) => (
          <div className="repeat-item" key={c.id}>
            <div className="repeat-head">
              <div className="rh-title">
                <span className="pill">{c.time || '0:00'}</span>
                <span className="muted tiny">Board {c.board || '—'}</span>
                {c.cut && <span className="pill pill-ochre">CUT if over</span>}
              </div>
              {v.cues.length > 1 && (
                <button className="btn btn-danger btn-sm" onClick={() => del(c.id)}>Remove</button>
              )}
            </div>
            <div className="row">
              <div className="field" style={{ maxWidth: 120, flex: '0 0 120px' }}>
                <label>Time <span className="hint">m:ss</span></label>
                <input type="text" value={c.time} onChange={(e) => upd(c.id, 'time', e.target.value)} placeholder="0:00" />
              </div>
              <div className="field" style={{ maxWidth: 120, flex: '0 0 120px' }}>
                <label>Board</label>
                <input type="text" value={c.board} onChange={(e) => upd(c.id, 'board', e.target.value)} placeholder="1" />
              </div>
              <div className="field" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label className="check" style={{ borderBottom: 'none', padding: '10px 0' }}>
                  <input type="checkbox" checked={c.cut} onChange={(e) => upd(c.id, 'cut', e.target.checked)} />
                  <span style={{ textDecoration: 'none', color: 'var(--ink-2)' }}>Cut if running over</span>
                </label>
              </div>
            </div>
            <Area value={c.text} onChange={(val) => upd(c.id, 'text', val)} rows={2}
              placeholder={i === 0 ? 'Open with the site problem in one sentence, then the idea that answers it…' : 'What you say here — speak to the drawing, don’t read it aloud.'} />
          </div>
        ))}
        <div className="add-row">
          <button className="btn btn-ghost btn-sm" onClick={add}>+ Add cue</button>
        </div>
      </Card>

      <Card variant="ochre">
        <h3>Closing line</h3>
        <p className="card-sub">Land a sentence that restates what the project proves. Don’t trail off into “yeah, so… that’s it.”</p>
        <Field label="Closing line">
          <Area value={v.closingLine} onChange={(val) => patch('script', { closingLine: val })} rows={2}
            placeholder="What does the project prove?" />
        </Field>
      </Card>

      <Card>
        <h3>Coaching notes</h3>
        <ul className="inline-list">
          {SCRIPT_COACHING.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </Card>
    </div>
  );
}
