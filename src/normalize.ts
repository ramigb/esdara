// Search key shared by the index builder and (later) the browser: folds hamza/madda alef forms,
// taa marbuta, alef maqsura, harakat, tatweel and Latin accents so "احمد" matches "أَحمد".
export const normalize = (s: string) =>
  s
    .normalize('NFKD') // splits أ/إ/آ/ؤ/ئ into base letter + combining hamza/madda, é into e + accent
    .replace(/[\p{M}ـ]/gu, '')
    .replace(/ٱ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase();
