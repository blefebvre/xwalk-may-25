/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-programming-page.js
  var import_programming_page_exports = {};
  __export(import_programming_page_exports, {
    default: () => import_programming_page_default
  });

  // tools/importer/parsers/hero-marquee.js
  function parse(element, { document }) {
    const bgImage = element.querySelector('img[alt="Sling Marquee Background"], img[src*="c47588f0bf03a0a83de34d22cfaf5dd7"], .sc-jhAzac img, img');
    const heading = element.querySelector('h1, .sc-dVhcbM h1, [class*="bXteev"] h1');
    const description = element.querySelector('h2, .sc-dVhcbM h2, [class*="bXteev"] h2');
    const ctaLinks = Array.from(element.querySelectorAll('a#marquee-cta, .sc-gisBJw a, [class*="jNKMrR"] a'));
    const cells = [];
    if (bgImage) {
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      imageFrag.appendChild(bgImage);
      cells.push([imageFrag]);
    } else {
      cells.push([""]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) textFrag.appendChild(heading);
    if (description) textFrag.appendChild(description);
    ctaLinks.forEach((cta) => {
      const p = document.createElement("p");
      p.appendChild(cta);
      textFrag.appendChild(p);
    });
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-marquee", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-plans.js
  function parse2(element, { document }) {
    const plansSection = element.closest("#layout-container-v2-3c76ec8aa3");
    if (!plansSection) {
      element.remove();
      return;
    }
    const flexRow = element.closest(".flex-row");
    if (!flexRow) {
      element.remove();
      return;
    }
    if (flexRow.dataset.columnsPlansParsed) {
      element.remove();
      return;
    }
    flexRow.dataset.columnsPlansParsed = "true";
    const columns = Array.from(flexRow.querySelectorAll(":scope > .flex-col-33"));
    const row = columns.map((col) => {
      const cell = [];
      const link = col.querySelector("a.responsive-image-link, a.js-responsive-image-link");
      const img = col.querySelector('img.responsive-image-img-desktop, img[class*="responsive-image-img"]');
      if (link && img) {
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
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-plans", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  function parse3(element, { document }) {
    const formEl = element.querySelector("form");
    const actionUrl = formEl ? formEl.getAttribute("action") || "" : "";
    const formPath = "/forms/form-definition.json";
    const cells = [];
    const refFrag = document.createDocumentFragment();
    refFrag.appendChild(document.createComment(" field:reference "));
    const refLink = document.createElement("a");
    refLink.href = formPath;
    refLink.textContent = formPath;
    refFrag.appendChild(refLink);
    cells.push([refFrag]);
    if (actionUrl) {
      const actionFrag = document.createDocumentFragment();
      actionFrag.appendChild(document.createComment(" field:action "));
      actionFrag.appendChild(document.createTextNode(actionUrl));
      cells.push([actionFrag]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-logos.js
  function parse4(element, { document }) {
    const cardItems = element.querySelectorAll(".sc-jdfcpN");
    const cells = [];
    cardItems.forEach((card) => {
      const picture = card.querySelector("picture");
      if (!picture) return;
      const img = picture.querySelector("img");
      if (img && img.getAttribute("src") && img.getAttribute("src").startsWith("data:")) return;
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(picture);
      const textCell = document.createDocumentFragment();
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function parse5(element, { document }) {
    const flexRow = element.closest(".flex-row");
    if (!flexRow) {
      const cards = [element];
      const cells2 = buildCells(cards, document);
      const block2 = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells: cells2 });
      element.replaceWith(block2);
      return;
    }
    const allCards = Array.from(flexRow.querySelectorAll(":scope > .flex-col-16, :scope > div.js-column-carousel-column"));
    const firstCard = allCards[0];
    if (element !== firstCard) {
      element.remove();
      return;
    }
    const cells = buildCells(allCards, document);
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
    allCards.slice(1).forEach((card) => card.remove());
    element.replaceWith(block);
  }
  function buildCells(cards, document) {
    const cells = [];
    cards.forEach((card) => {
      const link = card.querySelector("a.js-responsive-image-link, a.responsive-image-link");
      const img = card.querySelector('img.responsive-image-img-desktop, img[class*="desktop"], img');
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const imgClone = img.cloneNode(true);
        imageCell.appendChild(imgClone);
      }
      cells.push([imageCell]);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (link) {
        const linkClone = document.createElement("a");
        linkClone.href = link.href;
        const label = img ? img.alt : "";
        linkClone.textContent = label || "Learn more";
        textCell.appendChild(linkClone);
      }
      cells.push([textCell]);
    });
    return cells;
  }

  // tools/importer/parsers/cards-devices.js
  function parse6(element, { document }) {
    const ribbonContainer = element.querySelector('#available-on-device-ribbon, .available-on-device-ribbon--container, [class*="available-on-device-ribbon"]');
    const container = ribbonContainer || element;
    const svgs = Array.from(container.querySelectorAll("svg"));
    const cells = [];
    svgs.forEach((svg) => {
      const titleEl = svg.querySelector("title");
      const altText = titleEl ? titleEl.textContent.trim() : "device icon";
      const img = document.createElement("img");
      img.setAttribute("alt", altText);
      img.setAttribute("src", `/icons/${altText.toLowerCase().replace(/\s+icon$/i, "").replace(/\s+/g, "-")}.svg`);
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:image "));
      frag.appendChild(img);
      cells.push([frag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-devices", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-faq.js
  function parse7(element, { document }) {
    const faqAccordions = Array.from(element.querySelectorAll(".faq-accordion"));
    const allButtons = Array.from(element.querySelectorAll("button"));
    const accordionButtons = /* @__PURE__ */ new Set();
    faqAccordions.forEach((acc) => {
      Array.from(acc.querySelectorAll("button")).forEach((btn) => accordionButtons.add(btn));
    });
    const tabButtons = allButtons.filter((btn) => !accordionButtons.has(btn));
    const cells = [];
    const numTabs = Math.max(tabButtons.length, faqAccordions.length);
    for (let i = 0; i < numTabs; i++) {
      const tabButton = tabButtons[i];
      const accordion = faqAccordions[i];
      const tabLabel = tabButton ? tabButton.textContent.trim() : `Tab ${i + 1}`;
      const titleCell = document.createElement("div");
      titleCell.appendChild(document.createComment(" field:title "));
      const titleP = document.createElement("p");
      titleP.textContent = tabLabel;
      titleCell.appendChild(titleP);
      const contentCell = document.createElement("div");
      contentCell.appendChild(document.createComment(" field:content_heading "));
      const h3 = document.createElement("h3");
      h3.textContent = tabLabel;
      contentCell.appendChild(h3);
      contentCell.appendChild(document.createComment(" field:content_image "));
      contentCell.appendChild(document.createComment(" field:content_richtext "));
      if (accordion) {
        const itemButtons = Array.from(accordion.querySelectorAll("button"));
        itemButtons.forEach((btn) => {
          const questionText = btn.textContent.trim();
          if (!questionText) return;
          const questionP = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = questionText;
          questionP.appendChild(strong);
          contentCell.appendChild(questionP);
          let answerDiv = null;
          let sibling = btn.nextElementSibling;
          while (sibling) {
            if (sibling.tagName === "DIV" && sibling.querySelector("p")) {
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
                  if (siblings[j].querySelector("p")) {
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
                  if (siblings[j].querySelector("p")) {
                    answerDiv = siblings[j];
                    break;
                  }
                }
              }
            }
          }
          if (answerDiv) {
            const paragraphs = answerDiv.querySelectorAll("p");
            paragraphs.forEach((p) => {
              const cloned = p.cloneNode(true);
              const text = cloned.textContent.trim().replace(/ /g, "");
              if (text || cloned.querySelector("a, img")) {
                contentCell.appendChild(cloned);
              }
            });
          }
        });
      }
      cells.push([titleCell, contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/sling-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".custom-modal"]);
      WebImporter.DOMUtils.remove(element, [".spacer"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".vspo-banner-area"]);
      WebImporter.DOMUtils.remove(element, [".new-footer"]);
      WebImporter.DOMUtils.remove(element, [".cloudservice"]);
      WebImporter.DOMUtils.remove(element, [".sling-diagnostics--container"]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        'img[src*="t.co/"]',
        'img[src*="analytics.twitter.com"]',
        'img[src*="bat.bing.com"]',
        'img[src*="tags.w55c.net"]',
        "img.ywa-10000",
        '[id^="batBeacon"]'
      ]);
    }
  }

  // tools/importer/transformers/sling-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/transformers/sling-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform3(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const resolvedSections = [];
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        let sectionEl = null;
        try {
          sectionEl = element.querySelector(section.selector);
        } catch (e) {
        }
        if (!sectionEl && section.selector.includes("last-of-type")) {
          const fallback = element.querySelector("#layout-container-v2-4f73e6e213");
          if (fallback) {
            sectionEl = fallback.closest(".layout-container-v2.primary-dark") || fallback;
          }
        }
        if (sectionEl) {
          resolvedSections.push({ index: i, section, el: sectionEl });
        }
      }
      for (let i = resolvedSections.length - 1; i >= 0; i--) {
        const { index, section, el } = resolvedSections[i];
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (el.nextSibling) {
            el.parentNode.insertBefore(sectionMetadata, el.nextSibling);
          } else {
            el.parentNode.appendChild(sectionMetadata);
          }
        }
        if (index > 0) {
          const hr = document.createElement("hr");
          el.parentNode.insertBefore(hr, el);
        }
      }
    }
  }

  // tools/importer/import-programming-page.js
  var parsers = {
    "hero-marquee": parse,
    "columns-plans": parse2,
    "form": parse3,
    "cards-logos": parse4,
    "cards-category": parse5,
    "cards-devices": parse6,
    "tabs-faq": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var sectionTransformers = [
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "programming-page",
    description: "Programming category page showcasing local channel availability and options",
    urls: ["https://www.sling.com/programming/local-channels"],
    blocks: [
      {
        name: "hero-marquee",
        instances: [".marquee-template"]
      },
      {
        name: "columns-plans",
        instances: [".column-control.column-carousel .flex-row .flex-col-33"]
      },
      {
        name: "form",
        instances: [".zip-locals"]
      },
      {
        name: "cards-logos",
        instances: [".channel-shopper"]
      },
      {
        name: "cards-category",
        instances: ["#layout-container-v2-3c66b4a245 .column-control.column-carousel .flex-row .flex-col-16"]
      },
      {
        name: "cards-devices",
        instances: ["#supported-devices"]
      },
      {
        name: "tabs-faq",
        instances: [".tabbed-faq"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero / Marquee",
        selector: ".marquee-template",
        style: null,
        blocks: ["hero-marquee"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Plans for Locals Fans",
        selector: "#layout-container-v2-3c76ec8aa3",
        style: "dark",
        blocks: ["columns-plans"],
        defaultContent: ["#layout-container-v2-3c76ec8aa3 .rich-text h2"]
      },
      {
        id: "section-3",
        name: "ZIP Code Lookup and Channel Showcase",
        selector: "#layout-container-v2-00a09c6096",
        style: "dark",
        blocks: ["form", "cards-logos"],
        defaultContent: ["#layout-container-v2-00a09c6096 .rich-text h2", "#layout-container-v2-00a09c6096 .rich-text .paragraph-large"]
      },
      {
        id: "section-4",
        name: "Trending Categories",
        selector: "#layout-container-v2-3c66b4a245",
        style: "dark",
        blocks: ["cards-category"],
        defaultContent: ["#layout-container-v2-3c66b4a245 .rich-text h2"]
      },
      {
        id: "section-5",
        name: "Supported Devices",
        selector: "#supported-devices",
        style: null,
        blocks: ["cards-devices"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: ".tabbed-faq",
        style: null,
        blocks: ["tabs-faq"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Still Have Questions",
        selector: "#layout-container-v2-3c66b4a245 ~ .experiencefragment .layout-container-v2.primary-dark:last-of-type",
        style: "dark",
        blocks: [],
        defaultContent: [".rich-text img[alt='Question icon']", ".rich-text h2"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
    if (hookName === "afterTransform") {
      sectionTransformers.forEach((transformerFn) => {
        try {
          transformerFn.call(null, hookName, element, enhancedPayload);
        } catch (e) {
          console.error(`Section transformer failed:`, e);
        }
      });
    }
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_programming_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_programming_page_exports);
})();
