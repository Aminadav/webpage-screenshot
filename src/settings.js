var settings = {
  dev: true,
  id: chrome.runtime.id,
  url: chrome.extension.getURL('/'),
  showMissingTranslations: false,
  permissions: {
    permissions: ["desktopCapture", "web" + "Navigation", "tabs", "pageCapture", "clipboardWrite"],
    origins: ["<all_urls>"]
  },
  uploady: {
    uploadUrl: 'http://content.dev.uploady.com/v1/api/upload',
    tokenUrl: 'http://dev.uploady.com/oauth2/token',
    apiUrl: 'http://dev.uploady.com/v1/api/',
    myfilesUrl: 'http://dev.uploady.com/#!/myfiles/',
    clientId: 'jxLI4kIB8ZjYZ2lE',
    clientAccessToken: 'jxLI4kIB8ZjYZ2lE-xQfOunT7L3ck445TejocR2TDztPg_OhWBI_622eS'
  }
};