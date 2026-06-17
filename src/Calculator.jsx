import { useCallback, useEffect, useReducer } from 'react'

const SYMBOLS = { '/': '÷', '*': '×', '-': '−', '+': '+' }

function compute(a, b, op) {
  a = parseFloat(a)
  b = parseFloat(b)
  let r
  switch (op) {
    case '+': r = a + b; break
    case '-': r = a - b; break
    case '*': r = a * b; break
    case '/': r = b === 0 ? NaN : a / b; break
    default: return b
  }
  // Trim floating-point noise (0.1 + 0.2 -> 0.3).
  return Math.round((r + Number.EPSILON) * 1e10) / 1e10
}

const initialState = {
  current: '0',
  previous: null,
  operator: null,
  history: '',
  resetNext: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'number': {
      const { current, resetNext } = state
      const num = action.value
      const next = resetNext ? num : current === '0' ? num : current + num
      return { ...state, current: next, resetNext: false }
    }
    case 'decimal': {
      if (state.resetNext) return { ...state, current: '0.', resetNext: false }
      if (state.current.includes('.')) return state
      return { ...state, current: state.current + '.' }
    }
    case 'operator': {
      const { previous, current, operator, resetNext } = state
      const op = action.value
      let newPrevious = current
      let newCurrent = current
      if (operator && !resetNext) {
        const result = compute(previous, current, operator)
        newCurrent = isNaN(result) ? 'Error' : String(result)
        newPrevious = newCurrent
      }
      return {
        ...state,
        previous: newPrevious,
        current: newCurrent,
        operator: op,
        history: `${newPrevious} ${SYMBOLS[op]}`,
        resetNext: true,
      }
    }
    case 'equals': {
      const { previous, current, operator } = state
      if (operator === null || previous === null) return state
      const result = compute(previous, current, operator)
      return {
        ...initialState,
        current: isNaN(result) ? 'Error' : String(result),
        history: `${previous} ${SYMBOLS[operator]} ${current} =`,
        resetNext: true,
      }
    }
    case 'clear':
      return { ...initialState }
    case 'sign': {
      if (state.current === '0' || state.current === 'Error') return state
      const next = state.current.startsWith('-')
        ? state.current.slice(1)
        : '-' + state.current
      return { ...state, current: next }
    }
    case 'percent':
      return { ...state, current: String(parseFloat(state.current) / 100) }
    case 'backspace': {
      const next = state.current.length > 1 ? state.current.slice(0, -1) : '0'
      return { ...state, current: next }
    }
    default:
      return state
  }
}

const KEYS = [
  { label: 'AC', cls: 'func', action: { type: 'clear' } },
  { label: '±', cls: 'func', action: { type: 'sign' } },
  { label: '%', cls: 'func', action: { type: 'percent' } },
  { label: '÷', cls: 'op', action: { type: 'operator', value: '/' } },
  { label: '7', action: { type: 'number', value: '7' } },
  { label: '8', action: { type: 'number', value: '8' } },
  { label: '9', action: { type: 'number', value: '9' } },
  { label: '×', cls: 'op', action: { type: 'operator', value: '*' } },
  { label: '4', action: { type: 'number', value: '4' } },
  { label: '5', action: { type: 'number', value: '5' } },
  { label: '6', action: { type: 'number', value: '6' } },
  { label: '−', cls: 'op', action: { type: 'operator', value: '-' } },
  { label: '1', action: { type: 'number', value: '1' } },
  { label: '2', action: { type: 'number', value: '2' } },
  { label: '3', action: { type: 'number', value: '3' } },
  { label: '+', cls: 'op', action: { type: 'operator', value: '+' } },
  { label: '0', cls: 'span-2', action: { type: 'number', value: '0' } },
  { label: '.', action: { type: 'decimal' } },
  { label: '=', cls: 'equals', action: { type: 'equals' } },
]

export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleKey = useCallback((e) => {
    if (e.key >= '0' && e.key <= '9') dispatch({ type: 'number', value: e.key })
    else if (['+', '-', '*', '/'].includes(e.key)) dispatch({ type: 'operator', value: e.key })
    else if (e.key === '.') dispatch({ type: 'decimal' })
    else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); dispatch({ type: 'equals' }) }
    else if (e.key === 'Escape') dispatch({ type: 'clear' })
    else if (e.key === 'Backspace') dispatch({ type: 'backspace' })
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div className="calculator">
      <div className="display">
        <div className="history">{state.history}</div>
        <div className="current">{state.current}</div>
      </div>
      <div className="buttons">
        {KEYS.map((k) => (
          <button
            key={k.label}
            className={k.cls || ''}
            onClick={() => dispatch(k.action)}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  )
}
