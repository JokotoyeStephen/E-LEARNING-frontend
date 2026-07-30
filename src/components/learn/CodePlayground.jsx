import { useEffect, useState } from 'react'

const RUNNABLE = new Set(['javascript', 'js'])

export default function CodePlayground({ language = 'javascript', starterCode = '' }) {
  const [code, setCode]     = useState(starterCode)
  const [output, setOutput] = useState(null)
  const [error, setError]   = useState(false)

  useEffect(() => { setCode(starterCode); setOutput(null); setError(false) }, [starterCode])

  const canRun = RUNNABLE.has((language || '').toLowerCase())

  const run = () => {
    if (!canRun) return
    const logs = []
    const sandboxConsole = {
      log:   (...args) => logs.push(args.map(stringify).join(' ')),
      error: (...args) => logs.push('⚠ ' + args.map(stringify).join(' ')),
      warn:  (...args) => logs.push('⚠ ' + args.map(stringify).join(' ')),
    }
    try {
      // Runs entirely in this tab, in the user's own session — equivalent to
      // typing into the browser devtools console. No network/DOM access is
      // provided beyond what `console` exposes above.
      const fn = new Function('console', code)
      fn(sandboxConsole)
      setError(false)
    } catch (err) {
      logs.push(String(err))
      setError(true)
    }
    setOutput(logs.length ? logs.join('\n') : '(no output — try a console.log)')
  }

  const reset = () => { setCode(starterCode); setOutput(null); setError(false) }

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Code playground {language && <span className="normal-case text-gray-400">· {language}</span>}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Reset</button>
          <button onClick={run} disabled={!canRun}
            title={canRun ? '' : `Live execution isn't available for ${language} in-browser yet — edit freely, then try it in your own environment.`}
            className="text-xs font-semibold bg-primary-600 text-white rounded-lg px-3 py-1.5 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed">
            ▶ Run
          </button>
        </div>
      </div>

      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        spellCheck={false}
        className="w-full font-mono text-sm text-gray-800 bg-white p-4 resize-y focus:outline-none"
        rows={8}
      />

      {!canRun && (
        <p className="text-xs text-amber-600 bg-amber-50 px-4 py-2">
          Live execution isn't available for {language} in-browser yet — edit freely here, then try the code in your own {language} environment.
        </p>
      )}

      {output != null && (
        <div className={`px-4 py-3 font-mono text-xs whitespace-pre-wrap border-t border-gray-100 ${error ? 'bg-red-50 text-red-700' : 'bg-gray-900 text-gray-100'}`}>
          {output}
        </div>
      )}
    </div>
  )
}

function stringify(v) {
  if (typeof v === 'string') return v
  try { return JSON.stringify(v) } catch { return String(v) }
}
