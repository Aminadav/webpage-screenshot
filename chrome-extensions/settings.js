var settings = {
  dev: false,
  id: chrome.runtime.id,
  url: chrome.extension && chrome.extension.getURL('/') || '',
  showMissingTranslations: false,
};