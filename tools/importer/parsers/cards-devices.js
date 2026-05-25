/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-devices
 * Base block: cards
 * Source: https://www.sling.com/programming/local-channels
 * Selector: #supported-devices
 * Description: A grid of device brand logos (AppleTV, iOS, Roku, FireTV, etc.)
 *   displayed as cards. Each device logo SVG becomes one card row.
 *   Live DOM renders inline SVGs (not img tags) inside #available-on-device-ribbon.
 * Generated: 2026-05-25
 */
export default function parse(element, { document }) {
  // Find the device ribbon container using stable ID/class selectors
  const ribbonContainer = element.querySelector('#available-on-device-ribbon, .available-on-device-ribbon--container, [class*="available-on-device-ribbon"]');
  const container = ribbonContainer || element;

  // Device logos are rendered as inline SVG elements (not <img> tags)
  // Each SVG has a <title> element with the device name (e.g. "AppleTV icon")
  const svgs = Array.from(container.querySelectorAll('svg'));

  // Build cells array - container block: each card item = one row
  // Card model fields: image (reference), text (richtext)
  // Library example shows single image per card row
  const cells = [];

  svgs.forEach((svg) => {
    // Extract the device name from SVG <title> element for alt text
    const titleEl = svg.querySelector('title');
    const altText = titleEl ? titleEl.textContent.trim() : 'device icon';

    // Create an img element referencing the SVG as a placeholder for import
    // The SVG content will be handled as an asset during content migration
    const img = document.createElement('img');
    img.setAttribute('alt', altText);
    img.setAttribute('src', `/icons/${altText.toLowerCase().replace(/\s+icon$/i, '').replace(/\s+/g, '-')}.svg`);

    // Create a document fragment with field hint for image
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:image '));
    frag.appendChild(img);
    cells.push([frag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-devices', cells });
  element.replaceWith(block);
}
