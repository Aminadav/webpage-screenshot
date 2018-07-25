chrome.runtime.onInstalled.addListener(toChecks);
chrome.runtime.onStartup.addListener(toChecks);
function toChecks() {
  if (!localStorage.created) {
    chrome.tabs.create({ url: "https://1ce.org/" });
    localStorage.ver = extension.manifest.version;
    localStorage.created = new Date();
    localStorage.skip28update = true;
    localStorage.skip30update = true;
  }
  if (!localStorage.skip30update) {
    function a() {
      chrome.browserAction.setPopup({ popup: "popup.html" });
      chrome.tabs.create({
        url: "https://1ce.org/1click-screenshot/changelog",
      });
      chrome.browserAction.onClicked.removeListener(a);
      chrome.browserAction.setBadgeText({
        text: "",
      });
      localStorage.skip30update = true;
    }
    chrome.browserAction.setPopup({ popup: "" });
    chrome.browserAction.onClicked.addListener(a);
    chrome.browserAction.setBadgeBackgroundColor({ color: "#f80" });
    chrome.browserAction.setBadgeText({
      text: "new",
    });
  }
  if(!localStorage.getItem('screenshot_unique')){
    localStorage.setItem('screenshot_unique', hex_md5('' + new Date().getTime()) + (Math.floor(Math.random() * 1000000)) );
  }
}
var api = {
  stop: false,
  init: function() {
    api.setDefaultSettings();
    screenshot.init();
    codeinjector.init();
    api.listenMessages();
  },
  setDefaultSettings: function() {
    var defaults = {
      pngjpg: "png",
      delay: 0,
      rnd: Math.random(),
      options:
        hex_md5(new Date().toString()) + hex_md5(Math.random().toString()),
      speed: 400,
      shortcut_full: 90,
      shortcut_visible: 88,
      shortcut_region: 82,
      enableshortcuts: "yes",
      // show_toolbar: 'yes',
      // show_selectionbar: 'yes',
      button_size: 14,
      sb_opacity: 0.7,
      created: new Date(),
      captureWithScroll: 0,
      captureWithoutScroll: 0,
      color: "#FF0000",
      captureCount: 0,
      txtHeader: "", //Screenshot Extension',
      txtFotter: "", //%U %D'
    };
    for (var i in defaults) {
      if (defaults.hasOwnProperty(i) && !localStorage.hasOwnProperty(i)) {
        localStorage[i] = defaults[i];
      }
    }
    chrome.i18n.getAcceptLanguages(function() {
      try {
        localStorage["primaryLanguage"] = arguments[0][0];
      } catch (e) {
        localStorage["primaryLanguage"] = "";
      }
    });
  },
  getUserData :function(callback){
    var unique = localStorage.getItem('screenshot_unique'),
        name = localStorage.getItem('screenshot_name');
    if(!name ){
      var url = localStorage.getItem('customUrl') || 'https://1ce.org';
        url += '/howami';
      $.ajax({
          type: "GET",
          url: url,
          // The key needs to match your method's input parameter (case-sensitive).
          headers: {
            'user-id-unique' : unique
          },
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(data){
            //console.log('data');
            var res = {
              unique : unique
            }
            if(data && data.name){
              localStorage.setItem('screenshot_name', data.name);
              res.name = name;
            }
            else{
              res.name = '';
            }
            callback(res);
          },
          error: function(errMsg) {
              callback({
                unique : unique
              });
          }
        });
      }
      else{
        callback({
                unique : unique,
                name : name
              });
      }
  },
  isEnableURL: function(url) {
    if (localStorage["sb_enable"] != "yes") return false;
    url = cleanUp(url);
    if (!url) return false;
    var j = JSON.parse(localStorage["sb_disableURLs"] || "{}");
    if (j[url] == "disabled") return false;
    return true;
  },
  executeIfPermission: function(callback, fail) {
    chrome.permissions.contains({ permissions: ["tabs"] }, function(contains) {
      if (contains) {
        callback();
      } else if (fail) {
        fail();
      }
    });
  },
  callPopup: function(data) {
    var views = chrome.extension.getViews({ type: "popup" });
    for (var i = 0; i < views.length; i++) {
      views[i].popup.exec(data);
    }
  },
  copyTextToClipboard: function(text) {
    premissions.checkPermissions(
      { permissions: ["clipboardWrite"] },
      function() {
        var copyFrom = $("<textarea/>");
        copyFrom.text(text);
        $("body").append(copyFrom);
        copyFrom.select();
        document.execCommand("copy", true);
        copyFrom.remove();
      }
    );
  },
  listenMessages: function() {
    chrome.runtime.onMessage.addListener(function(data, sender, callback) {
      api.stop = false;
      switch (data.data) {
        case "createTab":
          chrome.tabs.create({ url: data.url });
          break;
        case "captureVisible":
          screenshot.captureVisible(
            $.extend({}, data, {
              callback: callback,
            })
          );
          break;
        case "captureAll":
          screenshot.captureAll(
            $.extend({}, data, {
              callback: callback,
            })
          );
          break;
        case "captureRegion":
          screenshot.captureRegion();
          break;
        case "captureWebcam":
          screenshot.captureWebcam();
          break;
        case "captureDesktop":
          screenshot.captureDesktop();
          break;
        case "captureClipboard":
          screenshot.captureClipboard();
          break;
        case "editContent":
          screenshot.editContent();
          break;
        case "stopNow":
          api.stop = true;
          break;
        case "copyText":
          api.copyTextToClipboard(data.text);
          break;
        case "storageGet":
          callback(localStorage);
          break;
        case "storageSet":
          localStorage[data.key] = data.val;
          break;
        case "upload":
          objectUrlToBlob(data.objectURL, function(blob) {
            data.blob = blob;
            // return uploady.upload(data).then(callback, callback);
          });
          break;
        case "connectUploady":
          // uploady.connectUser().then(callback);
          break;
        case "isEnableShortCuts":
          if (localStorage["enableshortcuts"] == "yes") {
            callback();
          }
          break;
        case "disconnect":
          api.getUserData(function(data){
            localStorage.removeItem('screenshot_name');
            callback();
          });
          break;
        case "getUnique":
          api.getUserData(function(data){
            console.log('data', data)
            callback(data);
          });
          break;
        default:
          console.warn("Invalid message", data);
      }
      return true;
    });
  },
};
api.init();

window.setInterval(function() {
  chrome.runtime.requestUpdateCheck(function() {
    if (arguments[0] == "update_available") chrome.runtime.reload();
  });
}, 1000 * 60);
