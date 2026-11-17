/** Sozlash panelida tanlanadigan soch uslublari */
export const HAIR_STYLES = ['short', 'fade', 'curly', 'bald'] as const
export type HairStyle = (typeof HAIR_STYLES)[number]
