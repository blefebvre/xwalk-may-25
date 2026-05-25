/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-faq
 * Base block: tabs
 * Source: https://www.sling.com/programming/local-channels
 *
 * UE Model: tabs-faq-item (container block)
 *   Row per tab item, 2 columns:
 *     Col 1 (left): title
 *     Col 2 (right): content_heading, content_image, content_richtext
 */
export default function parse(element, { document }) {
  const faqAccordions = Array.from(element.querySelectorAll('.faq-accordion'));

  const allButtons = Array.from(element.querySelectorAll('button'));
  const accordionButtons = new Set();
  faqAccordions.forEach((acc) => {
    Array.from(acc.querySelectorAll('button')).forEach((btn) => accordionButtons.add(btn));
  });
  const tabButtons = allButtons.filter((btn) => !accordionButtons.has(btn));

  const cells = [];
  const numTabs = Math.max(tabButtons.length, faqAccordions.length);

  for (let i = 0; i < numTabs; i++) {
    const tabButton = tabButtons[i];
    const accordion = faqAccordions[i];
    const tabLabel = tabButton ? tabButton.textContent.trim() : `Tab ${i + 1}`;

    // Column 1 (left): title - wrap in a div so createBlock treats it as one cell
    const titleCell = document.createElement('div');
    titleCell.appendChild(document.createComment(' field:title '));
    const titleP = document.createElement('p');
    titleP.textContent = tabLabel;
    titleCell.appendChild(titleP);

    // Column 2 (right): content_ grouped fields - wrap in a div
    const contentCell = document.createElement('div');

    // content_heading
    contentCell.appendChild(document.createComment(' field:content_heading '));
    const h3 = document.createElement('h3');
    h3.textContent = tabLabel;
    contentCell.appendChild(h3);

    // content_image (empty - no image for FAQ tabs)
    contentCell.appendChild(document.createComment(' field:content_image '));

    // content_richtext - FAQ accordion Q&A items
    contentCell.appendChild(document.createComment(' field:content_richtext '));

    if (accordion) {
      const itemButtons = Array.from(accordion.querySelectorAll('button'));

      itemButtons.forEach((btn) => {
        const questionText = btn.textContent.trim();
        if (!questionText) return;

        const questionP = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = questionText;
        questionP.appendChild(strong);
        contentCell.appendChild(questionP);

        let answerDiv = null;

        let sibling = btn.nextElementSibling;
        while (sibling) {
          if (sibling.tagName === 'DIV' && sibling.querySelector('p')) {
            answerDiv = sibling;
            break;
          }
          sibling = sibling.nextElementSibling;
        }

        if (!answerDiv) {
          const btnParent = btn.parentElement;
          if (btnParent) {
            const grandParent = btnParent.parentElement;
            if (grandParent) {
              const siblings = Array.from(grandParent.children);
              const btnParentIndex = siblings.indexOf(btnParent);
              for (let j = btnParentIndex + 1; j < siblings.length; j++) {
                if (siblings[j].querySelector('p')) {
                  answerDiv = siblings[j];
                  break;
                }
              }
            }
          }
        }

        if (!answerDiv) {
          const btnParent = btn.parentElement;
          if (btnParent && btnParent.parentElement) {
            const greatGrandParent = btnParent.parentElement.parentElement;
            if (greatGrandParent) {
              const siblings = Array.from(greatGrandParent.children);
              const gpIndex = siblings.indexOf(btnParent.parentElement);
              for (let j = gpIndex + 1; j < siblings.length; j++) {
                if (siblings[j].querySelector('p')) {
                  answerDiv = siblings[j];
                  break;
                }
              }
            }
          }
        }

        if (answerDiv) {
          const paragraphs = answerDiv.querySelectorAll('p');
          paragraphs.forEach((p) => {
            const cloned = p.cloneNode(true);
            const text = cloned.textContent.trim().replace(/ /g, '');
            if (text || cloned.querySelector('a, img')) {
              contentCell.appendChild(cloned);
            }
          });
        }
      });
    }

    // Each row: [left col (title), right col (content)]
    cells.push([titleCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-faq', cells });
  element.replaceWith(block);
}
