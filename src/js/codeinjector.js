var codeinjector = {
  cache: null,
  lastRunOnTab: {},

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
          codeinjector.executeOnTabUpdate(tid, status, tab)
        });
      }
    });
  },

  executeCodeOnTabId: function (url, tid, code, cb) {
    //if (codeinjector.lastRunOnTab[tid] &&
    //  (new Date()) - codeinjector.lastRunOnTab[tid].time < 1000 &&
    //  codeinjector.lastRunOnTab[tid].url == cleanHash(url)
    //) {
    //  return;
    //}
    codeinjector.lastRunOnTab[tid] = {'time': new Date(), 'url': cleanHash(url)};
    chrome.tabs.executeScript(tid, {code: code}, cb);
    function cleanHash(url) {
      return url.replace(/(.*)#.*/, '$1')
    }
  },

  executeCodeOnAllTabs: function (mission, callback) {
    mission = mission || '';
    if (!callback) {
      callback = function () {
      };
    }
    var realCallback = callback;
    callback = function () {
      realCallback()
    };
    if (!mission) {
      mission = 'init';
    }
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
        //This is twice copy it.
        if (t[ti].url.match('chrome' + '-' + 'dev' + 'tools://')) localStorage['isd'] = new Date();
        codeinjector.executeCodeOnTabId(t[ti].url, t[ti].id, code)
      }
    })
  },

  executeOnTabUpdate: function (tid, status, tab) {
    if (tab.url.match(/^chrom.*:\/\//)) {
      return;
    }
    var code = codeinjector.getCode();
    if (tab.url.match('www.webpagescreenshot.info')) {
      code += $.ajax({url: 'js/inmysite.js', async: false}).responseText + ';'
    }
    codeinjector.executeCodeOnTabId(tab.url, tid, code);
  },

  getCode: function () {
    if (codeinjector.cache && !settings.dev) {
      return codeinjector.cache;
    }
    var js = [
      "libs/jquery.js", "js/common.js", "js/intab.js"
    ];
    if (isSb) {
      js.push(
        "libs/Cropper.js"
        ,"libs/Rangy.js"
        ,"js/sb.js"
        ,"js/pluginLib.js"
        ,"js/plugin.js"
        ,"js/pluginsBuiltIn.js"
        ,"js/plugins_sb.js"
      );
    }

    var code = '';
    code += 'var settings = ' + JSON.stringify(settings) + ';';
    code += 'var data = ' + JSON.stringify({
      version: extension.version,
      special_shortcut_full: localStorage['shortcut_full'],
      special_shortcut_visible: localStorage['shortcut_visible']
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