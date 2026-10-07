# Hurley

The village app for Hurley, part of the **It Takes a Village** collective.
Lives at https://ittakesavillagecollective.co.uk/hurley/ (GitHub Pages, served under the org's custom domain).

Public repo: no secrets, tokens or personal data in here.

## Structure (v0.1)
- `index.html` home: top bar (admin `!` hidden until admin sign-in exists, Profile, Settings, About Us) + 8-button grid
- `place.html?p=<id>` one page for every button; content lives in `js/data.js` (`PLACES`, `VERSION`)
- `install.html` device-aware install guide (Android prompt, iPhone 3 steps, in-app-browser warning)
- `about.html` copied from the collective master (`_assets/it-takes-a-village/about.html`)
- `sw.js` network-first, so updates arrive automatically; bump `VERSION` and the `CACHE` name together
- `icons/hurley-logo-source.png` is the work-in-progress logo the icons were made from
