//chrome-extension://moleilmbcjipiocmiedbmboflnaaanfe/SelectionBar/testSelectionBar.html
var extStorage = {};

function extStorageGet(k) {
    return extStorage[k]
}

function extStorageSet(k, v) {
    extStorage[k] = v
    if (!chrome.extension) return
    chrome.runtime.sendMessage({
        data: 'storageSet',
        key: k,
        val: v
    })
}

function extStorageUpdate() {
    if (!chrome.extension) return
    chrome.runtime.sendMessage({
        data: 'storageGet'
    }, function(data) {
        extStorage = data
    })
}
extStorageUpdate()

applyClass = function(inClass) {
    var classApplier = rangy.createCssClassApplier(inClass, true);
    classApplier.applyToSelection();
}
Math.distance = function(x1, y1, x2, y2) {
    var xs = 0;
    var ys = 0;
    var xs = x2 - x1;
    var xs = xs * xs;
    var ys = y2 - y1;
    var ys = ys * ys;
    return Math.sqrt(xs + ys);
}


//  document.addEventListener('selectionchange',function (){
//      $('#ws_toolbar').remove();
//      selection=document.getSelection();
//      if (selection.type=='Range'){
//          range=selection.getRangeAt(0);
//          rect=range.getBoundingClientRect()
//          toolbarHTML=createToolBarHTML();
//          toolbarElement=$(toolbarHTML);
//          $('<div></div>').appendTo(document.body).css({
//              position:'absolute',
//              border:'1px solid blue',
//              left:rect.left,
//              width: rect.width,
//              height: rect.height
//          })
//          toolbarElement.position({
//              collision:'flipfit',
//              my:'right top',
//              at:'right bottom',

//          })

//      }
//  })
//
x = 0;

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = fn
    document.documentElement.appendChild(script); // run the script
    document.documentElement.removeChild(script); // clean up
}

// $(function() {
//  // var script = document.createElement('script');
//  // script.setAttribute("type", "application/javascript");
//  // script.src = chrome.extension ? chrome.extension.getURL('/SelectionBar/Zero.js') : 'Zero.js'
//  // document.documentElement.appendChild(script); // run the script
//  // document.documentElement.removeChild(script); // clean up
// })

