var codeinjector = {
  cache: null,

  init: function () {    
  },

  addListeners: function () {    
  },

  executeOnTab: function (tid, tab, force, cb) {
    if (tab.url.match(/^chrom.*:\/\//)) {
      setTimeout(cb, 0);	
      return;
    }
    var code = codeinjector.getCode();
    var opts = {code: code};
    opts.runAt = 'document_start';
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
    ];

    var code = '';
    code += 'var settings = ' + JSON.stringify(settings) + ';';
    code += 'var data = ' + JSON.stringify({
      version: extension.version,
    }) + ';';

    for (var js_i = 0; js_i < js.length; js_i++) {
     
      code += $.ajax({
        url: js[js_i],
        async: false
      }).responseText + '\r\n;// ff:' + js[js_i] + '\r\n';
    }
    code = 'if(!window.alreadyRun) {window.alreadyRun=true;' + code + '}';
    codeinjector.cache = code;
    return code
  }
};