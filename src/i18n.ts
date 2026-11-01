import { genres, type Genre } from './genres';

export const langs = ['ar', 'en'] as const;
export type Lang = (typeof langs)[number];

// Arabic lives at "/", other languages under "/<lang>/". Pages use [...lang], where undefined means Arabic.
// A function, not a shared array: Astro mutates the params objects it is given.
export const langPaths = () => langs.map((l) => ({ params: { lang: l === 'ar' ? undefined : l } }));
export const toLang = (param?: string): Lang => (param === 'en' ? 'en' : 'ar');
export const href = (lang: Lang, path = '/') => (lang === 'ar' ? '' : `/${lang}`) + path;
export const dir = (lang: Lang) => (lang === 'ar' ? 'rtl' : 'ltr');

export const ui = {
  ar: {
    site: 'إصدارة',
    tagline: 'دليل الموسيقى العربية المستقلة',
    intro: 'أحدث الإصدارات من فنانين مستقلين في أنحاء العالم العربي.',
    latest: 'أحدث الإصدارات',
    browse: 'تصفّح',
    all: 'الكل',
    clear: 'إزالة التصفية',
    country: 'البلد',
    genre: 'النوع',
    service: 'المنصة',
    single: 'أغنية منفردة',
    // Arabic has dual and few/many plural forms
    tracks: (n: number) =>
      ({ zero: 'بلا أغانٍ', one: 'أغنية واحدة', two: 'أغنيتان', few: `${n} أغانٍ`, many: `${n} أغنية`, other: `${n} أغنية` })[
        new Intl.PluralRules('ar').select(n)
      ],
    footer: 'مشروع مفتوح المصدر. حقوق الأغاني محفوظة لأصحابها، ونحن نفهرسها فقط.',
    addMusic: 'هل أنت فنان؟ أضف موسيقاك',
    edit: 'عدّل هذه الصفحة على GitHub',
    source: 'المصدر على GitHub',
    contact: 'التواصل وطلبات الإزالة',
    isThisYou: 'هل هذه صفحتك؟ راسلنا لتصحيحها أو إزالتها.',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن فنان أو أغنية',
    anyCountry: 'كل البلدان',
    anyGenre: 'كل الأنواع',
    anyService: 'كل المنصات',
    loading: 'جارٍ تحميل الفهرس…',
    results: (n: number) =>
      ({ zero: 'لا نتائج', one: 'نتيجة واحدة', two: 'نتيجتان', few: `${n} نتائج`, many: `${n} نتيجة`, other: `${n} نتيجة` })[
        new Intl.PluralRules('ar').select(n)
      ],
    noscript: 'البحث يحتاج إلى JavaScript. يمكنك تصفح الإصدارات من الصفحة الرئيسية.',
    searchFailed: 'تعذّر تحميل البحث. حاول تحديث الصفحة.',
    indexReady: 'الفهرس جاهز',
    artistCount: (n: number) =>
      ({ zero: 'لا فنانين', one: 'فنان واحد', two: 'فنانان', few: `${n} فنانين`, many: `${n} فنانًا`, other: `${n} فنان` })[
        new Intl.PluralRules('ar').select(n)
      ],
    songCount: (n: number) =>
      ({ zero: 'لا أغاني', one: 'أغنية واحدة', two: 'أغنيتان', few: `${n} أغانٍ`, many: `${n} أغنية`, other: `${n} أغنية` })[
        new Intl.PluralRules('ar').select(n)
      ],
    play: (title: string) => `تشغيل ${title}`,
    playWith: 'التشغيل عبر',
    playAll: 'تشغيل الكل',
    stop: 'إيقاف',
    auto: 'تلقائي',
    pages: 'الصفحات',
    prev: '→ الأحدث',
    next: 'الأقدم ←',
    pageOf: (n: number, total: number) => `صفحة ${n} من ${total}`,
    other: 'English',
    beta: 'تجريبي',
    more: (n: number) => `\u2066+${n}\u2069 أخرى`, // isolated left-to-right, or RTL shows it as "3+"
    inferred: 'جُمعت معلومات هذه الصفحة آليًا من مصادر عامة، وقد تحتوي على أخطاء.',
    madeBy: 'صنعه ',
    credits: ' في ليالي عطلة نهاية الأسبوع، بأدوات ذكاء اصطناعي أبرزها Claude Opus 5.5، وDeepSeek لتنظيم البيانات.',
    consent: 'نستخدم Google Analytics لإحصاء الزيارات، فقط إن وافقت.',
    consentMore: 'التفاصيل',
    accept: 'موافق',
    decline: 'رفض',
    cookieSettings: 'إعدادات الكوكيز',
  },
  en: {
    site: 'Esdara',
    tagline: 'The Independent Arabic Music Directory',
    intro: 'The latest releases from independent artists across the Arab world.',
    latest: 'Latest releases',
    browse: 'Browse',
    all: 'All',
    clear: 'Clear filter',
    country: 'Country',
    genre: 'Genre',
    service: 'Platform',
    single: 'Single',
    tracks: (n: number) => (n === 1 ? '1 track' : `${n} tracks`),
    footer: 'Open source. Songs belong to their respective owners; we only index them.',
    addMusic: 'Are you an artist? Add your music',
    edit: 'Edit this page on GitHub',
    source: 'Source on GitHub',
    contact: 'Contact and removal requests',
    isThisYou: 'Is this you? Email us to correct or remove this page.',
    search: 'Search',
    searchPlaceholder: 'Search artists and songs',
    anyCountry: 'All countries',
    anyGenre: 'All genres',
    anyService: 'All platforms',
    loading: 'Loading the index…',
    results: (n: number) => (n ? `${n} result${n === 1 ? '' : 's'}` : 'No results'),
    noscript: 'Search needs JavaScript. You can browse releases from the home page.',
    searchFailed: 'Search failed to load. Try refreshing the page.',
    indexReady: 'Index ready',
    artistCount: (n: number) => `${n} artist${n === 1 ? '' : 's'}`,
    songCount: (n: number) => `${n} song${n === 1 ? '' : 's'}`,
    play: (title: string) => `Play ${title}`,
    playWith: 'Play with',
    playAll: 'Play all',
    stop: 'Stop',
    auto: 'Auto',
    pages: 'Pages',
    prev: '← Newer',
    next: 'Older →',
    pageOf: (n: number, total: number) => `Page ${n} of ${total}`,
    other: 'العربية',
    beta: 'Beta',
    more: (n: number) => `+${n} more`,
    inferred: 'This page was compiled automatically from public sources and may contain mistakes.',
    madeBy: 'Made by ',
    credits: ' on weekend nights, with AI tools: mostly Claude Opus 5.5, plus DeepSeek for organizing data.',
    consent: 'We use Google Analytics to count visits, only if you agree.',
    consentMore: 'Details',
    accept: 'Accept',
    decline: 'Decline',
    cookieSettings: 'Cookie settings',
  },
};

export const services: Record<string, { ar: string; en: string }> = {
  youtube: { ar: 'يوتيوب', en: 'YouTube' },
  spotify: { ar: 'سبوتيفاي', en: 'Spotify' },
};

// Names as they're used in the region, where they differ from the browser's (CLDR) names.
const countryNames: Record<string, { ar: string; en: string }> = {
  PS: { ar: 'فلسطين', en: 'Palestine' },
  SA: { ar: 'السعودية', en: 'Saudi Arabia' },
  AE: { ar: 'الإمارات', en: 'UAE' },
};
export const country = (lang: Lang, code: string) =>
  countryNames[code.toUpperCase()]?.[lang] ?? new Intl.DisplayNames([lang], { type: 'region' }).of(code.toUpperCase()) ?? code;
export const date = (lang: Lang, d: Date) => d.toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }); // release dates are UTC midnights

// Label for a filter value as it appears in URLs (/country/eg/, /genre/indie-rock/, /service/spotify/).
export const facetLabel = (lang: Lang, facet: string, value: string) =>
  facet === 'country' ? country(lang, value) : facet === 'genre' ? genres[value as Genre][lang] : services[value][lang];
