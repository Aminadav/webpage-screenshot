var screenshot = {

  init: function () {

  },

  captureVisible: function (data) {
    screenshot.callback = data.callback;
    screenshot.runCallback = data.runCallback;
    screenshot.keepIt = data.keepIt;
    screenshot.cropData = data.cropData;
    screenshot.startWithoutScroll();
  },

  captureAll: function (data) {
    screenshot.callback = data.callback;
    screenshot.runCallback = data.runCallback;
    screenshot.keepIt = data.keepIt;
    screenshot.cropData = data.cropData;
    screenshot.startWithScroll();
  },

  captureDesktop:function(){
    chrome.tabs.create( {url:chrome.extension.getURL('/editor.html#capture')})
  },

  captureRegion:function(){
    debugger;
    screenshot.tryGetUrl(function () {
      var code=$.ajax({async:false,url: chrome.extension.getURL('libs/jquery.js')}).responseText +';'
      code+=$.ajax({async:false,url: chrome.extension.getURL('libs/cropper.js')}).responseText  +';'
      code+=$.ajax({async:false,url: chrome.extension.getURL('js/pluginsBuiltIn.js')}).responseText  +';'
      code+=$.ajax({async:false,url: chrome.extension.getURL('js/plugin.js')}).responseText  +';'
      code+=';load_cropper_without_selection();'
      chrome.tabs.executeScript(screenshot.thisTabId,{code:code})
      })
    }
  ,
  editContent: function () {
    screenshot.tryGetUrl(function () {
      chrome.tabs.executeScript(screenshot.thisTabId, {allFrames: true, code: 'document.designMode="on"'}, function () {
        alert('Now you can edit this page');
      });
    });
  },

  callback: null,
  runCallback: false,
  keepIt: false,
  cropData: null,

  executeOnPermission_array: [],
  webcam: null,
  apppick: null,
  screenShotParams: null,
  isWithScroll: false, isWithoutScroll: false,
  screens: [],
  lastImg: '',
  thisTabId: '',
  thisTabTitle: '',
  url: '',
  title: '',
  canvas: '',
  canvasToDataURL: '',
  tryGetUrl: function (callback) {
    // var x;
    screenshot.description = '';

    // screenshot.thisTabId=0; screenshot.thisTabTitle='First Time Use'; screenshot.url='http://www.firsttimeuse.com';screenshot.title='first time title';
    // try{
    // x=setTimeout(function() {callback(screenshot.url)},200);
    // chrome.permissions.contains({permissions:['tabs']},function(a){if(a){
    chrome.tabs.query({active: true, currentWindow: true}, function (w) {
      w = w[0]
      screenshot.thisTabId = w.id;
      screenshot.thisTabTitle = w.title;
      screenshot.url = w.url;
      screenshot.title = w.title;
      screenshot.thisWindowId = w.windowId
      // clearTimeout(x);
      //
      callback(screenshot.url);
    });
    // }})
    // }
    // catch(e){}
  },
  load: function (callback) {
    screenshot.tryGetUrl(function () {
      var realCallback = callback;
      screenshot.screens = [];
      screenshot.description = '';
      api.callPopup({type: 'working'});
      callback = function () {
        window.setTimeout(realCallback, (parseInt(localStorage['delay'], 10) || 0) * 1000)
      }
      if (!localStorage['captureCount']) localStorage['captureCount'] = 0;
      callback();
    })
  },


  startWithoutScroll: function (e) {
    localStorage['captureWithoutScroll']++;
    screenshot.isWithoutScroll = true;
    screenshot.isWithScroll = false;
    screenshot.load(screenshot.startWithoutScroll_continue);
  },
  startWithoutScroll_continue: function () {
    screenshot.addScreen(true);
  },
  startWithScroll: function () {
    localStorage['captureWithScroll']++;
    screenshot.isWithScroll = true;
    screenshot.isWithoutScroll = false;
    debugger
    screenshot.load(screenshot.startWithScroll_continue);

  },
  startWithScroll_continue: function () {
    screenshot.addScreen();
  },
  webcamfn: function () {
    chrome.tabs.create({url: 'videocap.html'})
  },
  mhtml: function () {
    chrome.permissions.request({
        permissions: ["pageCapture"]
      },
      function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (a) {
          chrome.pageCapture.saveAsMHTML({tabId: a.id}, function (data) {
            screenshot.tryGetUrl(function (filename) {
              filename = screenshot.title;
              filename += '-' + (new Date).getHours().toString().twoDigits() + (new Date).getMinutes().toString().twoDigits() + (new Date).getSeconds().toString().twoDigits()
              filename += '.mhtml';
              // saveAs(	data,  filename);
              // createFile('file',data,function (url) {
              chrome.tabs.create({url: 'saved.html#' + url})
              var evt = document.createEvent("MouseEvents");
              evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, true, false, false, 0, null);
              $('a').attr({
                'href': url = URL.createObjectURL(data),
                'download': filename
              })[0].dispatchEvent(evt)
              // })
            })
          })
        })
      })
  },
  addScreen: function (noScroll) {
    if (api.stop) return;
    chrome.tabs.sendMessage(screenshot.thisTabId, {
      cropData: screenshot.cropData,
      type: 'takeCapture',
      start: true,
      noScroll: noScroll
    }, screenshot.ans);
  },
  ans: function (mess, b, c) {
    if (api.stop) {
      return ;
    }
    if (!mess && chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError);
      return ;
    }
    if (mess && mess.description) {
      screenshot.description = mess.description
    }
    var upCrop = 0, leftCrop = 0;
    if (screenshot.cropData) {
      upCrop = screenshot.cropData.x1
      upCrop = screenshot.cropData.x1
    }
    var cb = function (data) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
      if (api.stop) return ;
      if ((mess.top || parseInt(mess.top) == 0 ))
        screenshot.screens.push({left: parseInt(mess.left), top: parseInt(mess.top), data: data});
      if (mess.finish) {
        screenshot.screenShotParams = mess;
        screenshot.createScreenShot();
      } else {
        chrome.tabs.sendMessage(screenshot.thisTabId, {
          type: 'takeCapture',
          start: false
        }, screenshot.ans);
      }
    };
    var timeoutInterval = 100;
    setTimeout(function () {
      chrome.windows.update(screenshot.thisWindowId, {focused: true}, function () {
        chrome.tabs.update(screenshot.thisTabId, {active: true}, function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          }
          chrome.tabs.captureVisibleTab(null, {
            format: 'png'
          }, cb);
        })
      })
    }, timeoutInterval);
  },
  createScreenShot: function () {
    var mess = screenshot.screenShotParams;
    chrome.tabs.sendMessage(screenshot.thisTabId, {type: 'finish'});
    var img = [];
    var theHeader, theFotter;

    function replacim(inText) {
      return inText.replace(/%U/gi, screenshot.url).replace(/%D/gi, (new Date));
    }
    theHeader = replacim(localStorage['txtHeader']);
    theFotter = replacim(localStorage['txtFotter']);


    screenshot.canvas = document.createElement('canvas');
    if (screenshot.runCallback) {
      //No header on Selection bar images
      theHeader = '';
      theFotter = '';
    }
    else {
      //Normal from popup to editor
      // loadEditor();
      // editorDocument=editor.window.document;
    }

    if (!screenshot.url) url = mess.url;

    var offsetTop = 0;

    var firstTime = true;
    var i = 0;
    loadImage = function (i) {
      if (api.stop) return;
      ctx = screenshot.canvas.getContext('2d');
      img[i] = $('<img tag=' + i + '/>');
      img[i].load(function () {
        var i;
        i = parseInt($(this).attr('tag'));
        if (firstTime) {
          screenshot.canvas.width = mess.width || img[i][0].width;
          screenshot.canvas.height = mess.height || img[i][0].height;
          firstTime = false;
          if (theHeader) {
            screenshot.canvas.height += 20;
            offsetTop = 20;
          }
          if (theFotter) screenshot.canvas.height += 20;
        }
        i = parseInt($(this).attr('tag'));
        //img[i][0].width=200;
        //
        theTop = screenshot.screens[i].top + offsetTop
        ctx.drawImage(img[i][0], screenshot.screens[i].left, theTop);
        screenshot.screens[i].data = null
        // screenshot.screens=null
        if (!screenshot.runCallback && false) {
          alert('what is this?')
          //no editor on SelectionBar
          editor.reloadCanvas();
        }
        img[i][0].src = '';
        img[i].off('load')
        img[i][0] = null;
        img[i].remove()
        img[i] = null

        /////////////////////////////
        // םיצבקה לכ תא ונמייס //
        /////////////////////////////
        console.log(i, screenshot.screens.length - 1)
        if (i == screenshot.screens.length - 1) {
          ctx.font = 'arial 20px';
          if (theFotter) {
            ctx.textBaseline = 'bottom';
            ctx.fillText(theFotter, 10, screenshot.canvas.height, screenshot.canvas.width - 20);
          }
          if (theHeader) {
            ctx.textBaseline = 'up';
            ctx.fillText(theHeader, 10, 10, screenshot.canvas.width - 20);
          }
          if (screenshot.resizeBack) {
            chrome.windows.getCurrent(function (wnd) {
              chrome.windows.update(wnd.id, {
                width: screenshot.currentWidth,
                height: screenshot.currentHeight
              });
            });
          }
          ctx = null

          if (screenshot.runCallback) {
            //Last One, run callback
            console.log('screenshot.js, cb, try to run callback from cb function');
            // chrome.tabs.create('editor.html#last')

            screenshot.callback(screenshot.canvas.toDataURL())

            screenshot.callback = null
            if (!screenshot.keepIt) {
              delete screenshot.callback
              screenshot.canvas.width = screenshot.canvas.height = 1
              screenshot.callback = null
              screenshot.canvas.remove()
              screenshot.canvas = null
              delete screenshot.canvas
            }

            //TODO: Remove Canvas
          }
          else {

            //*Fix for long pages. only when editor live.
            //
            //Copied to editor.html


            chrome.tabs.create({url: chrome.extension.getURL('editor.html') + '#last'});


            delete screenshot.callback;
            // var imgFix=editorDocument.getElementById('imgFixForLong')
            // imgFix.setAttribute('work',screenshot.canvas.height);
            // // if (screenshot.canvas.height>32765){
            // imgFix.src= screenshot.canvas.toDataURL();
            // imgFix.setAttribute('width',screenshot.canvas.width)
            // imgFix.setAttribute('height',screenshot.canvas.height)


            editorDocument = null;
            editor = null
            imgFix = null;
          }
          return;
        }
        if (api.stop) return
        loadImage(++i);
      });
      try {
        img[i].attr('src', screenshot.screens[i].data);
        delete screenshot.screens[i].data;
      } catch (e) {
      }
      //$(document.body).append('Image:' + i + ':<br/><img width=200px src=' + screens[i].data + ' /><hr>');
    }
    if (api.stop) return
    loadImage(0);
  },
  sbPause: function () {
    localStorage['sb_enable'] = 'no'
    executeCodeOnAllTabs('sb_pause()')
  },
  sbStart: function () {
    localStorage['sb_enable'] = 'yes'
    executeCodeOnAllTabs('sb_start()')
  },
  sbPauseOnUrl: function (url) {
    disabledURLs = localStorage['sb_disableURLs'] || '{}'
    disabledURLs = JSON.parse(disabledURLs);
    disabledURLs[url] = 'disabled'
    localStorage['sb_disableURLs'] = JSON.stringify(disabledURLs);
    executeCodeOnAllTabs('var fdsrkldsf=null;')
  },
  sbStartOnUrl: function (url) {
    disabledURLs = localStorage['sb_disableURLs'] || '{}'
    disabledURLs = JSON.parse(disabledURLs);
    delete disabledURLs[url]
    localStorage['sb_disableURLs'] = JSON.stringify(disabledURLs);
    executeCodeOnAllTabs('var fdsrkldsf=null;')
  }


};