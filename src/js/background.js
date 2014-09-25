var api = {
  stop: false,
  init: function () {
    screenshot.init();
    codeinjector.init();
    api.listenMessages();
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
          screenshot.captureVisible({
            callback: callback,
            runCallback: data.runCallback,
            keepIt: data.keepIt,
            cropData: data.cropData
          });
          break;
        case 'captureAll':
          screenshot.captureAll({
            callback: callback,
            runCallback: data.runCallback,
            keepIt: data.keepIt,
            cropData: data.cropData
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