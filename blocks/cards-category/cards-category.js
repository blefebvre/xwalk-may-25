import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* Pair consecutive rows: odd rows are images, even rows are text labels */
  const ul = document.createElement('ul');
  const rows = [...block.children];

  for (let i = 0; i < rows.length; i += 2) {
    const imageRow = rows[i];
    const textRow = rows[i + 1];
    const li = document.createElement('li');
    moveInstrumentation(imageRow, li);

    // Process image row
    const imageDiv = document.createElement('div');
    imageDiv.className = 'cards-category-card-image';
    while (imageRow.firstElementChild) {
      const child = imageRow.firstElementChild;
      while (child.firstElementChild) imageDiv.append(child.firstElementChild);
      child.remove();
    }
    li.append(imageDiv);

    // Process text row
    if (textRow) {
      const textDiv = document.createElement('div');
      textDiv.className = 'cards-category-card-body';
      while (textRow.firstElementChild) {
        const child = textRow.firstElementChild;
        while (child.firstElementChild) textDiv.append(child.firstElementChild);
        child.remove();
      }
      li.append(textDiv);
    }

    ul.append(li);
  }

  // Convert image links to actual pictures
  ul.querySelectorAll('.cards-category-card-image a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && (href.includes('scene7.com') || href.match(/\.(png|jpg|jpeg|gif|webp)/i))) {
      const alt = link.textContent.trim();
      const pic = createOptimizedPicture(href, alt, false, [{ width: '750' }]);
      moveInstrumentation(link, pic.querySelector('img'));
      link.closest('p')?.replaceWith(pic);
    }
  });

  // Also handle any existing picture elements
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
