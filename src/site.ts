// The public GitHub repository: artists add and edit their pages through PRs here.
export const repo = 'https://github.com/ramigb/esdara';
export const contributeUrl = `${repo}/blob/main/CONTRIBUTING.md`;
export const editUrl = (filePath: string) => `${repo}/edit/main/${filePath}`;

// Removal, correction and opt-out requests that don't need GitHub (Cloudflare Email Routing forwards it).
export const contactEmail = 'rights@esdara.org';
export const mailto = (subject: string) => `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;

// Google Analytics 4 measurement ID ("G-..."). Empty: no analytics and no consent banner.
export const gaId = 'G-MRVHHLVX5S';
