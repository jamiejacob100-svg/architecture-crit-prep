import { useMemo } from 'react'

const PALETTE = ['#f38ba8', '#89b4fa', '#a6e3a1', '#fab387', '#cba6f7', '#f9e2af', '#94e2d5']
const COUNT = 40

const rand = (min, max) => Math.random() * (max - min) + min

export default function BgNumbers() {
  // Generated once on mount so the numbers stay put across re-renders.
  const numbers = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        id: i,
        digit: Math.floor(Math.random() * 10),
        left: `${rand(0, 100)}vw`,
        top: `${rand(0, 100)}vh`,
        fontSize: `${rand(30, 100)}px`,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        rot: `${rand(-20, 20)}deg`,
        dur: `${rand(5, 11)}s`,
        delay: `${-rand(0, 8)}s`,
        opacity: rand(0.3, 0.65).toFixed(2),
      })),
    []
  )

  return (
    <div className="bg-numbers" aria-hidden="true">
      {numbers.map((n) => (
        <span
          key={n.id}
          className="bg-num"
          style={{
            left: n.left,
            top: n.top,
            fontSize: n.fontSize,
            color: n.color,
            opacity: n.opacity,
            '--rot': n.rot,
            '--dur': n.dur,
            '--delay': n.delay,
          }}
        >
          {n.digit}
        </span>
      ))}
    </div>
  )
}
