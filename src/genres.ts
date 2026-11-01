// Controlled list: contributors pick from these keys; new genres are added by maintainers.
export const genres = {
  alternative: { ar: 'بديل', en: 'Alternative' },
  electronic: { ar: 'إلكتروني', en: 'Electronic' },
  folk: { ar: 'فولك', en: 'Folk' },
  'hip-hop': { ar: 'هيب هوب', en: 'Hip Hop' },
  'indie-pop': { ar: 'بوب مستقل', en: 'Indie Pop' },
  'indie-rock': { ar: 'روك مستقل', en: 'Indie Rock' },
  jazz: { ar: 'جاز', en: 'Jazz' },
  mahraganat: { ar: 'مهرجانات', en: 'Mahraganat' },
  metal: { ar: 'ميتال', en: 'Metal' },
  tarab: { ar: 'طرب', en: 'Tarab' },
} as const;

export type Genre = keyof typeof genres;
