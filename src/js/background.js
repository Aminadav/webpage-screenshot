var api = {
  stop: false,
  init: function () {
    screenshot.init();
    codeinjector.init();
    api.listenMessages();
    api.setDefaultSettings();
  },
  setDefaultSettings: function () {
    var defaults = {
      pngjpg: 'png',
      delay: 0,
      shortcut_full: 90,
      shortcut_visible: 88,
      enableshortcuts: 'yes',
      created: new Date,
      captureWithScroll: 0,
      captureWithoutScroll: 0,
      color: '#FF0000',
      captureCount: 0,
      txtHeader: 'Webpage Screenshot',
      txtFotter: '%U %D'
    };
    for (var i in defaults) {
      if (defaults.hasOwnProperty(i) && !localStorage.hasOwnProperty(i)) {
        localStorage[i] = defaults[i];
      }
    }
  },
  isEnableURL: function (url){
    if (localStorage['sb_enable']!='yes') return false
    url=cleanUp(url);
    if(!url) return false
    var j= JSON.parse(  localStorage['sb_disableURLs'] || '{}' );
    if(j[url]=='disabled') return false;
    return true;
  },
  executeIfPermission: function (callback, fail) {
    chrome.permissions.contains({permissions: ['tabs']}, function (contains) {
      if (contains) {
        callback();
      } else if (fail) {
        fail();
      }
    })
  },
  callPopup: function (data) {
    var views = chrome.extension.getViews({type: "popup"});
    for (var i = 0; i < views.length; i++) {
      views[i].popup.exec(data);
    }
  },
  listenMessages: function () {
    chrome.runtime.onMessage.addListener(function (data, sender, callback) {
      api.stop = false;
      switch (data.data) {
        case 'captureVisible':
          premissions.checkPermissions(function () {
            screenshot.captureVisible({
              callback: callback,
              runCallback: data.runCallback,
              keepIt: data.keepIt,
              cropData: data.cropData
            });
          });
          break;
        case 'captureAll':
          premissions.checkPermissions(function () {
            screenshot.captureAll({
              callback: callback,
              runCallback: data.runCallback,
              keepIt: data.keepIt,
              cropData: data.cropData
            });
          });
          break;
        case 'captureRegion':
          screenshot.captureRegion();
          break;
        case 'captureWebcam':
          screenshot.captureWebcam();
          break;
        case 'captureDesktop':
          screenshot.captureDesktop();
          break;
        case 'captureClipboard':
          screenshot.captureClipboard();
          break;
        case 'editContent':
          screenshot.editContent();
          break;
        case 'stopNow':
          api.stop = true;
          break;
        case 'ana':
          // @todo: analytics tracking
          break;
        case 'isEnableShortCuts':
          if (localStorage['enableshortcuts']=='yes')	{
            callback();
          }
          break;
        default:
          console.warn('Invalid message', data);
      }
    });
  }
};
api.init();