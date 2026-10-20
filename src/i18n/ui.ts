/** Site languages. */
export const languages = {
  fr: 'Français',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];
export const defaultLang: Lang = 'fr';

/** UI strings. Every key must exist in both languages. */
export const ui = {
  fr: {
    'site.title': 'Tech4Fertility',
    'site.tagline': 'La technologie au service de la fertilité',
    'home.title': 'Tech4Fertility | Site en construction',
    'home.description': 'Le site de l’association Tech4Fertility est en construction.',
    'home.wip': 'Site en construction',
    'home.message': 'Le site de l’association arrive bientôt. D’ici là, pour toute question ou proposition, écrivez-nous :',
    'nav.home': 'Accueil',
    'nav.blog': 'Blog',
    'nav.lang': 'Langue',
    'blog.title': 'Blog',
    'blog.description': 'Les actualités de l’association Tech4Fertility.',
    'blog.empty': 'Aucun article pour le moment.',
    'blog.back': '← Tous les articles',
    'blog.readMore': 'Lire l’article',
    'blog.updated': 'Mis à jour le',
    'footer.legal': 'Association loi 1901, n° RNA W271007328',
  },
  en: {
    'site.title': 'Tech4Fertility',
    'site.tagline': 'Putting technology to work for fertility',
    'home.title': 'Tech4Fertility | Website under construction',
    'home.description': 'The Tech4Fertility association’s website is under construction.',
    'home.wip': 'Website under construction',
    'home.message': 'The association’s website is coming soon. In the meantime, for any question or proposal, drop us a line:',
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.lang': 'Language',
    'blog.title': 'Blog',
    'blog.description': 'News from the Tech4Fertility association.',
    'blog.empty': 'No posts yet.',
    'blog.back': '← All posts',
    'blog.readMore': 'Read the post',
    'blog.updated': 'Updated on',
    'footer.legal': 'French non-profit association (loi 1901), RNA no. W271007328',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof ui)[typeof defaultLang];
