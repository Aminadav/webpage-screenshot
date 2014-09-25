var api = {
  stop: false,
  init: function () {
    screenshot.init();
    api.listenMessages();
  },
  listenMessages: function () {
    chrome.runtime.onMessage.addListener(function (data, sender, callback) {
      api.stop = false;
      switch (data.data) {
        case 'captureVisible':
          screenshot.captureVisible();
          break;
        case 'captureAll':
          screenshot.captureAll();
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
        default:
          console.log(data);
          throw "Invalid message";
      }
    });
  }
};
api.init();