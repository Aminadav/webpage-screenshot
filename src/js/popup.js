var popup = {
  permissions: {
    permissions: ["web" + "Navigation", "web" + "Request", "tabs"],
    origins: ["http://*/*", "https://*/*"]
  },
  ready: function () {
    $('.capture-visible').click(popup.captureVisible);
    $('.capture-all').click(popup.captureAll);
    $('.capture-region').click(popup.captureRegion);
    $('.capture-webcam').click(popup.captureWebcam);
    $('.capture-desktop').click(popup.captureDesktop);
    $('.capture-clipboard').click(popup.captureClipboard);
    $('.edit-content').click(popup.editContent);
  },
  checkPermissions: function (cb) {
    chrome.permissions.contains(popup.permissions, function (contains) {
      if (contains) {
        cb();
      } else {
        popup.requestPermissions(cb);
      }
    });
  },
  requestPermissions: function (cb) {
    chrome.permissions.request(popup.permissions, function (granted) {
      if (granted) {
        cb();
      } else {
        popup.requestPermissionsFailed();
      }
    });
  },
  removePermissions: function () {
    chrome.permissions.remove(popup.permissions);
  },
  requestPermissionsFailed: function () {
    chrome.tabs.create({url:'http://www.webpagescreenshot.info/?t=deny'});
  },
  captureVisible: function () {
    popup.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureVisible'
      });
    });
  },
  captureAll: function () {
    popup.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureAll'
      });
    });
  },
  captureRegion: function () {
    popup.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureRegion'
      });
    });
  },
  captureWebcam: function () {
    popup.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureWebcam'
      });
    });
  },
  captureDesktop: function () {
    popup.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureDesktop'
      });
    });
  },
  captureClipboard: function () {
    popup.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureClipboard'
      });
    });
  },
  editContent: function () {
    popup.checkPermissions(function () {
    popup.sendMessage({
      data: 'editContent'
    });
    });
  },
  sendMessage: function (data) {
    chrome.runtime.sendMessage(data, function(x) {
      console.log('popup_fail', x);
    });
  }
};
$(popup.ready);