/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-marquee
 * Base block: hero
 * Source: https://www.sling.com/programming/local-channels
 * Selector: .marquee-template
 * Generated: 2026-05-25
 *
 * UE Model fields:
 *   - image (reference) → row 1
 *   - imageAlt (collapsed into image)
 *   - text (richtext) → row 2 (heading + description + CTA)
 */
export default function parse(element, { document }) {
  // Extract background image from source
  const bgImage = element.querySelector('img[alt="Sling Marquee Background"], img[src*="c47588f0bf03a0a83de34d22cfaf5dd7"], .sc-jhAzac img, img');

  // Extract heading (h1 primary, h2 fallback)
  const heading = element.querySelector('h1, .sc-dVhcbM h1, [class*="bXteev"] h1');

  // Extract subheading/description (h2 used as subtitle in source)
  const description = element.querySelector('h2, .sc-dVhcbM h2, [class*="bXteev"] h2');

  // Extract CTA link(s)
  const ctaLinks = Array.from(element.querySelectorAll('a#marquee-cta, .sc-gisBJw a, [class*="jNKMrR"] a'));

  // Build cells array matching UE model: image (row 1), text (row 2)
  const cells = [];

  // Row 1: image field (with field hint)
  if (bgImage) {
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(bgImage);
    cells.push([imageFrag]);
  } else {
    // Empty row required by xwalk model
    cells.push(['']);
  }

  // Row 2: text field (richtext - heading + description + CTA combined)
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (heading) textFrag.appendChild(heading);
  if (description) textFrag.appendChild(description);
  ctaLinks.forEach((cta) => {
    const p = document.createElement('p');
    p.appendChild(cta);
    textFrag.appendChild(p);
  });
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-marquee', cells });
  element.replaceWith(block);
}
