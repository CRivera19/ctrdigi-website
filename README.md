# CTR Digital website

The public website for CTR Digital, a web design and AI studio in Victorville, California: [ctrdigi.com](https://ctrdigi.com).

Plain HTML, CSS and JavaScript with no build step. GitHub Pages serves the files in this folder as they are.

## Files

| File | What it is |
|---|---|
| `index.html` | Home page: services, approach, pricing, FAQ, contact form |
| `privacy.html`, `cookies.html`, `terms.html`, `refunds.html` | Policies (pending attorney review) |
| `404.html` | Page shown for missing URLs |
| `styles.css`, `script.js` | Styles and behaviour (menu, contact form, animations) |
| `assets/` | Logo, favicon, link preview image, email signature logo |
| `CNAME` | Custom domain for GitHub Pages |
| `robots.txt`, `sitemap.xml` | For search engines |

## Contact form

The form opens the visitor's email app, addressed to chris@ctrdigi.com. Nothing is stored by the site. To receive messages directly instead, create a form at Formspree, set `FORM_ENDPOINT` in `script.js`, and list Formspree in `privacy.html`.

## Updating

Edit the files, then commit and push to `main`. GitHub Pages republishes within a minute or two.

When prices change, update `index.html` together with the rate card, service sheet and proposal template.
