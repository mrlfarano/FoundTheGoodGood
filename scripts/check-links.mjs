#!/usr/bin/env node
/**
 * Link-rot checker — extracts every http(s) URL from src/data/tools.ts and
 * verifies it still resolves. Catalog URLs ARE the product; this catches rot.
 *
 * - FAIL (exit 1): 404/410, DNS/connection errors
 * - WARN (exit 0): bot walls (403/429/999), other 4xx/5xx — likely curl blocking
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(join(root, 'src/data/tools.ts'), 'utf8')

const urls = [
  ...new Set(
    (source.match(/https?:\/\/[^\s'"`)]+/g) ?? []).map(u => u.replace(/[.,;]+$/, ''))
  ),
].sort()

const FAIL = new Set([404, 410])
const BOT_WALL = new Set([403, 405, 429, 503, 999]) // 405: many hosts reject HEAD
const UA =
  'Mozilla/5.0 (compatible; FoundTheGoodGood-link-check/1.0; +https://github.com/mrlfarano/FoundTheGoodGood)'

async function check(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
        headers: { 'User-Agent': UA, Accept: '*/*' },
      })
      if (res.ok) return { url, status: 'OK', code: res.status }
      if (!BOT_WALL.has(res.status) && method === 'GET') {
        return { url, status: FAIL.has(res.status) ? 'FAIL' : 'WARN', code: res.status }
      }
      if (method === 'GET') return { url, status: 'WARN', code: res.status }
    } catch (err) {
      if (method === 'GET') {
        return { url, status: 'FAIL', code: err?.cause?.code ?? err.name }
      }
    }
  }
}

const results = []
const BATCH = 8
for (let i = 0; i < urls.length; i += BATCH) {
  results.push(...(await Promise.all(urls.slice(i, i + BATCH).map(check))))
}

for (const r of results) {
  const icon = r.status === 'OK' ? '✅' : r.status === 'WARN' ? '⚠️ ' : '❌'
  console.log(`${icon} ${String(r.code).padEnd(11)} ${r.url}`)
}

const failed = results.filter(r => r.status === 'FAIL')
const warned = results.filter(r => r.status === 'WARN')
console.log(`\n${urls.length} URLs checked: ${results.length - failed.length - warned.length} ok, ${warned.length} warn, ${failed.length} failed`)
if (failed.length) {
  console.error('\nDead links found — update src/data/tools.ts:')
  for (const f of failed) console.error(`  ${f.code} ${f.url}`)
  process.exit(1)
}
