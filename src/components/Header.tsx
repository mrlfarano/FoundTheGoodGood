import { motion } from 'framer-motion'
import { Sparkles, Github } from 'lucide-react'

export function Header() {
  return (
    <header className="relative z-10 pt-16 pb-12 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-medium"
          style={{
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: '#a5b4fc',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Sparkles size={12} />
          <span>Curated developer toolkit</span>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 leading-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <span className="gradient-text">FoundThe</span>
          <span style={{ color: '#f1f5f9' }}>GoodGood</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-lg sm:text-xl max-w-xl mx-auto leading-relaxed"
          style={{ color: '#64748b' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          The good stuff. No fluff.{' '}
          <span style={{ color: '#94a3b8' }}>
            Pick your tools, get your script.
          </span>
        </motion.p>

        {/* GitHub link */}
        <motion.a
          href="https://github.com/mrlfarano/FoundTheGoodGood"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 text-sm transition-colors"
          style={{ color: '#475569' }}
          whileHover={{ color: '#94a3b8' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Github size={14} />
          <span>mrlfarano/FoundTheGoodGood</span>
        </motion.a>
      </motion.div>
    </header>
  )
}
