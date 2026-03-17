import { motion } from 'framer-motion'
import type { OS } from '../data/tools'
import { TOOLS } from '../data/tools'

interface OsSelectorProps {
  selectedOs: OS
  onOsChange: (os: OS) => void
}

const OS_CONFIG: { id: OS; label: string; icon: string; color: string }[] = [
  { id: 'macos', label: 'macOS', icon: '', color: '#60a5fa' },
  { id: 'linux', label: 'Linux', icon: '', color: '#34d399' },
  { id: 'windows', label: 'Windows', icon: '', color: '#a78bfa' },
]

function getCompatibleCount(os: OS): number {
  return TOOLS.filter(t => t.install[os] !== null).length
}

// SVG icons for OS
function MacOsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z"/>
    </svg>
  )
}

function LinuxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.595.673-1.474.41-2.261-.134-.388-.383-.732-.766-1.014-.287-.218-.593-.372-.942-.492a5.923 5.923 0 00-.534-.176l-.008-.003c.456-1.595 1.284-3.14 2.585-5.067 1.195-1.756 1.596-3.46 1.568-4.85-.028-1.39-.436-2.457-.852-2.996l.062-.018c.344-.092.698-.166 1.06-.218l.01.003c.24.045.51.089.78.136.73.12 1.418.205 1.955.16.537-.045.98-.195 1.29-.445.31-.25.507-.596.55-.969.09-.7-.364-1.457-.98-1.855a2.2 2.2 0 00-1.218-.344zm-1.964 12.937c-.13.046-.25.08-.36.113l-.007.003c-.31.094-.59.203-.836.383-.245.178-.46.418-.59.726-.253.627-.113 1.397.363 1.87.17.17.382.32.639.463a2.95 2.95 0 00.776.28c.282.056.57.08.851.056.283-.024.553-.1.788-.217.235-.118.437-.282.584-.484.295-.403.35-.947.125-1.44-.11-.24-.28-.456-.495-.636l-.003-.002c-.232-.197-.514-.36-.817-.49-.303-.131-.619-.218-.917-.253l-.101-.372z"/>
    </svg>
  )
}

function WindowsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.551H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
    </svg>
  )
}

const ICONS = {
  macos: MacOsIcon,
  linux: LinuxIcon,
  windows: WindowsIcon,
}

export function OsSelector({ selectedOs, onOsChange }: OsSelectorProps) {
  return (
    <div className="sticky top-0 z-30 py-4 px-4" style={{
      background: 'rgba(8, 13, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <span className="text-sm mr-2 hidden sm:block" style={{ color: '#475569' }}>
            Target OS:
          </span>
          {OS_CONFIG.map(({ id, label, color }) => {
            const Icon = ICONS[id]
            const count = getCompatibleCount(id)
            const isSelected = selectedOs === id

            return (
              <motion.button
                key={id}
                onClick={() => onOsChange(id)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isSelected
                    ? `${color}18`
                    : 'rgba(255,255,255,0.03)',
                  border: isSelected
                    ? `1px solid ${color}50`
                    : '1px solid rgba(255,255,255,0.07)',
                  color: isSelected ? color : '#64748b',
                  boxShadow: isSelected ? `0 0 20px ${color}15` : 'none',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon />
                <span className="hidden sm:inline">{label}</span>
                <span
                  className="inline-flex items-center justify-center text-xs rounded-full px-1.5 py-0.5 font-mono font-semibold"
                  style={{
                    background: isSelected ? `${color}25` : 'rgba(255,255,255,0.05)',
                    color: isSelected ? color : '#475569',
                    minWidth: '22px',
                  }}
                >
                  {count}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="os-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `radial-gradient(ellipse at center, ${color}08 0%, transparent 70%)`,
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