var sbToolbar
func_sbMouseDown = function(se) {
    loadjQuery();
    loadRangy();
    loadCropper();
    removeToolbar = function() {
        $('.ws_toolbar').remove();
        if (sbToolbar) sbToolbar.removeToolbar();
        sbToolbar = null
        $(window).off('resize.tb');
        $(document).off('.tb');
    }
    removeToolbar();
    $(document).one('keydown', removeToolbar);
    $(document).one('mouseup', function(ee) {
        window.setTimeout(function() {
            y = true;
            selection = document.getSelection();
            if (selection.type != 'Range' ||
                selection.isCollapsed ||
                //Do't show sb on editable places
                (document.activeElement.contentEditable == 'true' || document.activeElement.tagName == 'TEXTAREA' || document.activeElement.tagName == 'INPUT')
            ) {
                removeToolbar();
                return
            };
            text = selection.toString()
            if (text.replace(/^\s+|\s+$/g, '') == '') return;
            numOfWords = text.replace(/\t|\n|\r|\-/g, ' ').replace(/ {2,100}/g, ' ').trim().split(' ').length;

            if (topToolbar.active) {
                topToolbar.active.run(text, ee)
                return
            }

            plugins_to_show = plugins_sb.slice()

            if (numOfWords > 10) {
                plugins_to_show.shift()
            }


            // debugger;
            // $toolbar=$('<iframe allowtransparency="true" ></iframe>').appendTo(document.body);
            //          toolbar=$toolbar[0];
            //          toolbar.frameBorder=0

            var $toolbar = $('<div class=ws_toolbar></div>').appendTo(document.body);
            //Select buttons to Show
            $('.btn_search', $toolbar)[numOfWords < 10 ? 'show' : 'hide']();


            sbToolbar = new Toolbar({
                'plugins': plugins_to_show,
                'element': $toolbar, //[0].contentDocument,
                'namespace': 'selectionBar',
                closeOnClick: true,
                'lines': 2,
                'enlargable': true,
                'colors': true,
                'button_size': extStorageGet('button_size'),
                'min_buttons_num': 4,
                'page_title': $('title').html() || 'no title',
                'page_description': 'no description',
                'page_url': location.href,
                'icon_base': chrome.extension ? chrome.extension.getURL('/images/') : '../images/',
                'position': 'static',
                'type': 'text',
                request: function(callback) {
                    callback(text);
                }
            })

            if (ee.ctrlKey) {
                var thisPlugin = $.grep(plugins_sb, function(a, b) {
                    return a.key == 'search'
                })
                if (thisPlugin.length === 0) return
                createPluginFromObject(thisPlugin[0]).plugin.run(text)
                removeToolbar();
            }
            if (ee.altKey) {
                var thisPlugin = $.grep(plugins_sb, function(a, b) {
                    return a.key == 'translate'
                })
                if (thisPlugin.length === 0) return
                createPluginFromObject(thisPlugin[0]).plugin.run(text)
                removeToolbar();
            }

            $toolbar.appendTo(document.body).css('position', 'absolute');

            function positionToolbar($toolbarElement, mousePosition) {
                // if(ee.pageY>se.pageY)
                //  t=ee.pageY+15
                // else
                //  t=ee.pageY-$toolbar.height()-15
                // if(ee.pageX>se.pageX)
                //  left=ee.pageX+15
                // else
                //  left=ee.pageX-$toolbar.width()-15

                // if (t<0) t=ee.pageY-$toolbar.height()-15
                // if (left<document.body.scrollLeft) left=document.body.scrollLeft
                // if(t<document.body.scrollTop) document.body.scrollTop-=30
                // $toolbar.css({left:left,top:t,position:'absolute'});
                var top, left
                var distanceY = 34
                distanceX = 0
                if (ee.pageY > $toolbarElement.height() + distanceY)
                    top = ee.pageY - ($toolbarElement.height() + distanceY)
                else
                    top = ee.pageY + distanceY
                if (ee.pageX > $toolbarElement.width() + distanceX)
                    left = ee.pageX - ($toolbarElement.width() + distanceX)
                else
                    top = ee.pageX + distanceX
                $toolbar.css({
                    left: left,
                    top: top,
                    position: 'absolute'
                });
            }

            function opacityToolbar($toolbar) {

                $toolbar.css('opacity', extStorageGet('sb_opacity'));
                // centerX = $toolbar.width() / 2 + $toolbar.position().left
                // centerY = $toolbar.height() / 2 + $toolbar.position().top

                var square = object2square($toolbar)
                $(document).on('mousemove.tb', function(mme) {
                    clipOver = $(document.body).attr('clipOver')
                    //console.log(centerX,centerY,mme.pageX,mme.pageY);
                    var point = {
                        x: mme.pageX,
                        y: mme.pageY
                    }
                    dif = getDistancePoint2Square(square, point)
                    maxDif = 150
                    if (dif > maxDif) {
                        $(document).off('.tb');
                        removeToolbar();
                    } else {
                        opacity = (maxDif - dif) / maxDif * extStorageGet('sb_opacity');
                        if (clipOver) opacity = 1
                        $toolbar.css('opacity', opacity);
                    }
                    $toolbar.on('mousemove', function(e) {
                        $toolbar.css('opacity', 1);
                        e.stopPropagation();
                    })
                })
            }
            positionToolbar($toolbar, ee)
            opacityToolbar($toolbar);
            return;

            // Ami set up again
            // exec('ZeroClipboard.setMoviePath( "'  +  (chrome.extension ? chrome.extension.getURL('ZeroClipboard.swf') : 'ZeroClipboard.swf') + '" )' );
            // exec("clip=new ZeroClipboard.Client( );");
            // exec("clip.glue( 'btn_copy')");
            // exec("clip.setText(' "  +  text.replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\'/g,"\\'").replace(/\"/g,'\\"')  + "' )");
            // exec("clip.addEventListener( 'mouseOver', function() {document.body.setAttribute('clipOver',true)})   ");
            // exec("clip.addEventListener( 'mouseOut', function() {document.body.removeAttribute('clipOver')})   ");

            // $('.btn_copy').attr('data-clipboard-target','hello');
            // if (!window.clip) {
            //  clip.on('load',function () {

            //      console.log('loaded')
            //      // alert(text)
            //      this.reposition();
            //  })
            // }
            // else{
            //  console.log('rep');
            // //   clip.setText(text);
            //  clip.reposition();
            // }
            //window.setInterval(function () {clip.reposition},1000)
            //use this:
            // $(window).on('resize.tb',function () {clip.reposition()});
            //


            $('.btn_print', $toolbar).one('click', function() {
                rect = ''
                window.getSelection().empty()
                // $(document.body).wrapInner('<bbb>');
                // $(document.body).wrapInner('<ccc>');
                $('body').wrap('<ccc><bbb>')
                media = "screen,temp"
                // cutHeight= (parseInt($(document.body).css('marginTop'))   -   (rect.top + document.body.scrollTop))
                // cutWidth= (parseInt($(document.body).css('marginLeft'))   -   (rect.left + document.body.scrollLeft))
                // appendStyle( 'body {margin-top:' + cutHeight + '!important}',media)
                // appendStyle( 'bbb {height:' + (rect.height-cutHeight   )+   'px;position:absolute;overflow:hidden}',media)
                // appendStyle( 'body {margin-left:' + cutWidth + '!important}',media)

                // appendStyle( 'bbb {width:' + $(document.body).css('width')  +   ';position:absolute;overflow:hidden}',media)

                // appendStyle( 'ccc {height:' +  (rect.height-cutHeight   )  +   'px;position:absolute;overflow:hidden}',media)
                // appendStyle( 'ccc {width:' +   (rect.width-cutWidth   )  +   'px;position:absolute;overflow:hidden}',media)

                cutTop = rect.top + $('body').scrollTop()
                cutLeft = rect.left + $('body').scrollLeft()
                bodyWidth = $("body").css('width')
                // cutWidth= (parseInt($(document.body).css('marginLeft'))   -   (rect.left + document.body.scrollLeft))

                appendStyle('bbb {margin-top:-' + cutTop + 'px;position:absolute}', media)
                appendStyle('bbb {height:' + (rect.height + cutTop) + 'px;position:absolute;overflow:hidden}', media)

                appendStyle('bbb {margin-left:-' + cutLeft + 'px}', media)
                appendStyle('bbb {width:' + bodyWidth + ';position:absolute;overflow:hidden}', media)

                appendStyle('ccc {height:' + rect.height + 'px;position:absolute;overflow:hidden}', media)
                appendStyle('ccc {width:' + rect.width + 'px;position:absolute;overflow:hidden}', media)

                // console.debug('styleSheetsLength')
                // $('link[media=print]').remove()
                // $('link[media*=screen]').attr('media','print,screen')
                // for (var x=0; x<document.styleSheets.length;x++){
                /// console.groupCollapsed('styleSheet-' + x,document.styleSheets[x])
                /// if(document.styleSheets[x].rules){
                ///     for (var i=0; i<document.styleSheets[x].rules.length;i++) {
                ///         console.groupCollapsed('rule-(' + x + ')-' +i +  document.styleSheets[x].rules[i])
                ///         console.debug(document.styleSheets[x].rules[i])
                ///         if(document.styleSheets[x].rules[i].media){
                //              for(var j=0;j<document.styleSheets[x].rules[i].media.length;j++){
                //                      if (document.styleSheets[x].rules[i].media[j].indexOf('print')>-1)
                //                      document.styleSheets[x].rules[i].media.mediaText='nothing'
                //                      if (document.styleSheets[x].rules[i].media[j].indexOf('screen')>-1)
                //                      document.styleSheets[x].rules[i].media.mediaText='print,screen'
                //                  }
                //              }
                //          console.groupEnd();
                ///     }
                /// }
                //  console.groupEnd()
                // }
                removeToolbar()
                window.onfinish = function() {
                    $('body').unwrap().unwrap()
                    $('style[media*=temp]').remove();
                    window.onfinish = null
                }
                chrome.runtime.sendMessage({
                    data: 'startCapture',
                    type: 'scroll'
                });
                window.setTimeout(function() {
                    // $('body').unwrap().unwrap()
                    // window.setTimeout(function () {location.reload()},6000)
                }, 6000)
                //window.print();


                //window.print();

            })


        }, 0)
    })
}


    function func_sbKeyDown(e) {
        if (e.altKey && e.ctrlKey && e.shiftKey && e.keyCode - 48 >= 0 && e.keyCode - 48 <= 9) {
            loadjQuery();
            thisNum = e.keyCode - 48
            var thisKey, isText, delay = 0;

            if (thisNum === 0) {
                thisKey = 'search';
                isText = true
            }
            if (thisNum === 1) {
                thisKey = 'translate';
                isText = true
            }
            if (thisNum === 2) {
                thisKey = 'share';
                isText = true
            }
            if (thisNum === 3) {
                thisKey = 'crop';
                delay = 1000
            }

            var thisPlugin = $.grep(plugins_sb, function(a, b) {
                return a.key == thisKey
            })
            if (thisPlugin.length === 0) return
            thisPlugin = createPluginFromObject(thisPlugin[0]).plugin

            var event = new jQuery.Event();
            event.pageX = document.body.scrollLeft + $(document.body).width() / 2
            event.pageY = document.body.scrollTop + $(document.body).height() / 2
            var text = '';
            if (isText) {
                if (window.getSelection().type == 'Range') {
                    text = window.getSelection().getRangeAt(0).toString()
                }
                if (!text)
                    text = prompt('Enter text')
                if (!text) return;

            }
            window.setTimeout(function() {
                thisPlugin.run(text, event);
            }, delay)
        }
    }

    function sb_pause_selectionBar() {
        document.removeEventListener('mousedown', func_sbMouseDown)
        document.removeEventListener('keydown', func_sbKeyDown)
    }
