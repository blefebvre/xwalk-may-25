/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-logos
 * Base block: cards
 * Source: https://www.sling.com/programming/local-channels
 * Selector: .channel-shopper
 * Generated: 2026-05-25
 *
 * Container block: each card item becomes one row with columns [image, text].
 * UE model fields per card: image (reference), text (richtext).
 */
export default function parse(element, { document }) {
  // Each card item is a .sc-jdfcpN div containing a picture/img logo
  const cardItems = element.querySelectorAll('.sc-jdfcpN');
  const cells = [];

  cardItems.forEach((card) => {
    const picture = card.querySelector('picture');
    if (!picture) return;

    const img = picture.querySelector('img');
    // Skip inline SVG data URIs (badge overlays, not actual logo images)
    if (img && img.getAttribute('src') && img.getAttribute('src').startsWith('data:')) return;

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(picture);

    // Build text cell - these logo cards typically have no text content,
    // but include the cell for proper column structure
    const textCell = document.createDocumentFragment();

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-logos', cells });
  element.replaceWith(block);
}
