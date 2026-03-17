import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Terminal, Package } from 'lucide-react'
import type { OS, Tool } from '../data/tools'
import { CopyButton } from './CopyButton'

interface ScriptPreviewProps {
  selectedTools: Tool[]
  selectedOs: OS
}

function generateMacOSScript(tools: Tool[]): string {
  const lines: string[] = [
    '#!/bin/bash',
    '# ═══════════════════════════════════════════════════════════',
    '# FoundTheGoodGood — macOS Install Script',
    `# Generated: ${new Date().toISOString().split('T')[0]}`,
    `# Tools: ${tools.map(t => t.name).join(', ')}`,
    '# ═══════════════════════════════════════════════════════════',
    '',
    'set -e',
    '',
    'echo "🚀 Starting FoundTheGoodGood installation..."',
    'echo ""',
  ]

  // Check for Homebrew first
  const hasHomebrew = tools.some(t => t.id === 'homebrew')
  const brewTools = tools.filter(t => {
    if (t.id === 'homebrew') return false
    const cmd = t.install.macos ?? ''
    return cmd.startsWith('brew install') || cmd.startsWith('brew install --cask')
  })

  const nonBrewTools = tools.filter(t => {
    if (t.id === 'homebrew') return false
    const cmd = t.install.macos ?? ''
    return !cmd.startsWith('brew install')
  })

  if (hasHomebrew) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# Homebrew')
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('echo "📦 Installing Homebrew..."')
    lines.push('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"')
    lines.push('')
  } else {
    lines.push('# Check for Homebrew')
    lines.push('if ! command -v brew &>/dev/null; then')
    lines.push('  echo "⚠️  Homebrew not found. Install it first: https://brew.sh"')
    lines.push('  echo "   /bin/bash -c \\"\\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\\""')
    lines.push('fi')
    lines.push('')
  }

  // Group brew tools
  const plainBrewInstalls = brewTools.filter(t => {
    const cmd = t.install.macos ?? ''
    return cmd === `brew install ${cmd.replace('brew install ', '')}` && !cmd.includes('--cask') && !cmd.includes('/')
  })

  const specialBrewInstalls = brewTools.filter(t => {
    const cmd = t.install.macos ?? ''
    return cmd.includes('--cask') || cmd.includes('/')
  })

  if (plainBrewInstalls.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# Homebrew packages')
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('echo "🍺 Installing Homebrew packages..."')
    const packages = plainBrewInstalls.map(t => (t.install.macos ?? '').replace('brew install ', ''))
    lines.push(`brew install ${packages.join(' \\\n  ')}`)
    lines.push('')
  }

  if (specialBrewInstalls.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# Homebrew casks & taps')
    lines.push('# ─────────────────────────────────────────────────────────')
    for (const tool of specialBrewInstalls) {
      lines.push(`echo "📥 Installing ${tool.name}..."`)
      lines.push(tool.install.macos ?? '')
    }
    lines.push('')
  }

  if (nonBrewTools.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# Direct installers')
    lines.push('# ─────────────────────────────────────────────────────────')
    for (const tool of nonBrewTools) {
      const cmd = tool.install.macos
      if (!cmd) continue
      lines.push(`echo "📥 Installing ${tool.name}..."`)
      lines.push(cmd)
      lines.push('')
    }
  }

  lines.push('echo ""')
  lines.push('echo "✅ Done! Your dev environment is ready."')
  lines.push('echo "💡 You may need to restart your terminal for some changes to take effect."')

  return lines.join('\n')
}

function generateLinuxScript(tools: Tool[]): string {
  const lines: string[] = [
    '#!/bin/bash',
    '# ═══════════════════════════════════════════════════════════',
    '# FoundTheGoodGood — Linux Install Script',
    `# Generated: ${new Date().toISOString().split('T')[0]}`,
    `# Tools: ${tools.map(t => t.name).join(', ')}`,
    '# ═══════════════════════════════════════════════════════════',
    '',
    'set -e',
    '',
    '# Detect distro',
    'if [ -f /etc/os-release ]; then',
    '  . /etc/os-release',
    '  DISTRO=$ID',
    'else',
    '  DISTRO="unknown"',
    'fi',
    '',
    'echo "🚀 Starting FoundTheGoodGood installation on $DISTRO..."',
    'echo ""',
    '',
    '# Update package list',
    'echo "🔄 Updating package lists..."',
    'sudo apt-get update -qq',
    '',
  ]

  const aptTools = tools.filter(t => {
    const cmd = t.install.linux ?? ''
    return cmd.startsWith('sudo apt-get install') && !cmd.includes('&&')
  })

  const otherTools = tools.filter(t => {
    const cmd = t.install.linux ?? ''
    return !(cmd.startsWith('sudo apt-get install') && !cmd.includes('&&'))
  })

  if (aptTools.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# APT packages')
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('echo "📦 Installing APT packages..."')
    const packages = aptTools.map(t => (t.install.linux ?? '').replace('sudo apt-get install -y ', ''))
    lines.push(`sudo apt-get install -y ${packages.join(' \\\n  ')}`)
    lines.push('')
  }

  if (otherTools.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# Direct installers & other package managers')
    lines.push('# ─────────────────────────────────────────────────────────')
    for (const tool of otherTools) {
      const cmd = tool.install.linux
      if (!cmd) continue
      lines.push(`echo "📥 Installing ${tool.name}..."`)
      lines.push(cmd)
      lines.push('')
    }
  }

  lines.push('echo ""')
  lines.push('echo "✅ Done! Your dev environment is ready."')
  lines.push('echo "💡 You may need to restart your terminal for some changes to take effect."')

  return lines.join('\n')
}

