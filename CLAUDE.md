# CLAUDE.md

## Project Notes

This is an AEM Edge Delivery Services (xwalk) project for content migration from sling.com.

## Rules

- **Never create `.html` copies of `.plain.html` files.** The AEM local dev server (`aem up`) serves `.plain.html` files directly. Do not create duplicate `.html` files in the content directory.
- **Never generate HTML content directly in `/content/`.** Always use the import pipeline (parsers + transformers + import script + run-bulk-import.js) to produce content files.

## Learnings

- The local AEM dev server (`npx aem up`) resolves content from `content/**/*.plain.html` — no `.html` copy needed.
- `npm start` is not configured in this project; use `npx aem up --port 3000` to start the dev server.
- Proxima Nova font is served via the fallback Typekit kit `cwm0xxe`.
- Device brand logos on sling.com are inline SVGs with `fill="#f5f5f6"` (designed for dark backgrounds). When used on a light section, the fill must be changed to a dark color.
- The xwalk boilerplate's `buildAutoBlocks()` function is declared without a `main` parameter even though `decorateMain` passes `main` as an argument. Always add the `main` parameter when calling functions inside it.
- For cards/container blocks in xwalk projects, the parser must produce 2-column rows (left col = key field, right col = grouped content fields) to match the UE model structure. Single-column alternating rows won't map correctly.
- Scene7/DM image URLs on sling.com use vanity domains (`dish.scene7.com`). The DM transformer and auto-block handle these via `/is/image/` path detection.
