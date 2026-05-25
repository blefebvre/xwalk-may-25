/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-devices
 * Base block: cards
 * Source: https://www.sling.com/programming/local-channels
 * Selector: #supported-devices
 * Description: A grid of device brand logos (AppleTV, iOS, Roku, FireTV, etc.)
 *   Live DOM renders inline <svg> elements inside #available-on-device-ribbon.
 *   Static HTML may have <img src="data:image/svg+xml;base64,..."> instead.
 *   Output references local /icons/*.svg files for reliable rendering.
 */
export default function parse(element, { document }) {
  const ribbonContainer = element.querySelector('#available-on-device-ribbon, .available-on-device-ribbon--container, [class*="available-on-device-ribbon"]');
  const container = ribbonContainer || element;

  const cells = [];

  // Extract device names from SVGs or data-URI imgs
  const svgs = Array.from(container.querySelectorAll('svg'));
  const dataImgs = Array.from(container.querySelectorAll('img[src^="data:image/svg"]'));
  const sources = svgs.length > 0 ? svgs : dataImgs;

  sources.forEach((el) => {
    let altText = 'device icon';
    let iconName = 'device';

    if (el.tagName === 'svg') {
      const titleEl = el.querySelector('title');
      altText = titleEl ? titleEl.textContent.trim() : 'device icon';
    } else {
      altText = el.getAttribute('alt') || 'device icon';
      // Try to extract name from data URI
      try {
        const src = el.getAttribute('src') || '';
        const base64 = src.replace('data:image/svg+xml;base64,', '');
        const svgText = atob(base64);
        const titleMatch = svgText.match(/<title>([^<]+)<\/title>/);
        if (titleMatch) altText = titleMatch[1];
      } catch (e) { /* keep existing alt */ }
    }

    // Derive icon filename from alt text
    iconName = altText.toLowerCase().replace(/\s+icon$/i, '').replace(/[^a-z0-9]+/g, '');

    const img = document.createElement('img');
    img.setAttribute('src', '/icons/' + iconName + '.svg');
    img.setAttribute('alt', altText);

    const picture = document.createElement('picture');
    picture.appendChild(img);

    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:image '));
    frag.appendChild(picture);
    cells.push([frag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-devices', cells });
  element.replaceWith(block);
}
