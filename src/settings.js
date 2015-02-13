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
    uploadUrl: 'https://content.uploady.com/v1/api/upload',
    tokenUrl: 'https://www.uploady.com/oauth2/token',
    authUrl: 'https://www.uploady.com/oauth2/auth',
    apiUrl: 'https://www.uploady.com/v1/api/',
    myfilesUrl: 'https://www.uploady.com/#!/myfiles/',
    clientId: 'apB9TcxUyC~fQFT5',
    clientAccessToken: 'apB9TcxUyC~fQFT5-h_PufPnrF_1BSRv7InYS8EjBfrMxwFfEwALZEkC7'
  }
};