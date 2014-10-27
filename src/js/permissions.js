var premissions = {
  checkPermissions: function (permissions,cb) {
    // Optional paramets permissions to check
    if(!cb) {cb=permissions; permissions=settings.permissions}
    chrome.permissions.contains(permissions, function (contains) {
      if (contains) {
        cb();
      } else {
        premissions.requestPermissions(permissions,cb);
      }
    });
  },
  requestPermissions: function (permissions,cb) {
    // Optional paramets permissions to request
    if(!cb) {cb=permissions; permissions=settings.permissions}
    chrome.permissions.request(permissions, function (granted) {
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