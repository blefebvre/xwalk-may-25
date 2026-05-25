// eslint-disable-next-line import/no-unresolved
import { moveInstrumentation } from '../../scripts/scripts.js';

// keep track globally of the number of tab blocks on the page
let tabBlockCnt = 0;

/**
 * Convert panel content into FAQ accordion items.
 * Content structure: h3 (hidden title), then alternating <p><strong>Q</strong></p> + answer <p>s
 */
function buildAccordion(panel) {
  const contentDiv = panel.querySelector(':scope > div');
  if (!contentDiv) return;

  const children = [...contentDiv.children];
  const items = [];
  let currentItem = null;

  children.forEach((child) => {
    // Skip the h3 heading (tab title duplicate)
    if (child.tagName === 'H3') return;

    // A paragraph with only a <strong> child is a question
    const isQuestion = child.tagName === 'P'
      && child.querySelector(':scope > strong')
      && child.textContent.trim() === child.querySelector(':scope > strong').textContent.trim();

    if (isQuestion) {
      // Start a new FAQ item
      currentItem = {
        question: child.textContent.trim(),
        answerElements: [],
      };
      items.push(currentItem);
    } else if (currentItem) {
      // Add to current answer
      currentItem.answerElements.push(child);
    }
  });

  // Rebuild the content div with accordion structure
  contentDiv.innerHTML = '';

  items.forEach((item) => {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';

    const question = document.createElement('div');
    question.className = 'faq-question';
    question.textContent = item.question;
    question.setAttribute('role', 'button');
    question.setAttribute('aria-expanded', 'false');
    question.tabIndex = 0;

    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    answer.setAttribute('role', 'region');
    item.answerElements.forEach((el) => answer.appendChild(el));

    faqItem.appendChild(question);
    faqItem.appendChild(answer);
    contentDiv.appendChild(faqItem);

    // Click to toggle
    question.addEventListener('click', () => {
      const isOpen = faqItem.classList.contains('open');
      faqItem.classList.toggle('open');
      question.setAttribute('aria-expanded', !isOpen);
    });

    // Keyboard support
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-faq-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt += 1}`;

  // the first cell of each row is the title of the tab
  const tabHeadings = [...block.children]
    .filter((child) => child.firstElementChild && child.firstElementChild.children.length > 0)
    .map((child) => child.firstElementChild);

  tabHeadings.forEach((tab, i) => {
    const id = `tabpanel-${tabBlockCnt}-tab-${i + 1}`;

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-faq-panel';
    tabpanel.id = id;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-faq-tab';
    button.id = `tab-${id}`;

    button.innerHTML = tab.innerHTML;

    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    // add the new tab list button, to the tablist
    tablist.append(button);

    // remove the tab heading from the dom, which also removes it from the UE tree
    tab.remove();

    // remove the instrumentation from the button's h1, h2 etc (this removes it from the tree)
    if (button.firstElementChild) {
      moveInstrumentation(button.firstElementChild, null);
    }
  });

  block.prepend(tablist);

  // Build accordion structure for each panel
  block.querySelectorAll('.tabs-faq-panel').forEach((panel) => {
    buildAccordion(panel);
  });
}