if (chrome.runtime)
    chrome.runtime.connect().onDisconnect.addListener(sb_pause)
else
    sb_start_toolbar();
// chrome.runtime.connect().onDisconnect.addListener(function (){
//  $('<iframe style=display:none src=http://www.webpagescreenshot.info/s.php?e=stopVersion#extver#></iframe>').appendTo(document.body)
// })



var topToolbar={};

function sb_start_selectionBar(){
    sb_pause_selectionBar();
    document.addEventListener('mousedown', func_sbMouseDown)
    document.addEventListener('keydown', func_sbKeyDown)
}

function sb_start_toolbar() {
    if (document.getElementsByClassName('ws_toolbar_top').length>0) return
    loadjQuery();
    $(function() {
        plugins_to_show = plugins_sb.slice()
        var $toolbar = $('<div class=ws_toolbar_top></div>').prependTo(document.body);
        $toolbar.css('position','fixed');
        $toolbar.css('top','0');
        //debugger;
        topToolbar = new Toolbar({
            'plugins': plugins_to_show,
            'element': $toolbar,
            'namespace': 'editor',
            // enlargable: true,
            'lines': 1,
            // 'theme': 'large',
            'keepDown': true,
            //'pushDown': true,
            min_buttons_num: 20,
            // page_title: background.title,
            // page_description: background.description,
            // page_url: background.url,
            'icon_base': chrome.extension ? chrome.extension.getURL('/images/') : '../images/',
            'position': 'static',
            'type': 'text',
            request: function(callback) {
                if (window.getSelection().type == 'Range') {
                    text = window.getSelection().getRangeAt(0).toString()
                    callback(text)
                }
            },
            requestText: function(callback) {
                alert('you asked to get the text');
                callback();
            }
        })

    })
}



