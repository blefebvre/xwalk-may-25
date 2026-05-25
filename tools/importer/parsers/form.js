/* eslint-disable */
/* global WebImporter */
/**
 * Parser for form variant.
 * Base block: form
 * Source: https://www.sling.com/programming/local-channels
 * Selector: .zip-locals
 * Generated: 2026-05-25
 *
 * UE Model fields:
 *   - reference (aem-content): Form definition path
 *   - action (text/string): Action URL
 *
 * The form block references a form definition JSON file.
 * The source HTML contains a ZIP code lookup form rendered by React.
 */
export default function parse(element, { document }) {
  // Extract form element to check for action attribute
  const formEl = element.querySelector('form');
  const actionUrl = formEl ? formEl.getAttribute('action') || '' : '';

  // The form block library example shows a single row with a path to a form definition.
  // For xwalk, we produce the reference field pointing to the form definition path.
  // The actual form definition JSON will be created separately during migration.
  const formPath = '/forms/form-definition.json';

  const cells = [];

  // Row 1: reference field - form definition path
  const refFrag = document.createDocumentFragment();
  refFrag.appendChild(document.createComment(' field:reference '));
  const refLink = document.createElement('a');
  refLink.href = formPath;
  refLink.textContent = formPath;
  refFrag.appendChild(refLink);
  cells.push([refFrag]);

  // Row 2: action field - action URL (only if present)
  if (actionUrl) {
    const actionFrag = document.createDocumentFragment();
    actionFrag.appendChild(document.createComment(' field:action '));
    actionFrag.appendChild(document.createTextNode(actionUrl));
    cells.push([actionFrag]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
