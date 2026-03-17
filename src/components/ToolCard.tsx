import { motion, AnimatePresence } from 'framer-motion'
import { Check, ExternalLink, Github } from 'lucide-react'
import type { Tool, OS } from '../data/tools'

interface ToolCardProps {
  tool: Tool
  isSelected: boolean
  selectedOs: OS
  onToggle: (id: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  shell: '#34d399',
  cli: '#60a5fa',
  runtimes: '#fbbf24',
  devops: '#f87171',
  ai: '#a78bfa',
}

export function ToolCard({ tool, isSelected, selectedOs, onToggle }: ToolCardProps) {
  const isAvailable = tool.install[selectedOs] !== null
  const accentColor = CATEGORY_COLORS[tool.category] ?? '#6366f1'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={() => isAvailable && onToggle(tool.id)}
      className="relative rounded-xl p-4 transition-all duration-200"
      style={{
        background: isSelected
          ? `${accentColor}0a`
          : 'rgba(255,255,255,0.025)',
        border: isSelected
          ? `1px solid ${accentColor}35`
          : '1px solid rgba(255,255,255,0.06)',
        cursor: isAvailable ? 'pointer' : 'default',
        opacity: isAvailable ? 1 : 0.4,
        boxShadow: isSelected ? `0 0 20px ${accentColor}10, inset 0 1px 0 ${accentColor}15` : 'none',
      }}
      whileHover={isAvailable ? {
        scale: 1.01,
        borderColor: isSelected ? `${accentColor}50` : 'rgba(255,255,255,0.12)',
        background: isSelected ? `${accentColor}12` : 'rgba(255,255,255,0.04)',
      } : {}}
      whileTap={isAvailable ? { scale: 0.99 } : {}}
    >
      {/* Selected check */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: accentColor }}
          >
            <Check size={11} color="#000" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Not available badge */}
      {!isAvailable && (
        <div
          className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.05)',
            color: '#475569',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          N/A
        </div>
      )}

      {/* Content */}
      <div className="pr-6">
        <div className="flex items-start gap-2 mb-1.5">
          <h3
            className="font-semibold text-sm leading-tight"
            style={{ color: isSelected ? '#f1f5f9' : '#cbd5e1' }}
          >
            {tool.name}
          </h3>
        </div>

        <p
          className="text-xs leading-relaxed line-clamp-2 mb-3"
          style={{ color: '#475569' }}
        >
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tool.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: `${accentColor}10`,
                color: isSelected ? accentColor : '#475569',
                border: `1px solid ${accentColor}18`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          <a
            href={tool.links.homepage}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: '#334155' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#64748b')}
            onMouseLeave={e => (e.currentTarget.style.color = '#334155')}
          >
            <ExternalLink size={10} />
            <span>Docs</span>
          </a>
          {tool.links.github && (
            <a
              href={tool.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: '#334155' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#64748b')}
              onMouseLeave={e => (e.currentTarget.style.color = '#334155')}
            >
              <Github size={10} />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
