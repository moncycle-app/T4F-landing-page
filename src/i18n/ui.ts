/** Site languages. */
export const languages = {
  fr: 'Français',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];
export const defaultLang: Lang = 'en';

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
    'footer.rights': 'Tous droits réservés.',
    'footer.reuse': 'Informations réutilisables avec un lien vers la source.',
    'footer.legalLink': 'Informations légales',
    'legal.title': 'Informations légales | Tech4Fertility',
    'legal.description': 'Éditeur du site, droits d’auteur et conditions de réutilisation des contenus de Tech4Fertility.',
    'legal.heading': 'Informations légales',
    'legal.publisher.title': 'Éditeur',
    'legal.publisher.text': 'Ce site est édité par Tech4Fertility, association loi 1901 enregistrée sous le n° RNA W271007328. Contact :',
    'legal.copyright.title': 'Droits d’auteur',
    'legal.copyright.text': '© 2026 Tech4Fertility. Tous droits réservés. Ce site (code source, design, textes et images) ne peut être copié, modifié, redistribué ou déployé, en tout ou partie, sans l’autorisation écrite préalable de Tech4Fertility.',
    'legal.reuse.title': 'Réutilisation des informations',
    'legal.reuse.text': 'Vous pouvez réutiliser les informations publiées sur tech4fertility.org et en citer de courts extraits, à condition de créditer Tech4Fertility avec un lien visible vers la page d’origine.',
    'legal.ai.title': 'Moteurs de recherche et systèmes d’IA',
    'legal.ai.text': 'L’indexation, la mise en cache, la fouille de textes et de données et l’entraînement de modèles d’IA sur tech4fertility.org sont expressément autorisés.',
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
    'footer.rights': 'All rights reserved.',
    'footer.reuse': 'Information may be reused with a link to the source.',
    'footer.legalLink': 'Legal information',
    'legal.title': 'Legal information | Tech4Fertility',
    'legal.description': 'Publisher, copyright and content reuse terms of the Tech4Fertility website.',
    'legal.heading': 'Legal information',
    'legal.publisher.title': 'Publisher',
    'legal.publisher.text': 'This website is published by Tech4Fertility, a French non-profit association (loi 1901) registered under RNA no. W271007328. Contact:',
    'legal.copyright.title': 'Copyright',
    'legal.copyright.text': '© 2026 Tech4Fertility. All rights reserved. This website (source code, design, texts and images) may not be copied, modified, redistributed or deployed, in whole or in part, without prior written permission from Tech4Fertility.',
    'legal.reuse.title': 'Reuse of information',
    'legal.reuse.text': 'You may reuse the information published on tech4fertility.org and quote short excerpts, provided you credit Tech4Fertility with a visible link to the original page.',
    'legal.ai.title': 'Search engines and AI systems',
    'legal.ai.text': 'Indexing, caching, text and data mining and AI training on tech4fertility.org are explicitly permitted.',
    'footer.legal': 'French non-profit association (loi 1901), RNA no. W271007328',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof ui)[typeof defaultLang];
