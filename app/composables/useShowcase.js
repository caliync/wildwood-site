import { onMounted, watch } from 'vue'
import { CATALOG } from '~/data/catalog.js'

/**
 * Remembers a choice in localStorage. Wrapped in try/catch because storage can
 * be blocked (private windows, strict privacy settings).
 * @param {string} key
 * @returns {{read: () => string|null, write: (v: string) => void}}
 */
export function useStoredChoice(key) {
  return {
    read() {
      try { return localStorage.getItem(key) } catch { return null }
    },
    write(v) {
      try { localStorage.setItem(key, v) } catch { /* storage unavailable */ }
    },
  }
}

/**
 * The open field-guide category, shared by the nav (to highlight the right
 * link) and the showcase. Restored from and saved to localStorage.
 * @returns {import('vue').Ref<import('~/data/catalog.js').Category>}
 */
export function useShowcaseCategory() {
  const cat = useState('ww-cat', () => 'weapons')
  return cat
}

/**
 * Call once, from the showcase, to load and persist the category.
 * @param {import('vue').Ref<string>} cat
 */
export function usePersistedCategory(cat) {
  const store = useStoredChoice('ww-cat')
  onMounted(() => {
    const saved = store.read()
    if (saved && CATALOG[saved]) cat.value = saved
  })
  watch(cat, (v) => store.write(v))
}
