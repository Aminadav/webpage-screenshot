var codeinjector = {
  cache: null,

  init: function () {
    api.executeIfPermission(function () {
      codeinjector.executeCodeOnAllTabs('init');
    }, function () {
      chrome.permissions.onAdded.addListener(function () {
        codeinjector.executeCodeOnAllTabs('init')
      });
    });
    codeinjector.addListeners();
  },

  addListeners: function () {
    chrome.tabs.onUpdated.addListener(function (tid, status, tab) {
      if (status.status == 'complete') {
        api.executeIfPermission(function () {
          codeinjector.executeOnTab(tid, tab)
        });
      }
    });
  },

  executeCodeOnAllTabs: function (mission) {
    mission = mission || 'init';
    var code;
    if (mission == 'init') {
      code = codeinjector.getCode();
    } else {
      code = mission;
    }
    chrome.tabs.query({}, function (t) {
      for (var ti = 0; ti < t.length; ti++) {
        if (t[ti].url.match(/^chrom.*:\/\//)) {
          continue
        }
        chrome.tabs.executeScript(t[ti].id, {code: code});
      }
    })
  },

  executeOnTab: function (tid, tab, force, cb) {
    if (tab.url.match(/^chrom.*:\/\//)) {
      setTimeout(cb, 0);	
      return;
    }
    var code = codeinjector.getCode();
    if (tab.url.match('www.openscreenshot.com')) {
      code += $.ajax({url: 'js/inmysite.js', async: false}).responseText + ';'
    }
    var opts = {code: code};
    // if (force) {
      opts.runAt = 'document_start';
    // }
    chrome.tabs.executeScript(tid, opts, cb);
  },

  getCode: function () {
    if (codeinjector.cache && !settings.dev) {
      return codeinjector.cache;
    }
    var js = [
      "libs/jquery.js",
      "js/common.js",
      "libs/cropper.js",
      "js/pluginsBuiltIn.js",
      "js/pluginLib.js",
      "js/plugin.js",
      "js/intab.js",
      "js/intabg.js"
    ];

    var code = '';
    code += 'var settings = ' + JSON.stringify(settings) + ';';
    code += 'var data = ' + JSON.stringify({
      version: extension.version,
      special_shortcut_full: localStorage['shortcut_full'],
      special_shortcut_visible: localStorage['shortcut_visible'],
      special_shortcut_region: localStorage['shortcut_region']
    }) + ';';

    if (settings.dev) {
      console.time("getCode");
    }
    for (var js_i = 0; js_i < js.length; js_i++) {
      if (settings.dev) {
        code += 'console.time("' + js[js_i] + '");'
      }
      // @todo: merge files async, should be faster
      code += $.ajax({
        url: js[js_i],
        async: false
      }).responseText + '\r\n;// ff:' + js[js_i] + '\r\n';
      if (settings.dev) {
        code += 'console.timeEnd("' + js[js_i] + '");'
      }
    }
    if (settings.dev) {
      console.timeEnd("getCode");
    }
    code = 'if(!window.alreadyRun) {window.alreadyRun=true;' + code + '}';
    codeinjector.cache = code;
    return code
  }
};