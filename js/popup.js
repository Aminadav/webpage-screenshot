var popup = {
  ready: function () {
    $('.capture-visible').click(popup.captureVisible);
    $('.capture-all').click(popup.captureAll);
    $('.capture-region').click(popup.captureRegion);
    $('.capture-webcam').click(popup.captureWebcam);
    $('.capture-desktop').click(popup.captureDesktop);
    $('.capture-clipboard').click(popup.captureClipboard);
    $('.edit-content').click(popup.editContent);
    $('.settings').click(() => {chrome.runtime.openOptionsPage();});
    $('#working, #message').click(function () {
      $(this).fadeOut();
    });
    $('.ver').text(extension.version);
    popup.checkSupport();
        
  },

  notifyTabsForStorageUpdate: function () {
    chrome.extension.getBackgroundPage().codeinjector.executeCodeOnAllTabs('extStorageUpdate()');
  },

  checkSupport: function () {
    chrome.tabs.query({active: true,currentWindow:true},
        function(t) {
          t=t[0]
          var url=t.url;
          if (url.indexOf('chrome://') >= 0 || url.indexOf('chrome-extension:') >= 0 || url.indexOf('https://chrome.google.com') >= 0) {
            popup.disableScrollSupport();
          }
          if (url.indexOf('file:') == 0) {
            var scriptNotLoaded = setTimeout(popup.disableScrollSupport, 500);
            chrome.tabs.sendMessage(t.id, {
                type: 'checkExist'
              },
              function() {
                if (chrome.runtime.lastError) {
                  $('#noall').html('Go to chrome://extensions, and check the box "Allow access to file URLs"').css({cursor:'pointer',color:'blue',textDecoration:'underline'}).click(function(){
                    premissions.checkPermissions({origins:['<all_urls>']},function(a){
                      chrome.tabs.create({url:'chrome://extensions?id=akgpcdalpfphjmfifkmfbpdmgdmeeaeo'})
                    })
                  })
                }
                else{
                  clearTimeout(scriptNotLoaded)
                }
              }
            );
          }
        }
      );
  },

  disableScrollSupport: function () {
    $('.capture-all').hide();
    $('.capture-region').hide();
    $('.edit-content').hide();
    $('#noall').show();
  },

  translationBar: function () {
    var did=',en,';
    chrome.i18n.getAcceptLanguages(function(lang) {
      var ht = '';
      for (var i = 0; i < lang.length; i++) {
        if (did.indexOf(',' + lang[i].substring(0, 2) + ',') >= 0) {
          continue;
        }
        var $e = $('<a lang="' + lang[i] + '" class="btn">' + lang[i] + '</a>');
        $e.on('click', function () {
          var t=this;
          chrome.tabs.create({url:
            'https://docs.google.com/forms/d/1PxQumU94cpqjz_p9mQpNIIdW4WBIL-SRARIkk2I4grA/viewform?entry.893813915&entry.1011219305&entry.510290200=' +
            t.getAttribute('lang')
          });
        });
        $('.window_translate').show().append($e);
      }
    });
  },
  /**
   * Function execution from remote scripts such as background.js
   * @param data
   */
  exec: function (data) {
    $('#working').fadeOut();
    $('#message').fadeOut();
    switch (data.type) {
      case 'working':
        $('#working').fadeIn();
        break;
      case 'message':
        $('#message').fadeIn().find('.message-container').text(data.message);
        break;
      default:
        console.warn('Invalid message', data);
    }
  },
  captureVisible: function () {
      popup.sendMessage({
        data: 'captureVisible'
    });
  },
  captureAll: function () {
      popup.sendMessage({
        data: 'captureAll'
    });
  },
  captureRegion: function () {
      popup.sendMessage({
        data: 'captureRegion'
    });
  },
  captureWebcam: function () {
      popup.sendMessage({
        data: 'captureWebcam'
    });
  },
  captureDesktop: function () {
    chrome.permissions.request({permissions:['desktopCapture']},function () {
      popup.sendMessage({
        data: 'captureDesktop'
      });
    });
  },
  captureClipboard: function () {
      popup.sendMessage({
        data: 'captureClipboard'
    });
  },
  editContent: function () {
      popup.sendMessage({
        data: 'editContent'
    });
  },
  sendMessage: function (data) {
    chrome.runtime.sendMessage(data, function(x) {
      console.warn('popup_fail', x);
    });
  }
};
$(popup.ready);