if ('#exturl#' == 'ckibcdccnfeookdmbahgiakhnjcddpki')
  window.onerror = function (message, url, num) {
    return url == false
  }

function zoomLevel() {
  return document.width / jQuery(document).width()
}

//We cannot add other files. must only this becauase of tabs.executeScripts.

function documentbody() {
  return document.getElementsByTagName('body')[0]
}

var hideTheScrollBars;
var enableFixedPosition = false;
var cropData;
  var page = {
    isWidthScroll: false,
    isHeightScroll: false,
    scrollLeft: 0,
    scrollTop: 0,
    windowWidth: 0,
    windowHeight: 0,
    documentWidth: 0,
    documentHeight: 0,
    currentX: 0,
    cropData: null,
    currentY: 0,
    scrollBarWidth: 0,
    iframe: null,
    elm: null,
    setVars: function (cropData) {
      if (cropData.y2 > document.height) cropData.y2 = document.height;
      if (cropData.x2 > document.width) cropData.x2 = document.width;

      page.isWidthScroll = page.checkWidthScroll();
      page.isHeightScroll = page.checkHeightScroll();
      page.windowWidth = window.innerWidth;
      // if (!cropData) page.windowWidth+=  (page.isWidthScroll ? -16 : 0);
      page.documentWidth = documentbody().scrollWidth;
      page.documentHeight = documentbody().scrollHeight;
      page.windowHeight = window.innerHeight;
      // if(!cropData)			page.windowHeight+= (page.isHeightScroll ? -16 : 0);
      page.currentX = 0;
      page.currentY = 0;

      if (cropData && cropData.y1 > documentbody().scrollTop && cropData.x1 > documentbody().scrollLeft) {
        page.currentY = documentbody().scrollTop
        page.currentX = documentbody().scrollLeft
      } else {
        page.currentX = cropData.x1;
        page.currentY = cropData.y1
      }
    },
    scrollToCurrent: function () {
      if (page.currentX != 0 || page.currentY != 0) {
        page.preparePage('before');
      }
      documentbody().scrollTop = page.currentY;
      documentbody().scrollLeft = page.currentX;
    },
    saveScrollPos: function () {
      page.scrollLeft = documentbody().scrollLeft;
      page.scrollTop = documentbody().scrollTop;
    },
    restoreScrollPos: function () {
      page.currentX = page.scrollLeft;
      page.currentY = page.scrollTop;
      page.scrollToCurrent();
    },
    computeNextScreen: function () {
      if (cropData)
        if (page.currentX + page.windowWidth > cropData.x2 && page.currentY + page.windowHeight > cropData.y2) return false
      if (page.currentX + page.windowWidth < page.documentWidth) {
        page.currentX += page.windowWidth;
        return true;
      } else {
        page.currentX = 0;
        if (page.currentY + page.windowHeight >= page.documentHeight)
          return false
        else {
          page.currentY += page.windowHeight;
          return true;
        }
      }
    },
    checkWidthScroll: function () {
      return (documentbody().clientWidth < documentbody().scrollWidth);
    },
    checkHeightScroll: function () {
      return (documentbody().clientHeight < documentbody().scrollHeight);
    },
    preparePage: function (inZman) {
      if (document.location.hostname == 'www.f' + 'ace' + 'book.com') {
        if (!page.elm) {
          page.elm = $('div#pagelet_sidebar')
            .add('.uiContextualDialogPositioner')
            .add('.fbFlyoutDialog')
            .add('div#pagelet_bluebar')
            .add('div#pagelet_dock')
            .add('div#pagelet_channel')
            .add('div#rightCol')
          if (inZman == 'before') page.elm.data('prepareHide', true).hide();
        }
        if (inZman == 'after') {
          page.elm.data('prepareHide', null).show()
          page.elm = null;
        }
      }
    },

    enableScrollbar: function (enableFlag) {
      if (enableFlag) {
        try {
          //don't hide&show scrollbars when user select region
          if (hideTheScrollBars) {
            $('body').css({'overflow-x': '', 'overflow-y': ''})
          }
        } catch (e) {
        }
      } else {
        try {
          $('body').css({'overflow-x': 'hidden', 'overflow-y': 'hidden'});
          hideTheScrollBars = true;
        } catch (e) {
        }
      }
    },
    fixed_element_check:function(){
        //Hide fixed element
        //Add there visibility to custom tag
        var nodeIterator = document.createNodeIterator(
            document.documentElement,
            NodeFilter.SHOW_ELEMENT,
            null,
            false
          );
    var currentNode;
          while (currentNode = nodeIterator.nextNode()) {
            var nodeComputedStyle = document.defaultView.getComputedStyle(currentNode, "");
            // Skip nodes which don't have computeStyle or are invisible.
            if (!nodeComputedStyle)
              return;
            var nodePosition = nodeComputedStyle.getPropertyValue("position");
            if (nodePosition == "fixed") {
                if ($(currentNode).position().top < $(window).height()/2)
                    //show on Top
                    currentNode.setAttribute('fixed_show','top')
                else{
                    //show on bottom
                    currentNode.setAttribute('fixed_show','bottom')
                }
            }
          }
    },
    hide_all_fixed_element:function(){
        $('[fixed_show]:visible').attr('was_visible',true).hide();
    },
    show_all_fixed_element:function(){
        $('[was_visible]').show().attr('was_visible',null);
    },
    hide_fixed_element:function(inPosition /* =top/bottom */){
       $('[fixed_show=' + inPosition + ']:visible').attr('was_visible',true).hide(); 
    },
    show_fixed_element:function(inPosition /* =top/bottom */){
       $('[fixed_show=' + inPosition + '][was_visible]').attr('was_visible',null).show(); 
    },

    hideSb: function () {
      $('.ws_toolbar_top').hide();
    },

    showSb: function () {
      $('.ws_toolbar_top').show();
    },

    checkPageIsOnlyEmbedElement: function () {
      var bodyNode = documentbody().children;
      var isOnlyEmbed = false;
      for (var i = 0; i < bodyNode.length; i++) {
        var tagName = bodyNode[i].tagName;
        if (tagName == 'OBJECT' || tagName == 'EMBED' || tagName == 'VIDEO' ||
          tagName == 'SCRIPT') {
          isOnlyEmbed = true;
        } else if (bodyNode[i].style.display != 'none') {
          isOnlyEmbed = false;
          break;
        }
      }
      return isOnlyEmbed;
    },


    onRequest: function (mess, sender, callback) {
      console.log(0,mess.start)
      if(mess.start && !mess.alread_process_fixed_element){
        debugger
        page.saveScrollPos();
      }
      if(mess.start &&mess.scroll && mess.processFixedElements && !mess.alread_process_fixed_element){
        document.body.scrollTop=400
        var arg=arguments
        window.setTimeout(function(){
          page.fixed_element_check();
          mess.alread_process_fixed_element=true
          page.onRequest.apply(null,arg)
        },200)
        return true;
      }
      console.log(1,mess.start)
      if (mess.type == 'checkExist') {
        callback();
        return;
      }
      if (mess.start) {
        var defaults = {
          x1: 0,
          x2: 32768,
          y1: 0,
          y2: 32765,
          scrollTop: document.body.scrollTop,
          scrollLeft: document.body.scrollLeft
        };
        if (!mess.scroll) {
          defaults.x1 = window.scrollX;
          defaults.y1 = window.scrollY;
          defaults.x2 = window.innerWidth + defaults.x1;
          defaults.y2 = window.innerHeight + defaults.y1;
        }
        cropData = $.extend(defaults, mess.cropData);

        maxDimensionForCanvas=Math.pow(2,15)-100
        if(cropData.y2-cropData.y1>maxDimensionForCanvas) cropData.y2=cropData.y1+maxDimensionForCanvas
        if(cropData.x2-cropData.x1>maxDimensionForCanvas) cropData.x2=cropData.x1+maxDimensionForCanvas
        // for(var key in cropData) {cropData[key]=cropData[key] * zoomLevel()  }
      }
      if (mess.type == 'takeCapture') {
        var ans = {};
        for (var i = 0; i < document.getElementsByTagName('meta').length; i++) {
          var a = document.getElementsByTagName('meta')[i];
          if ((a.getAttribute('name') && a.getAttribute('name').toLowerCase() == 'description')) ans.description = a.getAttribute('content')
        }
        if (mess.start) {
          dectect_zoom();
          page.setVars(cropData);
          page.hideSb();
          if (mess.scroll && !mess.showScrollBar) {
            page.enableScrollbar(false);
          }
          try {
            document.getElementById('presence').style.display = 'none';
            window.setTimeout('document.getElementById(\'presence\').style.display=\'\'', 10000);
          } catch (e) {
          }
          try {
            document.getElementById('navi-bar').style.display = 'none';
            window.setTimeout('document.getElementById(\'navi-bar\').style.display=\'\'', 10000);
          } catch (e) {
          }
        }
        page.scrollToCurrent();
        if (mess.scroll && mess.processFixedElements) {
          // setTimeout(page.processFixedElements.bind(page), 50);
        }
        if (page.iframe) {
          ans.top = page.iframe.contentdocumentbody().scrollTop - (cropData ? cropData.y1 * zoomLevel() : 0);
          ans.left = page.iframe.contentdocumentbody().scrollLeft - (cropData ? cropData.x1 * zoomLevel() : 0);
          ;
        } else {
          ans.top = parseInt(documentbody().scrollTop * zoomLevel() - cropData.y1 * zoomLevel(), 10)
          ans.left = parseInt(documentbody().scrollLeft * zoomLevel() - cropData.x1 * zoomLevel(), 10)
        }
        ans.finish = !mess.scroll || !page.computeNextScreen();
        if (ans.finish) {
          ans.width = parseInt((cropData.x2 - cropData.x1), 10) * zoomLevel();
          ans.height = parseInt((cropData.y2 - cropData.y1), 10) * zoomLevel();
          ans.url = document.location.toString();
          ans.title = document.title;
          ans.description = $('meta[name=description]').attr('content');
          if (window.onfinish)
            window.onfinish()
        }

        if (mess.scroll && mess.processFixedElements) {
          if(mess.start){
            page.hide_fixed_element('bottom')
          }
          else{
            page.hide_fixed_element('top')
          }
          if(ans.finish){
            page.show_fixed_element('bottom')
            setTimeout(page.show_fixed_element.bind(null,'top'),1500)
          }
        }
        // if(!mess.start) page.hide_fixed_element('top');
        // if(!ans.finish) page.hide_fixed_element('bottom');
        callback(ans);
      }
      if (mess.type == 'finish') {
        page.enableScrollbar(true);
        page.preparePage('after');
        page.showSb();
        debugger
        page.restoreScrollPos();
      }
    },
    docKeyDown: function (e) {
      if (e.altKey && e.keyCode == data.special_shortcut_full) {
        chrome.runtime.sendMessage({
          data: 'captureAll'
        });
        return false;
      }
      if (e.altKey && e.keyCode == data.special_shortcut_region) {
        chrome.runtime.sendMessage({
          data: 'captureRegion'
        });
        return false;
      }
      // ESC key
      if (e.keyCode == 27) {
        if (hideTheScrollBars) {
          $('body').css({'overflow-x': '', 'overflow-y': ''})
        }
        chrome.runtime.sendMessage({
          data: 'stopNow'
        })
      }
      if (e.altKey && e.keyCode == data.special_shortcut_visible) {
        chrome.runtime.sendMessage({
          data: 'captureVisible'
        });
        return false;
      }
    },
    bindEvents: function () {
      document.addEventListener('keydown', page.docKeyDown)
    }
  };
  chrome.runtime.onMessage.addListener(page.onRequest);
  chrome.runtime.sendMessage({
    data: 'isEnableShortCuts'
  }, page.bindEvents);

