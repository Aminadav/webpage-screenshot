var popup = {
  ready: function () {
    $('.capture-visible').click(popup.captureVisible);
    $('.capture-all').click(popup.captureAll);
    $('.capture-region').click(popup.captureRegion);
    $('.capture-webcam').click(popup.captureWebcam);
    $('.capture-desktop').click(popup.captureDesktop);
    $('.capture-clipboard').click(popup.captureClipboard);
    $('.edit-content').click(popup.editContent);
    $('#working').click(function () {
      $(this).fadeOut();
    });
    $('.ver').text(extension.version);
    popup.checkSupport();
    
    if(is=='sb'){
      popup.showSelectionBarStatus()
      popup.bindSelectionBar()
    }
  },

  showSelectionBarStatus:function(){
    $('.show_toolbar').attr('checked',localStorage['show_toolbar']=='yes')
    $('.show_toolbar_on_this_domain')[localStorage['show_toolbar']=='yes' ? 'show' : 'hide']()
    $('.show_selectionbar').attr('checked',localStorage['show_selectionbar']=='yes')
    $('.show_selectionbar_on_this_domain')[localStorage['show_selectionbar']=='yes' ? 'show' : 'hide']()
    $('#sb_opacity').val(localStorage.sb_opacity)
    $('#button_size').val(localStorage.button_size)
    chrome.tabs.getSelected(function(t) {
      var url=t.url;
      var thisDomain = cleanUp(url)
      var toolbar_disabledURLs = localStorage['toolbar_disableURLs'] || '{}'
      var toolbar_disabledURLs = JSON.parse(toolbar_disabledURLs) || {};
      var selectionbar_disabledURLs = localStorage['selectionbar_disableURLs'] || '{}'
      var selectionbar_disabledURLs = JSON.parse(selectionbar_disabledURLs) || {};

      $('.show_toolbar_on_this_domain').attr('checked', toolbar_disabledURLs[thisDomain] != 'disabled')
      $('.show_selectionbar_on_this_domain').attr('checked', selectionbar_disabledURLs[thisDomain] != 'disabled')
    });
  },

  bindSelectionBar: function(){
    $('.show_toolbar').on('change',function(){
      localStorage['show_toolbar']=this.checked ? 'yes' : 'no';
      popup.notifyTabsForStorageUpdate();
      popup.showSelectionBarStatus();
    })
    $('.show_selectionbar').on('change',function(){
      localStorage['show_selectionbar']=this.checked ? 'yes' : 'no';
      popup.notifyTabsForStorageUpdate();
      popup.showSelectionBarStatus();
    })
    $('#sb_opacity').on('change',function (){
      localStorage['sb_opacity']=$(this).val();
      popup.notifyTabsForStorageUpdate();
    });
    $('#button_size').on('change',function (){
      localStorage['button_size']=$(this).val();
      popup.notifyTabsForStorageUpdate();
    });
    $('input.show_toolbar_on_this_domain').on('change',function() {
      var toolbar_disabledURLs = JSON.parse(localStorage['toolbar_disableURLs'] || '{}') || {};
      var enabled = this.checked;
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        var url = cleanUp(tabs[0].url);
        if (enabled) {
          delete toolbar_disabledURLs[url];
        } else {
          toolbar_disabledURLs[url] = 'disabled';
        }
        localStorage['toolbar_disableURLs'] = JSON.stringify(toolbar_disabledURLs);
        popup.notifyTabsForStorageUpdate();
      });
    });
    $('input.show_selectionbar_on_this_domain').on('change', function() {
      var disabledURLs = JSON.parse(localStorage['selectionbar_disableURLs'] || '{}') || {};
      var enabled = this.checked;
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        var url = cleanUp(tabs[0].url);
        if (enabled) {
          delete disabledURLs[url];
        } else {
          disabledURLs[url] = 'disabled';
        }
        localStorage['selectionbar_disableURLs'] = JSON.stringify(disabledURLs);
        popup.notifyTabsForStorageUpdate();
      });
    });
  },

  notifyTabsForStorageUpdate: function () {
    chrome.extension.getBackgroundPage().codeinjector.executeCodeOnAllTabs('extStorageUpdate()');
  },

  checkSupport: function () {
    chrome.tabs.getSelected(function(t) {
      var url=t.url;
      if (url.indexOf('chrome://') >= 0 || url.indexOf('chrome-extension:') >= 0 || url.indexOf('https://chrome.google.com') >= 0) {
        popup.disableScrollSupport();
      }
      if (url.indexOf('file:') == 0) {
        var scriptNotLoaded = setTimeout(popup.disableScrollSupport, 500);
        chrome.runtime.sendMessage(t.id, {
            type: 'checkExist'
          },
          function() {
            clearTimeout(scriptNotLoaded)
          }
        );
      }
    });
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
    switch (data.type) {
      case 'working':
        $('#working').fadeIn();
        break;
      default:
        console.warn('Invalid message', data);
    }
  },
  captureVisible: function () {
    premissions.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureVisible'
      });
    });
  },
  captureAll: function () {
    premissions.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureAll'
      });
    });
  },
  captureRegion: function () {
    premissions.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureRegion'
      });
    });
  },
  captureWebcam: function () {
    premissions.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureWebcam'
      });
    });
  },
  captureDesktop: function () {
    premissions.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureDesktop'
      });
    });
  },
  captureClipboard: function () {
    premissions.checkPermissions(function () {
      popup.sendMessage({
        data: 'captureClipboard'
      });
    });
  },
  editContent: function () {
    premissions.checkPermissions(function () {
      popup.sendMessage({
        data: 'editContent'
      });
    });
  },
  sendMessage: function (data) {
    chrome.runtime.sendMessage(data, function(x) {
      console.warn('popup_fail', x);
    });
  }
};
$(popup.ready);