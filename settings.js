var settings = {
  dev: true,
  id: chrome.runtime.id,
  url: chrome.extension && chrome.extension.getURL('/') || '',
  showMissingTranslations: false,
};