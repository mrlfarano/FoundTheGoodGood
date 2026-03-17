import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Terminal, Zap, Code2, Cloud, Sparkles, Settings } from 'lucide-react'
import type { Tool, OS, Category } from '../data/tools'
import { ToolCard } from './ToolCard'

interface CategorySectionProps {
  category: Category
  tools: Tool[]
  selectedTools: Set<string>
  selectedOs: OS
  onToggle: (id: string) => void
  onSelectAll: (categoryId: string) => void
  onDeselectAll: (categoryId: string) => void
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Terminal,
  Zap,
  Code2,
  Cloud,
  Sparkles,
  Settings,
}

const CATEGORY_COLORS: Record<string, string> = {
  shell: '#34d399',
  cli: '#60a5fa',
  runtimes: '#fbbf24',
  devops: '#f87171',
  ai: '#a78bfa',
  dotfiles: '#22d3ee',
}


export function CategorySection({
  category,
  tools,
  selectedTools,
  selectedOs,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(true)
  const accentColor = CATEGORY_COLORS[category.id] ?? '#6366f1'
  const Icon = ICON_MAP[category.icon] ?? Terminal

  const availableTools = tools.filter(t => t.install[selectedOs] !== null)
  const selectedInCategory = tools.filter(t => selectedTools.has(t.id))
  const allAvailableSelected =
    availableTools.length > 0 &&
    availableTools.every(t => selectedTools.has(t.id))

  const handleSelectToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (allAvailableSelected) {
      onDeselectAll(category.id)
    } else {
      onSelectAll(category.id)
    }
  }

  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      style={{
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.015)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Category Header */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors"
        style={{
          background: isOpen
            ? `radial-gradient(ellipse at left, ${accentColor}06 0%, transparent 60%)`
            : 'transparent',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Icon badge */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}25`,
            }}
          >
            <Icon size={16} color={accentColor} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm" style={{ color: '#e2e8f0' }}>
                {category.name}
              </h2>
              {/* Selection counts */}
              <div className="flex items-center gap-1.5">
                {selectedInCategory.length > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-mono font-semibold"
                    style={{
                      background: `${accentColor}20`,
                      color: accentColor,
                      border: `1px solid ${accentColor}30`,
                    }}
                  >
                    {selectedInCategory.length}
                  </span>
                )}
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: '#475569',
                  }}
                >
                  {tools.length}
                </span>
              </div>
            </div>
            <p className="text-xs mt-0.5" style={{ color: '#334155' }}>
              {category.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Select All button */}
          {availableTools.length > 0 && (
            <motion.button
              onClick={handleSelectToggle}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{
                background: allAvailableSelected ? `${accentColor}20` : 'rgba(255,255,255,0.05)',
                color: allAvailableSelected ? accentColor : '#475569',
                border: allAvailableSelected
                  ? `1px solid ${accentColor}35`
                  : '1px solid rgba(255,255,255,0.08)',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {allAvailableSelected ? 'Deselect all' : 'Select all'}
            </motion.button>
          )}

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: '#334155' }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>
      </button>

      {/* Tool Grid */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-4 pb-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-4">
                {tools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isSelected={selectedTools.has(tool.id)}
                    selectedOs={selectedOs}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
