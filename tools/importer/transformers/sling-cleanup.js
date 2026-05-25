/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Sling TV site-wide cleanup.
 * Removes non-authorable content from www.sling.com pages.
 * All selectors verified against captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove custom modals (channel detail overlays - not authorable page content)
    // Found in DOM: <div id="selectchannels" class="custom-modal custom-modal--outer">
    // Found in DOM: <div id="channels" class="custom-modal custom-modal--outer">
    WebImporter.DOMUtils.remove(element, ['.custom-modal']);

    // Remove spacer components (decorative, non-authorable)
    // Found in DOM: <div class="spacer parbase aem-GridColumn...">
    WebImporter.DOMUtils.remove(element, ['.spacer']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header navigation (non-authorable site chrome)
    // Found in DOM: <div class="experiencefragment aem-GridColumn aem-GridColumn--default--12 vspo-banner-area">
    WebImporter.DOMUtils.remove(element, ['.vspo-banner-area']);

    // Remove footer (non-authorable site chrome)
    // Found in DOM: <div class="new-footer parbase aem-GridColumn aem-GridColumn--default--12">
    WebImporter.DOMUtils.remove(element, ['.new-footer']);

    // Remove cloud service / test-and-target container
    // Found in DOM: <div class="cloudservice testandtarget">
    WebImporter.DOMUtils.remove(element, ['.cloudservice']);

    // Remove diagnostics container
    // Found in DOM: <div class="sling-diagnostics--container">
    WebImporter.DOMUtils.remove(element, ['.sling-diagnostics--container']);

    // Remove tracking pixels and iframes (analytics, ads)
    // Found in DOM: <img src="https://t.co/..."> <img src="https://analytics.twitter.com/...">
    // Found in DOM: <img src="https://bat.bing.com/..."> <img src="https://tags.w55c.net/...">
    // Found in DOM: <img class="ywa-10000" src="https://sp.analytics.yahoo.com/...">
    // Found in DOM: <iframe src="https://servedby.flashtalking.com/...">
    // Found in DOM: <div id="batBeacon969231282396">
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'img[src*="t.co/"]',
      'img[src*="analytics.twitter.com"]',
      'img[src*="bat.bing.com"]',
      'img[src*="tags.w55c.net"]',
      'img.ywa-10000',
      '[id^="batBeacon"]',
    ]);
  }
}
