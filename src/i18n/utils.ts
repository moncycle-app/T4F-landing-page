import { defaultLang, langs, sectionIds, ui, type Lang, type SectionKey, type UiKey } from './ui';

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (langs as string[]).includes(value);
}

/** Language of the current page, from the first URL segment. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return isLang(first) ? first : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

/** Builds a language-prefixed internal URL: localizedPath('en', 'legal') → /en/legal/ */
export function localizedPath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${lang}/${clean}/` : `/${lang}/`;
}

/** Link to a home page section, usable from any page: sectionPath('fr', 'projects') → /fr/#projets */
export function sectionPath(lang: Lang, section: SectionKey): string {
  return `${localizedPath(lang)}#${sectionIds[lang][section]}`;
}

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // Dates come from YYYY-MM-DD strings (UTC midnight): never shift them by a day
    timeZone: 'UTC',
  });
}

/** getStaticPaths() params for pages under src/pages/[lang]/ */
export function langStaticPaths() {
  return langs.map((lang) => ({ params: { lang } }));
}
