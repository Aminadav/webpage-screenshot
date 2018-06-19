var screenshot = {

  init: function () {

  },

  captureVisible: function (data) {
    $.extend(screenshot, {
      callback: null,
      runCallback: false,
      keepIt: false,
      scroll: false,
      cropData: null,
      retries: 0,
      showScrollBar: true,
      disableHeaderAndFooter: false,
      processFixedElements: false
    }, data);
    localStorage['captureWithoutScroll']++;
    screenshot.load(screenshot.addScreen);
  },

  captureAll: function (data) {
    $.extend(screenshot, {
      callback: null,
      runCallback: false,
      keepIt: false,
      scroll: true,
      cropData: null,
      retries: 0,
      showScrollBar: false,
      disableHeaderAndFooter: false,
      processFixedElements: true
    }, data);
    localStorage['captureWithScroll']++;
    screenshot.load(screenshot.addScreen);
  },

  captureDesktop:function(){
    chrome.tabs.create( {url:chrome.extension.getURL('/editor.html#capture')})
  },

  captureRegion:function() {
    console.log('captureRegion');
    screenshot.tryGetUrl(function () {
      console.log('tryGetUrl', screenshot.thisTabId);
      codeinjector.executeOnTab( screenshot.thisTabId,
        screenshot.thisTab,
        true,
        function(){
          chrome.tabs.executeScript(screenshot.thisTabId, {code:'load_cropper_without_selection()'})
        })
      
    });
  },

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
  scroll: false,
  cropData: null,
  retries: 0,
  showScrollBar: false,
  disableHeaderAndFooter: false,
  processFixedElements: false,

  executeOnPermission_array: [],
  webcam: null,
  apppick: null,
  screenShotParams: null,
  screens: [],
  lastImg: '',
  thisTab: null,
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
      w = w[0];
      screenshot.thisTab = w;
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
      };
      if (!localStorage['captureCount']) localStorage['captureCount'] = 0;
      callback();
    })
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
          a=a[0]
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
  addScreen: function (data) {
    if (api.stop) return;
    screenshot.retries++;
    chrome.tabs.sendMessage(screenshot.thisTabId, $.extend({
      cropData: screenshot.cropData,
      type: 'takeCapture',
      start: true,
      scroll: screenshot.scroll,
      showScrollBar: screenshot.showScrollBar,
      processFixedElements: screenshot.processFixedElements
    }, data), screenshot.ans);
  },
  ans: function (mess) {
    if (api.stop) {
      return ;
    }
    if (!mess && chrome.runtime.lastError) {
      if (screenshot.retries > 1 && screenshot.scroll) {
        api.callPopup({type: 'message', message: 'Sorry, we can not take a full screenshot of this webpage. This might be because it is not fully loaded. Please report this issue.'});
        return ;
      } else if (screenshot.retries > 1) {
        mess = {left:0,top:0,finish:true};
      } else {
        codeinjector.executeOnTab(
          screenshot.thisTabId,
          screenshot.thisTab,
          true,
          screenshot.addScreen
        );
        return ;
      }
    }
    if(mess.top==null) {
      mess.top=0;
      mess.left=0
    }
    if (mess && mess.description) {
      screenshot.description = mess.description
    }
    console.log('cropData')
    console.log(screenshot.cropData)
    console.log(mess)
    var upCrop = 0
    var leftCrop = 0;
    if (screenshot.cropData) {
      upCrop = screenshot.cropData.x1
      upCrop = screenshot.cropData.x1
    }
    var cb = function (data) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
      if (api.stop) return ;
      if ((mess.top || parseInt(mess.top) == 0 )) {
        screenshot.screens.push({left: parseInt(mess.left), top: parseInt(mess.top), data: data});
      }
      if (mess.finish) {
        screenshot.screenShotParams = mess;
        screenshot.createScreenShot();
      } else {
        screenshot.addScreen({
          start: false
        });
      }
    };
    var timeoutInterval = localStorage.speed;
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
    theHeader = '' //|| replacim(localStorage['txtHeader']);
    theFotter = '' //|| replacim(localStorage['txtFotter']);


    screenshot.canvas = document.createElement('canvas');
    if (screenshot.runCallback || screenshot.disableHeaderAndFooter) {
      //No header on Selection bar images
      theHeader = '';
      theFotter = '';
    } else {
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
        img[i][0].src = '';
        img[i].off('load')
        img[i][0] = null;
        img[i].remove()
        img[i] = null

        /////////////////////////////
        // םיצבקה לכ תא ונמייס //
        /////////////////////////////
        if (i == screenshot.screens.length - 1) {
          if (screenshot.runCallback) {
            screenshot.callback(screenshot.canvas.toDataURL());
            screenshot.callback = null;
            if (!screenshot.keepIt) {
              delete screenshot.callback
              screenshot.canvas.width = screenshot.canvas.height = 1
              screenshot.callback = null
              screenshot.canvas.remove()
              screenshot.canvas = null
              delete screenshot.canvas
            }

          } else {

            chrome.tabs.create({url: chrome.extension.getURL('editor.html') + '#last'});

            delete screenshot.callback;

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
};