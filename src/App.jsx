import { useState } from 'react';
import { STAGES } from './data/content.js';
import { useProject } from './lib/useProject.js';
import IntakeStage from './components/IntakeStage.jsx';
import NarrativeStage from './components/NarrativeStage.jsx';
import BoardStage from './components/BoardStage.jsx';
import ScriptStage from './components/ScriptStage.jsx';
import DefenseStage from './components/DefenseStage.jsx';
import OverviewStage from './components/OverviewStage.jsx';
import ReferenceDrawer from './components/ReferenceDrawer.jsx';

// crude "is this stage started" heuristic, drives the nav check-marks
function isDone(id, p) {
  switch (id) {
    case 'intake': return !!(p.intake.oneLiner || p.intake.concept || p.intake.brief);
    case 'narrative': return Object.values(p.narrative.beats).some((b) => b && b.trim());
    case 'boards': return p.boards.items.some((b) => b.job || b.anchor);
    case 'script': return p.script.cues.some((c) => c.text && c.text.trim());
    case 'defense': return p.defense.questions.length > 0;
    default: return false;
  }
}

export default function App() {
  const { project, patch, reset } = useProject();
  const [active, setActive] = useState('intake');
  const [drawer, setDrawer] = useState(false);

  const idx = STAGES.findIndex((s) => s.id === active);
  const prev = STAGES[idx - 1];
  const next = STAGES[idx + 1];
  const go = (id) => { setActive(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const stageProps = { project, patch };
  const Stage = {
    intake: <IntakeStage {...stageProps} />,
    narrative: <NarrativeStage {...stageProps} />,
    boards: <BoardStage {...stageProps} />,
    script: <ScriptStage {...stageProps} />,
    defense: <DefenseStage {...stageProps} />,
    overview: <OverviewStage project={project} />,
  }[active];

  const onReset = () => {
    if (confirm('Clear all crit-prep data and start a new project? This cannot be undone.')) {
      reset();
      go('intake');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="mark">CRIT</span>
          <div>
            <h1>Crit Prep</h1>
            <div className="sub">blank page → crit-ready</div>
          </div>
        </div>
        <div className="header-actions">
          <input
            type="text"
            value={project.meta.projectName}
            onChange={(e) => patch('meta', { projectName: e.target.value })}
            placeholder="Project name…"
            style={{
              width: 200, background: 'rgba(255,255,255,0.08)', color: 'var(--paper)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          />
          <span className="save-dot"><i />saved locally</span>
        </div>
      </header>

      <nav className="app-nav">
        <div className="nav-label">Stages</div>
        {STAGES.map((s) => (
          <button
            key={s.id}
            className={`nav-item ${active === s.id ? 'active' : ''} ${isDone(s.id, project) ? 'done' : ''}`}
            onClick={() => go(s.id)}
          >
            <span className="no">{isDone(s.id, project) && active !== s.id ? '✓' : s.no}</span>
            <span>
              <span className="t">{s.title}</span>
              <span className="b">{s.blurb}</span>
            </span>
          </button>
        ))}
        <div className="nav-foot">
          <button className="btn btn-sm" style={{ width: '100%' }} onClick={onReset}>↺ New project</button>
        </div>
      </nav>

      <main className="app-main">
        {active !== 'overview' && (
          <div style={{ maxWidth: 880, margin: '0 auto -10px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-sm btn-ghost" onClick={() => setDrawer(true)}>📖 Reference for this stage</button>
          </div>
        )}

        {Stage}

        <div className="stage" style={{ paddingTop: 0 }}>
          <div className="stage-foot">
            {prev ? (
              <button className="btn" onClick={() => go(prev.id)}>← {prev.title}</button>
            ) : <span />}
            {next ? (
              <button className="btn btn-primary" onClick={() => go(next.id)}>{next.title} →</button>
            ) : <span />}
          </div>
        </div>
      </main>

      {drawer && <ReferenceDrawer stage={active} onClose={() => setDrawer(false)} />}
    </div>
  );
}