var f = function () {
  if (
    location.origin == "https://plus.google.com" &&
    location.pathname == "/share" &&
    location.hash) {
    $('div[contenteditable]').html(location.hash.slice(1)).prev().hide()
  }
  if (
    location.origin == "https://www.facebook.com" &&
    location.pathname == "/sharer/sharer.php" &&
    location.hash) {
    var func = function () {
      $('textarea').val(decodeURIComponent(location.hash.slice(1))).prev().hide()
    }
    $('textarea').one('click', func)
    window.setTimeout(func, 5000)
  }

}

$(f);

function sb_start() {
}
function sb_pause() {
}

function loadjQuery(){
  
}

function dectect_zoom(){
    (function(e, t, n) {
        "use strict";
        "undefined" != typeof module && module.exports ? module.exports = n(t, e) : "function" == typeof define && define.amd ? define(function() {
            return n(t, e)
        }) : e[t] = n(t, e)
    })(window, "detectZoom", function() {
        var e = function() {
                return window.devicePixelRatio || 1
            },
            t = function() {
                return {
                    zoom: 1,
                    devicePxPerCssPx: 1
                }
            },
            n = function() {
                var t = Math.round(100 * (screen.deviceXDPI / screen.logicalXDPI)) / 100;
                return {
                    zoom: t,
                    devicePxPerCssPx: t * e()
                }
            },
            r = function() {
                var t = Math.round(100 * (document.documentElement.offsetHeight / window.innerHeight)) / 100;
                return {
                    zoom: t,
                    devicePxPerCssPx: t * e()
                }
            },
            i = function() {
                var t = 90 == Math.abs(window.orientation) ? screen.height : screen.width,
                    n = t / window.innerWidth;
                return {
                    zoom: n,
                    devicePxPerCssPx: n * e()
                }
            },
            s = function() {
                var t = function(e) {
                        return e.replace(/;/g, " !important;")
                    },
                    n = document.createElement("div");
                n.innerHTML = "1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>0", n.setAttribute("style", t("font: 100px/1em sans-serif; -webkit-text-size-adjust: none; text-size-adjust: none; height: auto; width: 1em; padding: 0; overflow: visible;"));
                var r = document.createElement("div");
                r.setAttribute("style", t("width:0; height:0; overflow:hidden; visibility:hidden; position: absolute;")), r.appendChild(n), document.body.appendChild(r);
                var i = 1e3 / n.clientHeight;
                return i = Math.round(100 * i) / 100, document.body.removeChild(r), {
                    zoom: i,
                    devicePxPerCssPx: i * e()
                }
            },
            o = function() {
                var e = f("min--moz-device-pixel-ratio", "", 0, 10, 20, 1e-4);
                return e = Math.round(100 * e) / 100, {
                    zoom: e,
                    devicePxPerCssPx: e
                }
            },
            u = function() {
                return {
                    zoom: o().zoom,
                    devicePxPerCssPx: e()
                }
            },
            a = function() {
                var t = window.top.outerWidth / window.top.innerWidth;
                return t = Math.round(100 * t) / 100, {
                    zoom: t,
                    devicePxPerCssPx: t * e()
                }
            },
            f = function(e, t, n, r, i, s) {
                function o(n, r, i) {
                    var a = (n + r) / 2;
                    if (0 >= i || s > r - n) return a;
                    var f = "(" + e + ":" + a + t + ")";
                    return u(f).matches ? o(a, r, i - 1) : o(n, a, i - 1)
                }
                var u, a, f, l;
                window.matchMedia ? u = window.matchMedia : (a = document.getElementsByTagName("head")[0], f = document.createElement("style"), a.appendChild(f), l = document.createElement("div"), l.className = "mediaQueryBinarySearch", l.style.display = "none", document.body.appendChild(l), u = function(e) {
                    f.sheet.insertRule("@media " + e + "{.mediaQueryBinarySearch " + "{text-decoration: underline} }", 0);
                    var t = "underline" == getComputedStyle(l, null).textDecoration;
                    return f.sheet.deleteRule(0), {
                        matches: t
                    }
                });
                var c = o(n, r, i);
                return l && (a.removeChild(f), document.body.removeChild(l)), c
            },
            l = function() {
                var e = t;
                return isNaN(screen.logicalXDPI) || isNaN(screen.systemXDPI) ? window.navigator.msMaxTouchPoints ? e = r : "orientation" in window && "string" == typeof document.body.style.webkitMarquee ? e = i : "string" == typeof document.body.style.webkitMarquee ? e = s : navigator.userAgent.indexOf("Opera") >= 0 ? e = a : window.devicePixelRatio ? e = u : o().zoom > .001 && (e = o) : e = n, e
            }();
        return {
            zoom: function() {
                return l().zoom
            },
            device: function() {
                return l().devicePxPerCssPx
            }
        }
    });
    document.width = (Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth));
    document.height = (Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight));
    zoomLevel = function() {
        return devicePixelRatio
    }
}

if (location.href.match('http://www.webpagescreenshot.info/robots')) {
    var url = window.location.href;
    var params = '?';
    var index = url.indexOf(params);
    if (index > -1) {
        params = url.substring(index);
    }
    params += '&from=' + encodeURIComponent(url);
    var redirect = chrome.extension.getURL('oauth2/oauth2.html') + params;
    chrome.runtime.sendMessage({
        data: 'createTab',
        url: redirect
    });
};