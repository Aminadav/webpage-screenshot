var settings = {
  dev: true,
  id: chrome.runtime.id,
  url: chrome.extension.getURL('/').match('[a-zA-z]{10,60}')
};