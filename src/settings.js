var settings = {
  dev: true,
  id: chrome.runtime.id,
  url: chrome.extension.getURL('/'),
  showMissingTranslations: false,
  permissions: {
    permissions: ["web" + "Navigation", "web" + "Request", "tabs", "pageCapture"],
    origins: ["http://*/*", "https://*/*", "<all_urls>"]
  }
};