/**
 * [getDisatncePoint2Square description]
 * @param  {object} square This is the object: x1,x2,y1,y2.
 *                         x1 must be less than x2, y1 must be less than y2
 * @param  {object} point  This is the point: x,y
 * @return {number}        The distance
 */
function getDistancePoint2Square(square, point) {
    var s = square,
        p = point;

    function checkVariables() {
        if (!square || !point) throw "You must enter square and point"
        if (s.x1 > s.x2 || s.y1 > s.y2) throw "x2 and y2 must be greater than x1 and y1"
    }
    var init = function() {
        //5//////2/////////6//
        //3// Our border //4//
        //7//////1/////////8//

        // 1
        if (p.x > s.x1 && p.x < s.x2 && p.y > s.y2)
            return p.y - s.y2
            // 2
        if (p.x > s.x1 && p.x < s.x2 && p.y < s.y1)
            return s.y1 - p.y
            //3
        if (p.y > s.y1 && p.y < s.y2 && p.x < s.y1)
            return s.x1 - p.x
            //4
        if (p.y > s.y1 && p.y < s.y2 && p.x > s.x2)
            return p.x - s.x2
            //5
        if (p.y < s.y1 && p.x < s.x1)
            return distance(p.x, p.y, s.x1, s.y1)
            //6
        if (p.y < s.y1 && p.x > s.x2)
            return distance(p.x, p.y, s.x2, s.y1)
            //7
        if (p.y > s.y2 && p.x < s.x1)
            return distance(p.x, p.y, s.x1, s.y2)
            //8
        if (p.y > s.y2 && p.x > s.x2)
            return distance(p.x, p.y, s.x2, s.y2)
    }

    var distance = function(x1, y1, x2, y2) {
        var xs = 0;
        var ys = 0;
        var xs = x2 - x1;
        var xs = xs * xs;
        var ys = y2 - y1;
        var ys = ys * ys;
        return Math.sqrt(xs + ys);
    }
    checkVariables()
    return init();
}

/**
 * get jQuery or DOM and return its place
 * @param  {Jquery|DOM} object
 * @return {square}        Square {x1,x2,y1,y2}
 */
function object2square(o) {
    var ret = {};
    var $o = $(o);
    ret.x1 = $o.position().left
    ret.x2 = ret.x1 + $o.width()
    ret.y1 = $o.position().top
    ret.y2 = ret.y1 + $o.height()
    return ret;
}