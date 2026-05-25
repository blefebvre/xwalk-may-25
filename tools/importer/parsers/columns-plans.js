/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-plans
 * Base block: columns
 * Source: https://www.sling.com/programming/local-channels
 * Selector: .column-control.column-carousel .flex-row .flex-col-33
 * Generated: 2026-05-25
 *
 * Extracts plan card images (each wrapped in a link) from a multi-column
 * carousel layout and produces a single Columns block with one row where
 * each cell contains the linked plan image.
 */
export default function parse(element, { document }) {
  // Only process plan card columns within the plans section
  // The plans section is identified by #layout-container-v2-3c76ec8aa3
  // Other .flex-col-33 carousels (visual nav) should be skipped
  const plansSection = element.closest('#layout-container-v2-3c76ec8aa3');
  if (!plansSection) {
    element.remove();
    return;
  }

  // Navigate to the parent .flex-row to capture all sibling columns
  const flexRow = element.closest('.flex-row');
  if (!flexRow) {
    element.remove();
    return;
  }

  // Prevent duplicate processing when parser is invoked on each .flex-col-33
  // For subsequent siblings, just remove the element (it was already captured)
  if (flexRow.dataset.columnsPlansParsed) {
    element.remove();
    return;
  }
  flexRow.dataset.columnsPlansParsed = 'true';

  // Collect all column elements within this row
  const columns = Array.from(flexRow.querySelectorAll(':scope > .flex-col-33'));

  // Build one row with N cells (one per column)
  // Each cell contains the linked image from the plan card
  const row = columns.map((col) => {
    const cell = [];

    // Each column has a responsive-image-container with a link wrapping the image
    const link = col.querySelector('a.responsive-image-link, a.js-responsive-image-link');
    const img = col.querySelector('img.responsive-image-img-desktop, img[class*="responsive-image-img"]');

    if (link && img) {
      // Clone the link and put just the desktop image inside it
      const a = link.cloneNode(false);
      const image = img.cloneNode(true);
      a.appendChild(image);
      cell.push(a);
    } else if (img) {
      cell.push(img);
    }

    return cell;
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-plans', cells });
  element.replaceWith(block);
}
