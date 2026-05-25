/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Sling TV section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for sections with styles.
 * Section selectors verified against captured DOM (migration-work/cleaned.html):
 *   - .marquee-template (line 218)
 *   - #layout-container-v2-3c76ec8aa3 (line 243)
 *   - #layout-container-v2-00a09c6096 (line 387)
 *   - #layout-container-v2-3c66b4a245 (line 543)
 *   - #supported-devices (line 818)
 *   - .tabbed-faq (line 910)
 *   - #layout-container-v2-3c66b4a245 ~ .experiencefragment .layout-container-v2.primary-dark:last-of-type (line 1506)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues when inserting elements
    const resolvedSections = [];
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      let sectionEl = null;
      try {
        sectionEl = element.querySelector(section.selector);
      } catch (e) {
        // Complex selector may fail; try fallback below
      }
      // Fallback for section 7 "Still Have Questions": use the inner container ID
      // Found in DOM line 1507: <div id="layout-container-v2-4f73e6e213" class="cmp-container">
      if (!sectionEl && section.selector.includes('last-of-type')) {
        const fallback = element.querySelector('#layout-container-v2-4f73e6e213');
        if (fallback) {
          sectionEl = fallback.closest('.layout-container-v2.primary-dark') || fallback;
        }
      }
      if (sectionEl) {
        resolvedSections.push({ index: i, section, el: sectionEl });
      }
    }

    // Process in reverse order
    for (let i = resolvedSections.length - 1; i >= 0; i--) {
      const { index, section, el } = resolvedSections[i];

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert section metadata after the section element (at the end of the section)
        if (el.nextSibling) {
          el.parentNode.insertBefore(sectionMetadata, el.nextSibling);
        } else {
          el.parentNode.appendChild(sectionMetadata);
        }
      }

      // Insert <hr> before non-first sections to create section breaks
      if (index > 0) {
        const hr = document.createElement('hr');
        el.parentNode.insertBefore(hr, el);
      }
    }
  }
}
