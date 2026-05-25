/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-category
 * Base block: cards
 * Source: https://www.sling.com/programming/local-channels
 * Selector: #layout-container-v2-3c66b4a245 .column-control.column-carousel .flex-row .flex-col-16
 * Generated: 2026-05-25
 *
 * Extracts category navigation cards from a carousel grid.
 * Each card has an image linked to a category page.
 * Source structure: .flex-col-16 > .responsive-image-container > a > img
 * Target structure (per card): Row 1 = image, Row 2 = link text
 *
 * UE Model: card { image (reference), text (richtext) }
 * Field hints: image, text
 */
export default function parse(element, { document }) {
  // Navigate to the parent .flex-row to gather all sibling cards
  const flexRow = element.closest('.flex-row');
  if (!flexRow) {
    // Fallback: treat element itself as a single card container
    const cards = [element];
    const cells = buildCells(cards, document);
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
    element.replaceWith(block);
    return;
  }

  // Check if this element is the first .flex-col-16 in the row
  // If not, remove it (the first one already built the full block)
  const allCards = Array.from(flexRow.querySelectorAll(':scope > .flex-col-16, :scope > div.js-column-carousel-column'));
  const firstCard = allCards[0];
  if (element !== firstCard) {
    // This card was already included when the first card was processed
    element.remove();
    return;
  }

  // Build cells from all cards in the row
  const cells = buildCells(allCards, document);
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });

  // Remove all sibling cards except the first (which we replace)
  allCards.slice(1).forEach((card) => card.remove());
  element.replaceWith(block);
}

/**
 * Build cells array from card elements.
 * Each card produces two rows: image row and text/link row.
 * Follows library example structure and xwalk field hinting.
 */
function buildCells(cards, document) {
  const cells = [];

  cards.forEach((card) => {
    // Extract the link element wrapping the image
    const link = card.querySelector('a.js-responsive-image-link, a.responsive-image-link');
    // Extract the desktop image (prefer desktop over mobile)
    const img = card.querySelector('img.responsive-image-img-desktop, img[class*="desktop"], img');

    // Row 1: Image with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      const imgClone = img.cloneNode(true);
      imageCell.appendChild(imgClone);
    }
    cells.push([imageCell]);

    // Row 2: Link/text with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (link) {
      const linkClone = document.createElement('a');
      linkClone.href = link.href;
      // Use the image alt text as the link label (category name)
      const label = img ? img.alt : '';
      linkClone.textContent = label || 'Learn more';
      textCell.appendChild(linkClone);
    }
    cells.push([textCell]);
  });

  return cells;
}
