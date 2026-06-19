import { computeLayout, TITLE_BLOCK_Y } from '../lib/layoutEngine.js';

// On-screen preview of a composited board. Uses the same computeLayout math as
// the PNG export, so what you see is what downloads.
export default function BoardSheet({ items, variant, projectName, boardNum }) {
  const placements = computeLayout(items, variant);
  return (
    <div className="board-sheet" style={{ aspectRatio: '1680 / 1188' }}>
      {placements.map((p) => (
        <div
          key={p.d.id}
          className="bs-draw"
          style={{
            left: `${p.rect.x * 100}%`,
            top: `${p.rect.y * 100}%`,
            width: `${p.rect.w * 100}%`,
            height: `${p.rect.h * 100}%`,
          }}
          title={p.d.label}
        >
          <img src={p.d.src} alt={p.d.label} />
          {(p.d.label || p.d.scale) && (
            <span className="bs-cap">{[p.d.label, p.d.scale].filter(Boolean).join('  ·  ')}</span>
          )}
        </div>
      ))}
      <div className="bs-title" style={{ top: `${TITLE_BLOCK_Y * 100}%` }}>
        <span className="bs-proj">{projectName || 'Untitled Project'}</span>
        <span className="bs-meta">BOARD {boardNum} · {variant.toUpperCase()}</span>
      </div>
    </div>
  );
}
