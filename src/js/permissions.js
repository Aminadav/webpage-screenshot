var premissions = {
  checkPermissions: function (cb) {
    chrome.permissions.contains(settings.permissions, function (contains) {
      if (contains) {
        cb();
      } else {
        premissions.requestPermissions(cb);
      }
    });
  },
  requestPermissions: function (cb) {
    chrome.permissions.request(settings.permissions, function (granted) {
      if (granted) {
        cb();
      } else {
        premissions.requestPermissionsFailed();
      }
    });
  },
  removePermissions: function () {
    chrome.permissions.remove(settings.permissions);
  },
  requestPermissionsFailed: function () {
    chrome.tabs.create({url:'http://www.webpagescreenshot.info/?t=deny'});
  }
};