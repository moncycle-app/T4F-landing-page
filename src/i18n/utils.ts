import { defaultLang, langs, ui, type Lang, type UiKey } from './ui';

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

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** getStaticPaths() params for pages under src/pages/[lang]/ */
export function langStaticPaths() {
  return langs.map((lang) => ({ params: { lang } }));
}
