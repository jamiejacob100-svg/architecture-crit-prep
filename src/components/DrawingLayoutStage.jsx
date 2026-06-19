import { useRef, useState } from 'react';
import { Card } from './ui.jsx';
import BoardSheet from './BoardSheet.jsx';
import LayoutVariants from './LayoutVariants.jsx';
import { DRAWING_TYPE_OPTIONS, LAYOUT_VARIANTS } from '../data/content.js';
import {
  guessType, autoAssign, boardsFrom, suggestVariant, exportBoardPNG,
} from '../lib/layoutEngine.js';

let _id = 0;
const uid = () => `d${Date.now()}${_id++}`;

function readImage(file) {
  return new Promise((resolve) => {
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      resolve({
        id: uid(),
        src,
        name: file.name,
        label: file.name.replace(/\.[^.]+$/, ''),
        type: guessType(file.name),
        scale: '',
        board: 1,
        hero: false,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
      });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export default function DrawingLayoutStage({ drawings, setDrawings, project }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [variants, setVariants] = useState({}); // boardNum -> variant override
  const [busy, setBusy] = useState(false);

  const addFiles = async (fileList) => {
    const files = [...fileList].filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    const loaded = (await Promise.all(files.map(readImage))).filter(Boolean);
    setDrawings((prev) => {
      const next = [...prev, ...loaded];
      // auto-assign boards for everything so a useful layout appears immediately
      const assign = autoAssign(next);
      return next.map((d) => ({ ...d, board: assign[d.id] ?? d.board }));
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };

  const update = (id, key, val) =>
    setDrawings((prev) => prev.map((d) => (d.id === id ? { ...d, [key]: val } : d)));

  const remove = (id) =>
    setDrawings((prev) => {
      const gone = prev.find((d) => d.id === id);
      if (gone) URL.revokeObjectURL(gone.src);
      return prev.filter((d) => d.id !== id);
    });

  const autoArrange = () =>
    setDrawings((prev) => {
      const assign = autoAssign(prev);
      return prev.map((d) => ({ ...d, board: assign[d.id] ?? d.board }));
    });

  const boards = boardsFrom(drawings);
  const variantFor = (b) => variants[b.num] || suggestVariant(b.items, b.num);
  const setVariant = (num, v) => setVariants((prev) => ({ ...prev, [num]: v }));

  const meta = (b) => ({ projectName: project.meta.projectName, boardNum: b.num });

  const downloadAll = async () => {
    setBusy(true);
    try {
      for (const b of boards) {
        // eslint-disable-next-line no-await-in-loop
        await exportBoardPNG(b.items, variantFor(b), meta(b));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stage">
      <div className="stage-head">
        <div className="stage-eyebrow">Stage 4</div>
        <h2>Drawing layouts</h2>
        <p>Drop in images of your actual drawings. The app classifies them, assigns them to boards site→detail, and composites several layout options per board so you have something concrete to react to — not just a description.</p>
      </div>

      <Card variant="blue">
        <h3>1 · Drop your drawings</h3>
        <p className="card-sub">PNG or JPG scans/photos. Everything stays in your browser — nothing is uploaded to a server.</p>
        <div
          className={`dropzone ${dragging ? 'drag' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <div className="dz-icon">⬇</div>
          <div className="dz-main">Drag &amp; drop drawing images here</div>
          <div className="dz-sub">or click to browse · multiple files OK</div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
          />
        </div>
        <p className="tiny muted" style={{ marginTop: 10 }}>
          Note: uploaded images live in this browser tab only — they’re cleared if you reload. Your text (concept, script, etc.) is still saved automatically; just re-drop images next session.
        </p>
      </Card>

      {drawings.length > 0 && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>2 · Classify &amp; assign</h3>
            <button className="btn btn-sm" onClick={autoArrange}>↻ Auto-arrange boards</button>
          </div>
          <p className="card-sub">Confirm each drawing’s type and scale — the whole layout logic depends on it. A misread section-vs-elevation throws off the arrangement.</p>
          <div className="tbl-wrap">
            <table className="grid">
              <thead>
                <tr><th></th><th>Label</th><th>Type</th><th>Scale</th><th>Board</th><th>Hero</th><th></th></tr>
              </thead>
              <tbody>
                {drawings.map((d) => (
                  <tr key={d.id}>
                    <td><img src={d.src} alt="" className="thumb" /></td>
                    <td><input type="text" value={d.label} onChange={(e) => update(d.id, 'label', e.target.value)} /></td>
                    <td>
                      <select value={d.type} onChange={(e) => update(d.id, 'type', e.target.value)}>
                        {DRAWING_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </td>
                    <td><input type="text" value={d.scale} onChange={(e) => update(d.id, 'scale', e.target.value)} placeholder="1:100" style={{ width: 70 }} /></td>
                    <td><input type="number" min="1" value={d.board} onChange={(e) => update(d.id, 'board', Number(e.target.value) || 1)} style={{ width: 56 }} /></td>
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={d.hero} onChange={(e) => update(d.id, 'hero', e.target.checked)} title="Mark as the hero / lead image" />
                    </td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => remove(d.id)} aria-label="Remove">✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {drawings.length === 0 && (
        <Card>
          <h3>The layout variants</h3>
          <p className="card-sub">Once you drop drawings in, each board is composited in these arrangements for you to choose between.</p>
          <LayoutVariants />
        </Card>
      )}

      {boards.length > 0 && (
        <Card variant="ochre">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ margin: 0 }}>3 · Generated boards</h3>
            <button className="btn btn-primary btn-sm" onClick={downloadAll} disabled={busy}>
              {busy ? 'Exporting…' : '⬇ Download all boards (PNG)'}
            </button>
          </div>
          <p className="card-sub">Each board is a starting point — switch the variant to compare, then export. You still control final sizes and titles.</p>

          {boards.map((b) => {
            const v = variantFor(b);
            const suggested = suggestVariant(b.items, b.num);
            return (
              <div className="gen-board" key={b.num}>
                <div className="gen-board-head">
                  <div className="rh-title">
                    <span className="pill">Board {b.num}</span>
                    <span className="muted tiny">{b.items.length} drawing{b.items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="variant-tabs">
                      {LAYOUT_VARIANTS.map((lv) => (
                        <button
                          key={lv.id}
                          className={`vt ${v === lv.id ? 'on' : ''}`}
                          onClick={() => setVariant(b.num, lv.id)}
                          title={lv.d}
                        >
                          {lv.name}{suggested === lv.id ? ' ★' : ''}
                        </button>
                      ))}
                    </div>
                    <button className="btn btn-sm" onClick={() => exportBoardPNG(b.items, v, meta(b))}>⬇ PNG</button>
                  </div>
                </div>
                <BoardSheet items={b.items} variant={v} projectName={project.meta.projectName} boardNum={b.num} />
                <p className="tiny muted" style={{ marginTop: 6 }}>★ = suggested for this board ({LAYOUT_VARIANTS.find((x) => x.id === suggested)?.d})</p>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
