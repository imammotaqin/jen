# Sukma Wijayanti — QA Portfolio

A single-page professional portfolio for **Sukma Wijayanti**, Software Quality Assurance
specialist across life insurance and banking core systems.

Built as a dependency-free static site (HTML, CSS, vanilla JS) so it deploys on Vercel
with no build step and stays fast on any connection.

## Highlights

- Editorial serif / technical mono design system with light & dark themes
- Portrait-led profile badge and a matching 1200×630 social preview card
- Animated “SIT summary” hero card reflecting real QA coverage
- Client logo marquee, onsite engagement case cards with official company links
- Filterable index of 30 tested workstreams
- Scroll reveal, count-up statistics, scroll-spy navigation, copy-email toast
- Responsive from 360 px to wide desktop
- Accessible: skip link, semantic landmarks, focus states, ARIA labels,
  `prefers-reduced-motion` support
- SEO: meta/OG tags, JSON-LD `Person` schema, custom OG image

## Project structure

```
.
├── index.html                  # All page content
├── vercel.json                 # Clean URLs, security headers, asset caching
├── assets
│   ├── css/styles.css          # Design tokens + components
│   ├── js/main.js              # Theme, nav, reveal, filters, counters
│   ├── logos/                  # Company & university marks
│   ├── img/                    # Portrait (extracted from the CV)
│   ├── cv/                     # Downloadable CV (PDF)
│   ├── og-image.png            # 1200×630 social card
│   └── favicon.svg
└── README.md
```

## Run locally

No dependencies required.

```bash
# from the project root
python -m http.server 4173
```

Then open <http://localhost:4173>.

## Deploy to Vercel

1. Push this repository to GitHub (`imammotaqin/jen`).
2. In Vercel: **Add New → Project → Import** the repository.
3. Framework preset: **Other**. Build command: *none*. Output directory: *root*.
4. Deploy.

`vercel.json` already handles clean URLs, basic security headers and asset caching.

### After the first deploy

Update the social preview URL to an absolute address (social crawlers do not accept
relative image paths). In `index.html`:

```html
<meta property="og:image" content="https://YOUR-DOMAIN/assets/og-image.png" />
<meta name="twitter:image" content="https://YOUR-DOMAIN/assets/og-image.png" />
```

Add `"og:url"` and `<link rel="canonical">` with the final domain as well.

## Updating content

All copy lives in `index.html`; styling tokens (colors, fonts, spacing) are at the top of
`assets/css/styles.css`. Company links open the official websites:

| Client | Official site |
| --- | --- |
| Astra Life | https://www.astralife.co.id/ |
| Allianz Life Indonesia | https://www.allianz.co.id/ |
| AXA Mandiri Financial Services | https://www.axa-mandiri.co.id/ |
| Prudential Life Assurance | https://www.prudential.co.id/ |
| Bank Mandiri | https://www.bankmandiri.co.id/ |
| Bank Danamon | https://www.danamon.co.id/ |
| Samudera Indonesia | https://www.samudera.id/ |

Employer links: [Accord Innovations](https://accordinnovations.com/),
[Nityo Infotech](https://nityo.com/), [Asia Sinergi Solusindo](https://assindo.co.id),
[Gunadarma University](https://www.gunadarma.ac.id/).

## Assets & trademarks

Logo files are compiled from the companies' official websites and Wikimedia Commons,
and are used solely to identify the organisations in Sukma's professional history.
All logos and brand names are trademarks of their respective owners; this portfolio is
not affiliated with or endorsed by those companies.

The downloadable CV is the property of its author and is provided for recruitment use.

## License

Site code: MIT. Content, CV and personal data: all rights reserved.
