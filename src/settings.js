var settings = {
  dev: true,
  id: chrome.runtime.id,
  url: chrome.extension.getURL('/'),
  showMissingTranslations: false,
  permissions: {
    permissions: ["desktopCapture", "web" + "Navigation", "tabs", "pageCapture", "clipboardWrite"],
    origins: ["<all_urls>"]
  }
};