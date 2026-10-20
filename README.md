# Tech4Fertility website

Source code of [tech4fertility.org](https://tech4fertility.org), the website of the Tech4Fertility
association. The site is bilingual: every page exists in English (`/en/…`) and French (`/fr/…`).

It currently contains:

- a home page (`/en/`, `/fr/`);
- a **news** section: "News" in English (`/en/news/`), "Actualités" in French (`/fr/actualites/`);
- a legal information page (`/en/legal/`, `/fr/legal/`).

Most of this README is for **people who want to publish news**. You only need to know Markdown:
no programming, no knowledge of the tools behind the site. Developers will find the technical
documentation in [`AGENTS.md`](AGENTS.md).

---

## Writing news posts

### How it works, in one paragraph

Each news post is **one Markdown file** (`.md`). English posts live in `src/content/news/en/`,
French posts in `src/content/news/fr/`. When the site is built, every file in those folders
automatically becomes a page, is added to the news list of its language (newest first), to the
site map and to the search-engine metadata. You never have to touch any other file: no menu, no
index, no list to update by hand.

### Quick start

1. Pick the folder of the language you are writing in:
   `src/content/news/en/` or `src/content/news/fr/`.
2. Create a file named after the post, for example `src/content/news/en/fertility-hackathon-2026.md`.
3. Paste this template and fill it in:

   ```md
   ---
   title: Our first fertility hackathon
   description: Forty participants, twelve projects and three winners: a look back at our first hackathon.
   pubDate: 2026-11-15
   translationKey: hackathon-2026
   draft: false
   ---

   Last weekend, forty developers, doctors and patients met in Paris to…

   ## The winning projects

   …
   ```

4. If there is a translation, create the other language's file with the **same `translationKey`**
   (see [Translations](#translations)).
5. Submit your change (see [Submitting your post](#submitting-your-post)).

The post will be published at `https://tech4fertility.org/en/news/fertility-hackathon-2026/`.

### Where the files go

```
src/content/news/
├── en/                              English posts → /en/news/<file name>/
│   ├── welcome.md
│   └── fertility-hackathon-2026.md
└── fr/                              French posts  → /fr/actualites/<file name>/
    ├── bienvenue.md
    └── hackathon-fertilite-2026.md
public/images/news/                  Images used in posts → /images/news/<file name>
```

A post that is not inside `en/` or `fr/` breaks the build: the folder is how the site knows the
language of a post.

### Naming the file (it becomes the URL)

The file name, without `.md`, is the end of the post's web address:

| File                                              | Address of the post                  |
| ------------------------------------------------- | ------------------------------------ |
| `src/content/news/en/fertility-hackathon-2026.md` | `/en/news/fertility-hackathon-2026/` |
| `src/content/news/fr/hackathon-fertilite-2026.md` | `/fr/actualites/hackathon-fertilite-2026/` |

Rules for file names:

- lowercase letters, digits and hyphens only: `annual-report-2026.md`;
- **no spaces, no accents, no apostrophes**: write `hackathon-fertilite.md`, not
  `Hackathon fertilité.md`;
- short and descriptive: they appear in links shared on social networks;
- each language can (and usually should) have its own file name: `en/welcome.md` and
  `fr/bienvenue.md` are translations of each other.

> **Do not rename a published post.** Changing the file name changes its address: every link
> already shared (newsletters, social networks, search engines) would lead to a "page not found"
> error. Fix the title instead, which can be changed at any time.

### The header ("front matter")

Every post starts with a header between two lines of three dashes (`---`). It is not displayed
as-is: the site reads it to build the page. Each line is `name: value`.

```md
---
title: Our first fertility hackathon
description: Forty participants, twelve projects and three winners.
pubDate: 2026-11-15
updatedDate: 2026-11-20
translationKey: hackathon-2026
draft: false
---
```

| Field            | Required | What it does                                                                                                  |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `title`          | yes      | Title of the post. Shown as the big heading of the page, in the news list and in the browser tab.            |
| `description`    | yes      | One or two sentences summarising the post. Shown under the title, in the news list, and by search engines and social networks when the link is shared. |
| `pubDate`        | yes      | Publication date, in the `YYYY-MM-DD` format (`2026-11-15`). Posts are listed newest first.                   |
| `updatedDate`    | no       | Date of a significant update, same format. Displayed as "Updated on…" next to the publication date. Remove the line if there was no update. |
| `translationKey` | yes      | Identifier shared by the two translations of a post (see [Translations](#translations)). Any short word or phrase with lowercase letters and hyphens. |
| `draft`          | no       | `true` hides the post from the published site (see [Drafts](#drafts)). Defaults to `false`.                  |

You do not write the date in the text, nor the title again: the site displays both automatically,
formatted for the reader's language ("15 November 2026" / "15 novembre 2026").

#### Header pitfalls

The header uses a format called YAML, which has a few traps:

- **A colon followed by a space inside a value** confuses it. Put the value between double quotes:

  ```md
  title: "Hackathon 2026: the results"
  ```

  The same goes for a value starting with a special character (`"`, `'`, `#`, `[`, `{`, `*`, `&`,
  `!`, `|`, `>`, `%`, `@`, `` ` ``). If in doubt, use double quotes.
- **A double quote inside a quoted value** must be written `\"`. Simpler: use typographic quotes
  (`“…”`, `« … »`), which need no special treatment.
- **Dates** must be `YYYY-MM-DD`: `2026-11-15`, not `15/11/2026` or `Nov 15, 2026`.
- `true` and `false` are written in lowercase, without quotes.
- The two `---` lines must be the very first and last lines of the header, with nothing else on them.

If the header is wrong, the build stops with an error message naming the file and the field at
fault (see [When something goes wrong](#when-something-goes-wrong)).

### Writing the content

Everything after the header is regular Markdown. To see how it looks while writing, use the
preview of your usual Markdown editor. Images with an `/images/news/…` address will not show there:
they only work on the website.

#### Headings

The post title is already the page's main heading (level 1). **Start your sections at level 2**
(`##`), then use level 3 (`###`) for sub-sections. Do not skip levels: screen readers use them to
navigate the page.

```md
## The winning projects

### First prize
```

#### What you can use

| You write                                      | You get                                    |
| ---------------------------------------------- | ------------------------------------------ |
| `**bold**`                                     | **bold**                                   |
| `*italic*`                                     | *italic*                                   |
| `~~strikethrough~~`                            | ~~strikethrough~~                          |
| `[link text](https://example.org)`             | a link                                     |
| `- item` or `1. item`                          | bulleted or numbered list                  |
| `> quoted text`                                | quote, with a coloured bar on the left     |
| `` `code` `` and fenced code blocks (```` ``` ````) | code                                  |
| `![description](/images/news/photo.jpg)`       | image (see [Images](#images))              |
| tables with `\|` and `---`                     | table                                      |
| `Text[^1]` and `[^1]: Note`                    | footnote                                   |
| `---` on its own line (with blank lines around)| horizontal separator                       |

Web addresses written as plain text (`https://example.org`) are turned into links automatically.

Plain HTML also works inside Markdown, but please avoid it: it bypasses the site's styles and is
easy to get wrong.

#### Links

- **Links to other websites**: use the full address, `[the conference](https://example.org/event)`.
- **Links to a page of this site**: start with `/` and the language, and end with `/`:

  ```md
  Read [our previous post](/en/news/welcome/).
  Lisez [notre précédente actualité](/fr/actualites/bienvenue/).
  See the [legal information](/en/legal/).
  ```

  Link to the page in the **same language** as your post.
- Use meaningful link text: `[read the full report](…)`, not `[click here](…)`.
- Do not write e-mail addresses in posts: they would be harvested by spammers. Point readers to the
  contact button on the home page instead.

#### Images

1. Put the image file in `public/images/news/`. Sub-folders are allowed, for example one per post:
   `public/images/news/hackathon-2026/podium.jpg`.
2. Insert it in the post with an address starting with `/images/news/` (without `public`):

   ```md
   ![The three winning teams on stage](/images/news/hackathon-2026/podium.jpg)
   ```

Good practice:

- **Always describe the image** between the square brackets. This text is read aloud to blind
  readers and shown when the image cannot load. Describe what the image shows, not "image" or
  "photo". For a purely decorative image, leave the brackets empty: `![](…)`.
- **File names**: same rules as posts (lowercase, hyphens, no spaces or accents).
- **Weight**: resize photos to at most 1600 pixels wide and compress them (JPEG quality around 80,
  or WebP). Aim for less than 300 KB per image: the site does not shrink images for you.
- **Formats**: `.jpg` for photos, `.png` or `.svg` for logos and diagrams, `.webp` for both.
- Images in both translations of a post can be the same files: no need to copy them.
- Only publish photos you have the right to use, and of people who agreed to appear on the site.

#### Typography

The site uses typographic apostrophes (`’`) and, in French, non-breaking spaces before `:`, `;`,
`?`, `!` and inside `« »`. Straight apostrophes (`'`) and regular spaces work too; consistency
within a post matters more than perfection.

### Translations

Posts do not have to be translated, but when they are, the two files must be linked:

1. Write the post in each language folder, each with its own file name.
2. Give both files **the same `translationKey`** value.

```md
<!-- src/content/news/en/fertility-hackathon-2026.md -->
---
title: Our first fertility hackathon
translationKey: hackathon-2026
…
---
```

```md
<!-- src/content/news/fr/hackathon-fertilite-2026.md -->
---
title: Notre premier hackathon sur la fertilité
translationKey: hackathon-2026
…
---
```

With the same key, the **EN / FR** switch at the top of the page jumps directly from one version
to the other, and search engines know the two pages are translations.

If a post exists in only one language, the language switch leads to the news list of the other
language. You can add the translation later: just reuse the same `translationKey`.

The key is never shown to readers, and must be unique: two unrelated posts must not share it.

### Drafts

Set `draft: true` in the header to work on a post without publishing it: it is **left out** of the
published site (no page, no entry in the news list or in the site map).

Set `draft: false` (or remove the line) when the post is ready.

> Drafts are not secret: the file is stored in the repository like any other, and anyone with
> access to the repository can read it.

There is no scheduled publication: a post with a future `pubDate` is published as soon as the site
is rebuilt, with that date displayed. Use `draft: true` until the day it should go online.

### Updating or removing a post

- **Fix a typo or a detail**: just edit the file. No need to change any date.
- **Significant update** (new information, correction of a mistake): edit the file and add or change
  `updatedDate`. Consider saying what changed at the end of the post.
- **Remove a post**: delete its file (and its images in `public/images/news/` if no other post uses
  them). If it has a translation, decide whether to remove both. Remember that links shared
  elsewhere will then lead to a "page not found" error.

### Submitting your post

The site's files are stored on GitHub, in the
[`tech4fertility/landing-website`](https://github.com/tech4fertility/landing-website) repository.

**From your browser, without installing anything:**

1. Open the repository on GitHub and go to `src/content/news/en/` (or `fr/`).
2. Click **Add file → Create new file**, type the file name (for example
   `fertility-hackathon-2026.md`) and paste your post.
3. To add images, go to `public/images/news/` and use **Add file → Upload files**.
4. When saving, choose **Create a new branch** and open a **pull request**: it is a request to add
   your changes to the site, which a maintainer reviews before publication.

**With Git, if you are used to it:** create a branch, add your files, commit and open a pull
request.

Once the pull request is accepted, the post is part of the site and goes online with the next
publication of the website.

### When something goes wrong

Build errors are reported by the maintainer reviewing your pull request. The usual causes:

| Symptom                                                                   | Likely cause and fix                                                                                      |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| The build fails and the message mentions your file and a field name       | A required field is missing, misspelled (`pubdate` instead of `pubDate`: names are case-sensitive), or has the wrong format (date not in `YYYY-MM-DD`). |
| The build fails on a line of the header that contains `:`                 | Put the value between double quotes (see [Header pitfalls](#header-pitfalls)).                            |
| The build fails with "is not inside a language folder"                    | Move the file into `src/content/news/en/` or `src/content/news/fr/`.                                      |
| The post does not appear on the published site                           | It is still `draft: true`, or the file does not end in `.md`.                                              |
| The post appears in the wrong position in the list                        | Check `pubDate`: the list is sorted by that date, newest first.                                           |
| The language switch goes to the news list instead of the translation      | The two `translationKey` values are not exactly identical (check spaces and capitals).                    |
| An image does not show                                                     | The address must start with `/images/news/`, not `public/…`, and match the file name exactly, capitals included (`Photo.JPG` ≠ `photo.jpg`). |
| The header is displayed as text at the top of the post                    | The first line of the file must be exactly `---`, with nothing before it (not even a blank line).        |

### Checklist before submitting

- [ ] The file is in `src/content/news/en/` or `src/content/news/fr/` and ends in `.md`.
- [ ] The file name is lowercase, with hyphens, no spaces or accents.
- [ ] `title`, `description`, `pubDate` and `translationKey` are filled in.
- [ ] `draft: false` (or no `draft` line) if the post must be published.
- [ ] Sections start at `##`.
- [ ] Every image is in `public/images/news/`, is reasonably light and has a description.
- [ ] Internal links start with `/en/` or `/fr/` and point to pages in the post's language.
- [ ] If translated: both files share the same `translationKey`.

---

## For developers

The site is built with [Astro](https://astro.build) as a fully static website. The project
structure, conventions (internationalization, styles, accessibility) and commands are documented
in [`AGENTS.md`](AGENTS.md).

| Task                         | Command                                     |
| ---------------------------- | ------------------------------------------- |
| Install dependencies         | `npm install`                               |
| Dev server (live reload)     | `npm run dev` → http://localhost:4321/      |
| Production build (`./dist`)  | `npm run build`                             |
| Preview the production build | `npm run preview`                           |

## License

All rights reserved: see [`LICENSE.md`](LICENSE.md). Information published on the site may be
reused with a link to the source.