function generateWindowsScript(tools: Tool[]): string {
  const lines: string[] = [
    '#Requires -Version 5.1',
    '<#',
    '.SYNOPSIS',
    '  FoundTheGoodGood — Windows Install Script',
    `  Generated: ${new Date().toISOString().split('T')[0]}`,
    `  Tools: ${tools.map(t => t.name).join(', ')}`,
    '#>',
    '',
    '$ErrorActionPreference = "Stop"',
    '',
    'Write-Host "🚀 Starting FoundTheGoodGood installation..." -ForegroundColor Cyan',
    'Write-Host ""',
    '',
    '# Check for winget',
    'if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {',
    '  Write-Host "❌ winget not found. Install App Installer from the Microsoft Store." -ForegroundColor Red',
    '  Start-Process "ms-windows-store://pdp/?ProductId=9NBLGGH4NNS1"',
    '  exit 1',
    '}',
    '',
    '# Check for npm (for npm-based installs)',
    'function Test-NodeNpm {',
    '  return (Get-Command npm -ErrorAction SilentlyContinue) -ne $null',
    '}',
    '',
  ]

  const wingetTools = tools.filter(t => {
    const cmd = t.install.windows ?? ''
    return cmd.startsWith('winget install')
  })

  const npmTools = tools.filter(t => {
    const cmd = t.install.windows ?? ''
    return cmd.startsWith('npm install')
  })

  const pipTools = tools.filter(t => {
    const cmd = t.install.windows ?? ''
    return cmd.startsWith('pip install')
  })

  if (wingetTools.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# Winget packages')
    lines.push('# ─────────────────────────────────────────────────────────')
    for (const tool of wingetTools) {
      lines.push(`Write-Host "📥 Installing ${tool.name}..." -ForegroundColor Blue`)
      lines.push(`${tool.install.windows} --silent --accept-package-agreements --accept-source-agreements`)
    }
    lines.push('')
  }

  if (npmTools.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# NPM global packages')
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('if (Test-NodeNpm) {')
    for (const tool of npmTools) {
      lines.push(`  Write-Host "📥 Installing ${tool.name}..." -ForegroundColor Blue`)
      lines.push(`  ${tool.install.windows}`)
    }
    lines.push('} else {')
    lines.push('  Write-Host "⚠️  npm not found — skipping npm packages. Install Node.js first." -ForegroundColor Yellow')
    lines.push('}')
    lines.push('')
  }

  if (pipTools.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# Python packages')
    lines.push('# ─────────────────────────────────────────────────────────')
    for (const tool of pipTools) {
      lines.push(`Write-Host "📥 Installing ${tool.name}..." -ForegroundColor Blue`)
      lines.push(tool.install.windows ?? '')
    }
    lines.push('')
  }

  lines.push('Write-Host ""')
  lines.push('Write-Host "✅ Done! Your dev environment is ready." -ForegroundColor Green')
  lines.push('Write-Host "💡 You may need to restart your terminal for some changes to take effect." -ForegroundColor Yellow')

  return lines.join('\n')
}

export function generateScript(tools: Tool[], os: OS): string {
  if (tools.length === 0) return ''
  const availableTools = tools.filter(t => t.install[os] !== null)
  if (availableTools.length === 0) return ''

  if (os === 'macos') return generateMacOSScript(availableTools)
  if (os === 'linux') return generateLinuxScript(availableTools)
  return generateWindowsScript(availableTools)
}

// Simple syntax highlighter
function highlightLine(line: string, _os: OS): React.ReactNode {
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
                  <span className="flex-1">{highlightLine(line, selectedOs)}</span>
                </div>
              ))}
            </motion.pre>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
