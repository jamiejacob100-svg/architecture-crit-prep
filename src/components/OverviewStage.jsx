import { useMemo, useState } from 'react';
import { Card } from './ui.jsx';
import { ARCS } from '../data/content.js';
import { projectToMarkdown, downloadMarkdown } from '../lib/exportMarkdown.js';

function Line({ label, value }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value && String(value).trim() ? value : <span className="ov-empty">—</span>}</dd>
    </>
  );
}

export default function OverviewStage({ project }) {
  const { intake, narrative, boards, script, defense } = project;
  const arc = ARCS.find((a) => a.id === narrative.arc) || ARCS[0];
  const md = useMemo(() => projectToMarkdown(project), [project]);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="stage">
      <div className="stage-head">
        <div className="stage-eyebrow">Stage 6</div>
        <h2>Review &amp; export</h2>
        <p>The whole prep on one page. Export it as Markdown to drop into your notes, or print it to carry to the wall.</p>
      </div>

      <Card>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => downloadMarkdown(project)}>⬇ Download .md</button>
          <button className="btn" onClick={copy}>{copied ? '✓ Copied' : '⧉ Copy Markdown'}</button>
          <button className="btn" onClick={() => window.print()}>⎙ Print</button>
        </div>
      </Card>

      <Card variant="blue">
        <div className="ov-section">
          <h3>1 · One-liner &amp; basics</h3>
          <dl className="kv">
            <Line label="One-liner" value={intake.oneLiner} />
            <Line label="Brief" value={intake.brief} />
            <Line label="Site" value={intake.site} />
            <Line label="Concept" value={intake.concept} />
            <Line label="Format" value={`${intake.format} · ${intake.timeLimit} min · ${intake.level || '—'}`} />
          </dl>
        </div>
      </Card>

      <Card>
        <div className="ov-section">
          <h3>2 · Narrative spine <span className="pill">{arc.name.split(' (')[0]}</span></h3>
          <dl className="kv">
            {arc.beats.map(([label]) => (
              <Line key={label} label={label} value={narrative.beats[label]} />
            ))}
          </dl>
          {narrative.throughLineFlags?.trim() && (
            <div className="note" style={{ marginTop: 12 }}><strong>Flagged weak points:</strong> {narrative.throughLineFlags}</div>
          )}
        </div>
      </Card>

      <Card>
        <div className="ov-section">
          <h3>3 · Board plan</h3>
          {boards.items.every((b) => !b.job && !b.anchor) ? (
            <p className="ov-empty">No boards filled in yet.</p>
          ) : (
            <div className="tbl-wrap">
              <table className="grid">
                <thead><tr><th>#</th><th>Job</th><th>Anchor</th><th>Support</th></tr></thead>
                <tbody>
                  {boards.items.map((b, i) => (
                    <tr key={b.id}>
                      <td>{i + 1}</td>
                      <td>{b.job || '—'}</td><td>{b.anchor || '—'}</td><td>{b.support || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="ov-section">
          <h3>4 · Script</h3>
          {script.cues.every((c) => !c.text) ? (
            <p className="ov-empty">No script written yet.</p>
          ) : (
            <ul className="inline-list">
              {script.cues.map((c) => (
                <li key={c.id}>
                  <strong>[{c.time || '—'} · Board {c.board || '—'}]</strong>{c.cut ? ' ⟨cut⟩ ' : ' '}
                  {c.text || <span className="ov-empty">—</span>}
                </li>
              ))}
            </ul>
          )}
          {script.closingLine?.trim() && (
            <div className="note note-blue" style={{ marginTop: 10 }}><strong>Closing:</strong> {script.closingLine}</div>
          )}
        </div>
      </Card>

      <Card>
        <div className="ov-section">
          <h3>5 · Defense drill</h3>
          {defense.questions.length === 0 ? (
            <p className="ov-empty">No questions added yet.</p>
          ) : (
            <ul className="inline-list">
              {defense.questions.map((q, i) => (
                <li key={q.id}>
                  <div><strong>Q{i + 1}{q.cat ? ` · ${q.cat}` : ''}:</strong> {q.q || <span className="ov-empty">—</span>}</div>
                  <div className="ov-q">A: {q.a || '—'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Card variant="ochre">
        <h3>Markdown</h3>
        <p className="card-sub">This mirrors the skill’s crit-prep template — fill it in fresh for each project.</p>
        <div className="md-preview">{md}</div>
      </Card>
    </div>
  );
}
