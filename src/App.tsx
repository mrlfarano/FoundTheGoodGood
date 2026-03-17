import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, CheckSquare, Square, ChevronDown } from 'lucide-react'
import { Header } from './components/Header'
import { OsSelector } from './components/OsSelector'
import { CategorySection } from './components/CategorySection'
import { ToolCard } from './components/ToolCard'
import { ScriptPreview } from './components/ScriptPreview'
import { TOOLS, CATEGORIES, type OS } from './data/tools'

export default function App() {
  const [selectedOs, setSelectedOs] = useState<OS>('macos')
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const toggleTool = useCallback((id: string) => {
    setSelectedTools(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAllInCategory = useCallback((categoryId: string) => {
    const catTools = TOOLS.filter(t => t.category === categoryId && t.install[selectedOs] !== null)
    setSelectedTools(prev => {
      const next = new Set(prev)
      catTools.forEach(t => next.add(t.id))
      return next
    })
  }, [selectedOs])

  const deselectAllInCategory = useCallback((categoryId: string) => {
    const catTools = TOOLS.filter(t => t.category === categoryId)
    setSelectedTools(prev => {
      const next = new Set(prev)
      catTools.forEach(t => next.delete(t.id))
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    const allAvailable = TOOLS.filter(t => t.install[selectedOs] !== null).map(t => t.id)
    setSelectedTools(new Set(allAvailable))
  }, [selectedOs])

  const deselectAll = useCallback(() => {
    setSelectedTools(new Set())
  }, [])

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return TOOLS
    const q = searchQuery.toLowerCase()
    return TOOLS.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    )
  }, [searchQuery])

  const selectedToolObjects = useMemo(() =>
    TOOLS.filter(t => selectedTools.has(t.id)),
    [selectedTools]
  )

  const totalAvailable = TOOLS.filter(t => t.install[selectedOs] !== null).length
  const allSelected = selectedTools.size > 0 &&
    TOOLS.filter(t => t.install[selectedOs] !== null).every(t => selectedTools.has(t.id))

  return (
    <div className="relative min-h-screen" style={{ background: '#080d1a' }}>
      {/* Background decorations */}
      <div className="orb-1" />
      <div className="orb-2" />
      <div className="bg-grid fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      <div className="relative z-10">
        {/* Header */}
        <Header />

        {/* OS Selector - sticky */}
        <OsSelector selectedOs={selectedOs} onOsChange={setSelectedOs} />

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-4 py-8">

          {/* Controls bar */}
          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#334155' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tools by name or tag..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#e2e8f0',
                  caretColor: '#6366f1',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.08)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#334155' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#64748b')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#334155')}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Select all / Deselect all */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={allSelected ? deselectAll : selectAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: allSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.03)',
                  border: allSelected
                    ? '1px solid rgba(99, 102, 241, 0.25)'
                    : '1px solid rgba(255,255,255,0.07)',
                  color: allSelected ? '#a5b4fc' : '#475569',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                <span>{allSelected ? 'Deselect all' : `Select all ${totalAvailable}`}</span>
              </motion.button>

              {/* Selected count */}
              <AnimatePresence>
                {selectedTools.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold font-mono"
                    style={{
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                    }}
                  >
                    <span>{selectedTools.size}</span>
                    <span style={{ color: '#4f46e5', fontSize: '10px' }}>selected</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Categories / Search results */}
          <div className="space-y-4 mb-10">
            {searchQuery ? (
              // Search results view
              <AnimatePresence>
                {filteredTools.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      border: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.015)',
                    }}
                  >
                    <div
                      className="flex items-center justify-between px-5 py-4"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-center gap-2">
                        <Search size={14} color="#6366f1" />
                        <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>
                          Search results
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-mono"
                          style={{
                            background: 'rgba(99, 102, 241, 0.12)',
                            color: '#818cf8',
                          }}
                        >
                          {filteredTools.length}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
                      {filteredTools.map(tool => (
                        <ToolCard
                          key={tool.id}
                          tool={tool}
                          isSelected={selectedTools.has(tool.id)}
                          selectedOs={selectedOs}
                          onToggle={toggleTool}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                    style={{ color: '#334155' }}
                  >
                    <p className="text-sm">No tools found for &ldquo;{searchQuery}&rdquo;</p>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              // Normal category view
              CATEGORIES.map((category, i) => {
                const categoryTools = filteredTools.filter(t => t.category === category.id)
                if (categoryTools.length === 0) return null
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <CategorySection
                      category={category}
                      tools={categoryTools}
                      selectedTools={selectedTools}
                      selectedOs={selectedOs}
                      onToggle={toggleTool}
                      onSelectAll={selectAllInCategory}
                      onDeselectAll={deselectAllInCategory}
                    />
                  </motion.div>
                )
              })
            )}
          </div>

          {/* Script Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="flex-1 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.2), transparent)' }}
              />
              <div className="flex items-center gap-2 px-3">
                <ChevronDown size={12} color="#334155" />
                <span className="text-xs font-medium" style={{ color: '#334155' }}>
                  Your Script
                </span>
                <ChevronDown size={12} color="#334155" />
              </div>
              <div
                className="flex-1 h-px"
                style={{ background: 'linear-gradient(to left, transparent, rgba(99,102,241,0.2), transparent)' }}
              />
            </div>

            <ScriptPreview selectedTools={selectedToolObjects} selectedOs={selectedOs} />
          </motion.div>

          {/* Footer */}
          <footer className="text-center mt-16 pb-8">
            <p className="text-xs" style={{ color: '#1e293b' }}>
              Built with love by{' '}
              <a
                href="https://github.com/mrlfarano"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#334155' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64748b')}
                onMouseLeave={e => (e.currentTarget.style.color = '#334155')}
              >
                mrlfarano
              </a>
              {' · '}
              <a
                href="https://github.com/mrlfarano/FoundTheGoodGood"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#334155' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64748b')}
                onMouseLeave={e => (e.currentTarget.style.color = '#334155')}
              >
                Open Source
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
