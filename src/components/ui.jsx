// Small shared form primitives used across stages.

export function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>
        {label} {hint && <span className="hint">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function Text({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function Area({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      rows={rows}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function Card({ children, variant, className = '' }) {
  const v = variant ? `card-${variant}` : '';
  return <div className={`card ${v} ${className}`.trim()}>{children}</div>;
}
