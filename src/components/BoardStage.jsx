import { Card } from './ui.jsx';
import LayoutVariants from './LayoutVariants.jsx';
import {
  BOARD_PRINCIPLES, LAYOUT_PRINCIPLES, LAYOUT_CHECKLIST, DRAWING_TYPE_OPTIONS,
} from '../data/content.js';

let _id = 0;
const uid = (p) => `${p}${Date.now()}${_id++}`;

export default function BoardStage({ project, patch }) {
  const v = project.boards;

  // ---- boards ----
  const updBoard = (id, key, val) =>
    patch('boards', { items: v.items.map((b) => (b.id === id ? { ...b, [key]: val } : b)) });
  const addBoard = () =>
    patch('boards', { items: [...v.items, { id: uid('b'), job: '', anchor: '', support: '' }] });
  const delBoard = (id) =>
    patch('boards', { items: v.items.filter((b) => b.id !== id) });

  // ---- orthographics ----
  const updOrtho = (id, key, val) =>
    patch('boards', { orthographics: v.orthographics.map((o) => (o.id === id ? { ...o, [key]: val } : o)) });
  const addOrtho = () =>
    patch('boards', { orthographics: [...v.orthographics, { id: uid('o'), drawing: '', type: 'plan', scale: '', board: '', aligns: '' }] });
  const delOrtho = (id) =>
    patch('boards', { orthographics: v.orthographics.filter((o) => o.id !== id) });

  // ---- checklist ----
  const toggle = (i) => patch('boards', { checklist: { ...v.checklist, [i]: !v.checklist[i] } });

  return (
    <div className="stage">
      <div className="stage-head">
        <div className="stage-eyebrow">Stage 3</div>
        <h2>Board plan</h2>
        <p>Critics read boards spatially — usually left to right, top to bottom — so sequence and hierarchy do a lot of the talking before you say a word.</p>
      </div>

      <Card variant="blue">
        <h3>Principles</h3>
        <ul className="inline-list">
          {BOARD_PRINCIPLES.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </Card>

      <Card>
        <h3>Board-by-board plan</h3>
        <p className="card-sub">For each board, state its job in the narrative, the drawing that anchors it, and supporting material. The biggest drawing should be the most important point.</p>
        {v.items.map((b, i) => (
          <div className="repeat-item" key={b.id}>
            <div className="repeat-head">
              <div className="rh-title"><span className="pill">Board {i + 1}</span></div>
              {v.items.length > 1 && (
                <button className="btn btn-danger btn-sm" onClick={() => delBoard(b.id)}>Remove</button>
              )}
            </div>
            <div className="field">
              <label>Job in the story</label>
              <input type="text" value={b.job} onChange={(e) => updBoard(b.id, 'job', e.target.value)}
                placeholder={i === 0 ? 'Land the concept + the money shot' : 'One idea this board makes'} />
            </div>
            <div className="row">
              <div className="field">
                <label>Anchor drawing(s)</label>
                <input type="text" value={b.anchor} onChange={(e) => updBoard(b.id, 'anchor', e.target.value)}
                  placeholder="e.g. river perspective" />
              </div>
              <div className="field">
                <label>Supporting material</label>
                <input type="text" value={b.support} onChange={(e) => updBoard(b.id, 'support', e.target.value)}
                  placeholder="e.g. concept diagram, site photos" />
              </div>
            </div>
          </div>
        ))}
        <div className="add-row">
          <button className="btn btn-ghost btn-sm" onClick={addBoard}>+ Add board</button>
        </div>
      </Card>

      <Card variant="ochre">
        <h3>Orthographic set — ordered broad to fine</h3>
        <p className="card-sub">Plans, sections, elevations, details aren’t placed by eye. Order site → plan → section/elevation → detail, group by type, and note which drawings project onto each other.</p>
        <div className="tbl-wrap">
          <table className="grid">
            <thead>
              <tr><th>Drawing</th><th>Type</th><th>Scale</th><th>Board</th><th>Aligns with</th><th /></tr>
            </thead>
            <tbody>
              {v.orthographics.map((o) => (
                <tr key={o.id}>
                  <td><input type="text" value={o.drawing} onChange={(e) => updOrtho(o.id, 'drawing', e.target.value)} placeholder="Ground floor plan" /></td>
                  <td>
                    <select value={o.type} onChange={(e) => updOrtho(o.id, 'type', e.target.value)}>
                      {DRAWING_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td><input type="text" value={o.scale} onChange={(e) => updOrtho(o.id, 'scale', e.target.value)} placeholder="1:100" style={{ width: 70 }} /></td>
                  <td><input type="text" value={o.board} onChange={(e) => updOrtho(o.id, 'board', e.target.value)} placeholder="3" style={{ width: 52 }} /></td>
                  <td><input type="text" value={o.aligns} onChange={(e) => updOrtho(o.id, 'aligns', e.target.value)} placeholder="section A" /></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => delOrtho(o.id)} aria-label="Remove row">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="add-row">
          <button className="btn btn-ghost btn-sm" onClick={addOrtho}>+ Add drawing</button>
        </div>
      </Card>

      <Card>
        <h3>Layout variants</h3>
        <p className="card-sub">If you composite real drawings onto boards, these are the arrangement patterns to try per board. Pick the one that fits each board’s job.</p>
        <LayoutVariants />
        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 13.5 }}>Core layout principles</summary>
          <ul className="inline-list" style={{ marginTop: 8 }}>
            {LAYOUT_PRINCIPLES.map((p) => <li key={p.t}><strong>{p.t}.</strong> {p.d}</li>)}
          </ul>
        </details>
      </Card>

      <Card variant="blue">
        <h3>Layout checklist</h3>
        <p className="card-sub">At a pin-up, critics check these. Missing scale notation reads as incomplete.</p>
        {LAYOUT_CHECKLIST.map((c, i) => (
          <label key={i} className={`check ${v.checklist[i] ? 'on' : ''}`}>
            <input type="checkbox" checked={!!v.checklist[i]} onChange={() => toggle(i)} />
            <span>{c}</span>
          </label>
        ))}
      </Card>
    </div>
  );
}
