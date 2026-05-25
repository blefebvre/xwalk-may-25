/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroMarqueeParser from './parsers/hero-marquee.js';
import columnsPlansParser from './parsers/columns-plans.js';
import formParser from './parsers/form.js';
import cardsLogosParser from './parsers/cards-logos.js';
import cardsCategoryParser from './parsers/cards-category.js';
import cardsDevicesParser from './parsers/cards-devices.js';
import tabsFaqParser from './parsers/tabs-faq.js';

// TRANSFORMER IMPORTS
import slingCleanupTransformer from './transformers/sling-cleanup.js';
import slingDmImagesTransformer from './transformers/sling-dm-images.js';
import slingSectionsTransformer from './transformers/sling-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-marquee': heroMarqueeParser,
  'columns-plans': columnsPlansParser,
  'form': formParser,
  'cards-logos': cardsLogosParser,
  'cards-category': cardsCategoryParser,
  'cards-devices': cardsDevicesParser,
  'tabs-faq': tabsFaqParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  slingCleanupTransformer,
  slingDmImagesTransformer,
];

// Section transformer runs in afterTransform
const sectionTransformers = [
  slingSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'programming-page',
  description: 'Programming category page showcasing local channel availability and options',
  urls: ['https://www.sling.com/programming/local-channels'],
  blocks: [
    {
      name: 'hero-marquee',
      instances: ['.marquee-template'],
    },
    {
      name: 'columns-plans',
      instances: ['.column-control.column-carousel .flex-row .flex-col-33'],
    },
    {
      name: 'form',
      instances: ['.zip-locals'],
    },
    {
      name: 'cards-logos',
      instances: ['.channel-shopper'],
    },
    {
      name: 'cards-category',
      instances: ['#layout-container-v2-3c66b4a245 .column-control.column-carousel .flex-row .flex-col-16'],
    },
    {
      name: 'cards-devices',
      instances: ['#supported-devices'],
    },
    {
      name: 'tabs-faq',
      instances: ['.tabbed-faq'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero / Marquee',
      selector: '.marquee-template',
      style: null,
      blocks: ['hero-marquee'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Plans for Locals Fans',
      selector: '#layout-container-v2-3c76ec8aa3',
      style: 'dark',
      blocks: ['columns-plans'],
      defaultContent: ['#layout-container-v2-3c76ec8aa3 .rich-text h2'],
    },
    {
      id: 'section-3',
      name: 'ZIP Code Lookup and Channel Showcase',
      selector: '#layout-container-v2-00a09c6096',
      style: 'dark',
      blocks: ['form', 'cards-logos'],
      defaultContent: ['#layout-container-v2-00a09c6096 .rich-text h2', '#layout-container-v2-00a09c6096 .rich-text .paragraph-large'],
    },
    {
      id: 'section-4',
      name: 'Trending Categories',
      selector: '#layout-container-v2-3c66b4a245',
      style: 'dark',
      blocks: ['cards-category'],
      defaultContent: ['#layout-container-v2-3c66b4a245 .rich-text h2'],
    },
    {
      id: 'section-5',
      name: 'Supported Devices',
      selector: '#supported-devices',
      style: null,
      blocks: ['cards-devices'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'FAQ',
      selector: '.tabbed-faq',
      style: null,
      blocks: ['tabs-faq'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Still Have Questions',
      selector: '#layout-container-v2-3c66b4a245 ~ .experiencefragment .layout-container-v2.primary-dark:last-of-type',
      style: 'dark',
      blocks: [],
      defaultContent: [".rich-text img[alt='Question icon']", '.rich-text h2'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });

  if (hookName === 'afterTransform') {
    sectionTransformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Section transformer failed:`, e);
      }
    });
  }
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (cleanup + DM images)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
