import {
  CONCEPT_PROMPTS, CONCEPT_TEST, ARCS, DRAWING_TYPES, LAYOUT_PRINCIPLES,
  LAYOUT_CHECKLIST, ANSWER_TECHNIQUE, QUESTION_CATEGORIES, IDK_TECHNIQUE,
  RED_FLAGS, SCRIPT_COACHING, BOARD_PRINCIPLES,
} from '../data/content.js';

const TITLES = {
  intake: 'Finding the concept',
  narrative: 'Narrative frameworks',
  boards: 'Drawing layout — type & scale',
  script: 'Speaking coaching',
  defense: 'Defense questions',
  overview: 'Crit-day reminders',
};

function Body({ stage }) {
  switch (stage) {
    case 'intake':
      return (
        <>
          <h4>Surfacing a concept from a blank page</h4>
          <p>The concept is usually already implicit in your choices — the job is to draw it out. Ask yourself:</p>
          <ul>{CONCEPT_PROMPTS.map((p, i) => <li key={i}>{p}</li>)}</ul>
          <div className="note">{CONCEPT_TEST}</div>
        </>
      );
    case 'narrative':
      return (
        <>
          <p>A strong presentation reads as: <em>here’s the problem the site/brief poses → here’s my idea → here’s how it shapes every decision → here’s the resolved building.</em></p>
          {ARCS.map((a) => (
            <div key={a.id} style={{ marginBottom: 14 }}>
              <h4>{a.name}</h4>
              <p>{a.when}</p>
              {a.risk && <p style={{ color: 'var(--ochre)' }}><strong>Risk:</strong> {a.risk}</p>}
            </div>
          ))}
          <div className="note">Match the arc to the project’s real strength. Ask what you’re proudest of — that usually points to the right arc.</div>
        </>
      );
    case 'boards':
      return (
        <>
          <h4>Board principles</h4>
          <ul>{BOARD_PRINCIPLES.map((p, i) => <li key={i}>{p}</li>)}</ul>
          <h4>Drawing types, broad to fine</h4>
          <div className="tbl-wrap">
            <table className="grid">
              <thead><tr><th>Type</th><th>Scales</th><th>Reads as</th></tr></thead>
              <tbody>
                {DRAWING_TYPES.map((d) => (
                  <tr key={d.type}><td>{d.type}</td><td>{d.scales}</td><td>{d.reads}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4>Core layout principles</h4>
          <ul>{LAYOUT_PRINCIPLES.map((p) => <li key={p.t}><strong>{p.t}.</strong> {p.d}</li>)}</ul>
          <h4>Quick checklist</h4>
          <ul>{LAYOUT_CHECKLIST.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </>
      );
    case 'script':
      return (
        <>
          <h4>Coaching notes</h4>
          <ul>{SCRIPT_COACHING.map((c, i) => <li key={i}>{c}</li>)}</ul>
          <div className="note note-blue">Rough budget: first ~15% landing the concept, the bulk on development and key moments, last ~15% on resolution and a clean closing line. Leave room — students almost always overrun.</div>
        </>
      );
    case 'defense':
      return (
        <>
          <h4>The answer technique</h4>
          <ul>{ANSWER_TECHNIQUE.map(([k, v]) => <li key={k}><strong>{k}</strong> {v}</li>)}</ul>
          <h4>Question categories</h4>
          <ul>{QUESTION_CATEGORIES.map((q) => <li key={q.cat}><strong>{q.cat}.</strong> {q.note}</li>)}</ul>
          <h4>Handling “I don’t know”</h4>
          <p>A bluff that unravels is far worse than a well-handled gap.</p>
          <ul>{IDK_TECHNIQUE.map((t, i) => <li key={i}>{t}</li>)}</ul>
          <h4>Red flags critics watch for</h4>
          <ul>{RED_FLAGS.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </>
      );
    default:
      return (
        <>
          <h4>On the day</h4>
          <ul>
            <li>Open with the idea, not an apology.</li>
            <li>Name the concept early and repeat it.</li>
            <li>Speak to the drawings, pointing as you go.</li>
            <li>Land your closing line; don’t trail off.</li>
            <li>“I don’t know” handled well beats a bluff.</li>
          </ul>
        </>
      );
  }
}

export default function ReferenceDrawer({ stage, onClose }) {
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Reference">
        <div className="drawer-head">
          <h3>{TITLES[stage] || 'Reference'}</h3>
          <button className="btn btn-sm" onClick={onClose}>Close ✕</button>
        </div>
        <div className="drawer-body">
          <Body stage={stage} />
        </div>
      </aside>
    </>
  );
}
