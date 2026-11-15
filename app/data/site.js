// Links and copy used in more than one place.

/** Where the playable web demo lives. */
export const PLAY_URL = 'https://caliync.github.io/wildwood-farm/'

/**
 * Main navigation. `tab` opens that field-guide category when clicked.
 * @type {{href:string,label:string,tab?:import('./catalog.js').Category}[]}
 */
export const NAV_LINKS = [
  { href: '#story', label: 'Story' },
  { href: '#showcase', label: 'Weapons', tab: 'weapons' },
  { href: '#showcase', label: 'Animals', tab: 'animals' },
  { href: '#world', label: 'World' },
  { href: '#showcase', label: 'Structures', tab: 'structures' },
]

/** The mobile menu lists the same places in a slightly different order. */
export const MOBILE_LINKS = [
  { href: '#story', label: 'Story' },
  { href: '#showcase', label: 'Weapons', tab: 'weapons' },
  { href: '#showcase', label: 'Animals', tab: 'animals' },
  { href: '#showcase', label: 'Structures', tab: 'structures' },
  { href: '#world', label: 'World map' },
]
