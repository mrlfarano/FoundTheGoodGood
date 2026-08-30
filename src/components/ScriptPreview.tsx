import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Terminal, Package } from 'lucide-react'
import type { OS, Tool } from '../data/tools'
import { CopyButton } from './CopyButton'
import { generateScript } from '../lib/generateScript'

interface ScriptPreviewProps {
  selectedTools: Tool[]
  selectedOs: OS
}

// Simple syntax highlighter
function highlightLine(line: string): React.ReactNode {
  if (line.startsWith('#') || line.startsWith('<#') || line.startsWith('.SYNOPSIS') || line.startsWith('.SYNOPSIS') || line === '#>') {
    return <span className="code-comment">{line}</span>
  }
  if (line.startsWith('echo ') || line.startsWith('Write-Host ')) {
    const parts = line.split('"')
    return (
      <span>
        <span className="code-echo">{parts[0]}"</span>
        <span className="code-string">{parts.slice(1, -1).join('"')}</span>
        <span className="code-echo">"</span>
        {parts[parts.length - 1] && <span className="code-flag">{parts[parts.length - 1]}</span>}
      </span>
    )
  }
  if (line.startsWith('brew ')) {
    return <span className="code-brew">{line}</span>
  }
  if (line.startsWith('winget ')) {
    return <span className="code-brew">{line}</span>
  }
  if (line.startsWith('sudo ') || line.startsWith('apt-get ')) {
    return <span className="code-command">{line}</span>
  }
  if (line.startsWith('#!/') || line.startsWith('#Requires') || line.startsWith('set -e') || line.startsWith('$ErrorAction')) {
    return <span className="code-shebang">{line}</span>
  }
  if (line.startsWith('curl ') || line.startsWith('npm ') || line.startsWith('pip ') || line.startsWith('git clone') || line.startsWith('/bin/bash')) {
    return <span className="code-command">{line}</span>
  }
  if (line.startsWith('if ') || line.startsWith('fi') || line.startsWith('else') || line.startsWith('function ')) {
    return <span className="code-flag">{line}</span>
  }
  // heredoc delimiters and cat-write commands
  if (line.startsWith('cat >') || /^[A-Z_]+_EOF$/.test(line.trim())) {
    return <span className="code-config">{line}</span>
  }
  // git config commands
  if (line.startsWith('git config')) {
    return <span className="code-command">{line}</span>
  }
  // cp backup lines
  if (line.trimStart().startsWith('cp ')) {
    return <span className="code-command">{line}</span>
  }
  // typeset, export, source — config content
  if (line.trimStart().startsWith('typeset ') || line.trimStart().startsWith('export ') || line.trimStart().startsWith('source ')) {
    return <span className="code-config-body">{line}</span>
  }
  // alias lines
  if (line.trimStart().startsWith('alias ')) {
    return <span className="code-config-body">{line}</span>
  }
  // command -v lines
  if (line.trimStart().startsWith('command -v') || line.trimStart().startsWith('command -v')) {
    return <span className="code-config-body">{line}</span>
  }
  return <span style={{ color: '#94a3b8' }}>{line}</span>
}

const OS_LABELS: Record<OS, string> = {
  macos: 'macOS',
  linux: 'Linux',
  windows: 'Windows',
}

const FILE_EXTENSIONS: Record<OS, string> = {
  macos: 'sh',
  linux: 'sh',
  windows: 'ps1',
}

export function ScriptPreview({ selectedTools, selectedOs }: ScriptPreviewProps) {
  const script = generateScript(selectedTools, selectedOs)
  const codeRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const ext = FILE_EXTENSIONS[selectedOs]
    const blob = new Blob([script], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `foundthegoodgood-${selectedOs}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const isEmpty = selectedTools.length === 0
  const availableCount = selectedTools.filter(t => t.install[selectedOs] !== null).length

  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      style={{
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.015)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            <Terminal size={14} color="#6366f1" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm" style={{ color: '#e2e8f0' }}>
                Generated Script
              </h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-mono"
                style={{
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: '#818cf8',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                {OS_LABELS[selectedOs]} · .{FILE_EXTENSIONS[selectedOs]}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: '#334155' }}>
              {availableCount} tool{availableCount !== 1 ? 's' : ''} compatible with {OS_LABELS[selectedOs]}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        {!isEmpty && script && (
          <div className="flex items-center gap-2">
            <CopyButton
              text={script}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8',
              }}
            >
              Copy
            </CopyButton>
            <motion.button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
              }}
              whileHover={{ scale: 1.02, background: 'rgba(99, 102, 241, 0.22)' }}
              whileTap={{ scale: 0.97 }}
            >
              <Download size={14} />
              Download .{FILE_EXTENSIONS[selectedOs]}
            </motion.button>
          </div>
        )}
      </div>

      {/* Code block */}
      <div
        ref={codeRef}
        className="relative overflow-auto"
        style={{ maxHeight: '480px', minHeight: '200px' }}
      >
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 px-8 text-center"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <Package size={20} color="#334155" />
              </div>
              <p className="text-sm" style={{ color: '#334155' }}>
                Select tools above to generate your install script
              </p>
            </motion.div>
          ) : availableCount === 0 ? (
            <motion.div
              key="no-compat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 px-8 text-center"
            >
              <p className="text-sm" style={{ color: '#334155' }}>
                None of your selected tools have a{' '}
                <span style={{ color: '#64748b' }}>{OS_LABELS[selectedOs]}</span> installer.
                <br />Try switching OS or selecting different tools.
              </p>
            </motion.div>
          ) : (
            <motion.pre
              key={`script-${selectedOs}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-5 text-xs leading-relaxed font-mono overflow-x-auto"
              style={{ margin: 0, color: '#94a3b8' }}
            >
              {script.split('\n').map((line, i) => (
                <div key={i} className="flex">
                  <span
                    className="select-none mr-4 text-right font-mono"
                    style={{
                      color: '#1e293b',
                      minWidth: '2ch',
                      userSelect: 'none',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1">{highlightLine(line)}</span>
                </div>
              ))}
            </motion.pre>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
