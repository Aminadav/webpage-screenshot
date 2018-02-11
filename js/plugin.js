var buttons_colors = [
    '#F3B200',
    '#77B900',
    '#2572EB',
    '#AA4344',
    '#7F6E94',
    '#199900',
    '#FF981D',
    '#AA40FF',
    '#91D100',
    '#E1B700',
    '#FF76BC',
    '#56C5FF',
    '#00C13F',
    '#FE7C22'
]

var sizes = {
    4: 16,
    5: 20,
    6: 24
}


    function createPluginFromText(text) {
        console.log('Not support create plugin from text')
        try {
            if (!newPlugin.key) newPlugin.key = 'demoplugin';
        } catch (e) {
            return {
                error: e.toString()
            }
        }
        return createPluginFromObject(newPlugin)
        //Check for function to click
    }

    function createPluginFromObject(newPlugin) {
        if (!window.extStorageGet) {
            window.extStorageGet = function(key) {
                return localStorage[key]
            }
            window.extStorageSet = function(k, v) {
                return localStorage[k] = v
            }
        }
        if (!newPlugin.key) return ({
            error: 'You Don\'t have a "key" key',
            id: 4
        })
        if (!newPlugin.onclick && (!newPlugin.url)) return {
            error: "You don't have a onclick function or url key",
            id: 1
        }
        if (!newPlugin.name) return {
            error: 'You must add a "name" key',
            id: 2
        }
        //if(!newPlugin.dataType) return {error:'You must add a dataType key (for example: dataType:"text") ',id:3}

        dataTypes = newPlugin.dataType || '';
        dataTypes = dataTypes.replace(/text/g, '')
        dataTypes = dataTypes.replace(/image_url/g, '')
        dataTypes = dataTypes.replace(/image/g, '')
        dataTypes = dataTypes.replace(/page/g, '')
        dataTypes = dataTypes.replace(/image_base64/g, '')
        dataTypes = dataTypes.trim(dataTypes);
        if (dataTypes.length > 0) return {
            error: 'Cannot recognize dataType: ' + dataTypes
        }

        //if (newPlugin.dataType!='text' && newPlugin.dataType!='image' && newPlugin.dataType!='image_url' && newPlugin.dataType!='image_base64') return {error:'Cannot recognize dataType: '  + newPlugin.dataType}
        //
        newPlugin = $.extend({
            dataType: 'text image_url',
            isDataType: function(inDataType) {
                return (this.dataType.toLowerCase().indexOf(inDataType.toLowerCase()) > -1);
            },
            dataTypes: function() {
                return (this.dataType.split(' '));
            },
            run: function(inVar, event) {
                if (this.toolbar) {
                    var thisKey = this.toolbar.namespace + '_' + this.key + '_run'
                    if (!extStorageGet(thisKey)) extStorageSet(thisKey, 0);
                    extStorageSet(thisKey, parseInt(extStorageGet(thisKey), 10) + 1)
                }

                for (var key in sb) {
                    this[key] = sb[key]
                }
                var data = newPlugin
                data.event = event;
                data.page_title = (this.toolbar && this.toolbar.page_title) || $('title').text() || 'no title';
                data.page_description = (this.toolbar && this.toolbar.page_description) || $('meta[name=description]').attr('content') || ''
                data.page_url = (this.toolbar && this.toolbar.page_url) || location.toString();

                // if(data.toolbar.closeOnClick) data.toolbar.element.html('')


                if (this.isDataType('text')) {
                    data.text = inVar
                    data.dataType = 'text'
                    if (this.onclick)
                        this.onclick(data);
                    else if (this.url)
                        this.createTabWithParams(this.url, inVar, data)
                } else if (this.isDataType('image')) { //It's Image
                    data.image_url = function(callback) {
                        var imageData = this.image_data();
                        if (this.toolbar && imageData == this.toolbar.last_image_data) {
                            callback(this.toolbar.last_image_url);
                            return;
                        }
                        // console.log('here');
                        // console.log(mm = data)
                        // console.log(extStorageGet('options'))
                        $.ajax({
                            url: 'http://www.openscreenshot.com/upload3.asp',
                            // url: 'http://127.0.0.5/upload',
                            // url: 'https://www.openscreenshot.com/upload3.asp',
                            type: 'post',
                            data: {
                                type: 'png',
                                title: data.page_title,
                                description: data.page_description,
                                imageUrl: data.page_url,
                                options: extStorageGet('options'),
                                data: imageData
                            }
                        }).done(function(a, b, c) {
                            var response = a.replace(/^\s+|\s+$/g, "");
                            if (/"/.test(response) || />/.test(response) || /</.test(response) || /'/.test(response) || response.indexOf("http:") != 0) {
                                alert('error in upload')
                            } else {
                                response = response.split(',');
                                imageURL = response[0];
                                if (data.toolbar) {
                                    data.toolbar.last_image_data = imageData;
                                    data.toolbar.last_image_url = imageURL
                                }
                                callback(imageURL);
                            }
                        })
                    };
                    data.image_base64 = function(callback) {
                        var toData = this.image_data()
                        var ans = toData.slice(toData.indexOf(',') + 1);
                        if (callback) callback(ans);
                        return ans;
                    };

                    var dataURItoBlob = function (dataURI) {
                        var binary = atob(dataURI);
                        var array = [];
                        for (var i = 0; i < binary.length; i++) {
                            array.push(binary.charCodeAt(i));
                        }
                        return new Blob([new Uint8Array(array)], {type: 'image/png'})
                    };
                    data.image_blob = function () {
                        return dataURItoBlob(data.image_base64());
                    };
                    if (Array.isArray(inVar) || inVar.jquery)
                        inVar = inVar[0]
                    if (typeof inVar == 'string' && inVar.slice(0, 4) == 'data') {
                        data.image_data = function(callback) {
                            if (callback) callback(inVar);
                            return inVar
                        }
                    } else if (inVar.nodeType) {
                        var canvas;
                        if (inVar.tagName == 'IMG') {
                            canvas = document.createElement('canvas');
                            canvas.width = inVar.width;
                            canvas.height = inVar.height;
                            canvas.getContext('2d').drawImage(inVar, 0, 0)
                        }
                        if (inVar.tagName == 'CANVAS') {
                            canvas = inVar;
                        }
                        if (inVar.tagName == 'CANVAS' || inVar.tagName == "IMG") {
                            data.image_data = function(callback) {
                                var ans = canvas.toDataURL();
                                if (callback) callback(ans);
                                return ans;
                            }
                        } else {
                            alert('plugin tag get no supported:' + inVar.tagName)
                        }
                    }

                    if (this.url) {
                        data.image_url(function(url) {
                            data.createTabWithParams(data.url, url, data)
                        })
                    }
                    if (this.onclick) {
                        if (this.dataType == 'image')
                            data.dataType = 'image';
                        this.onclick(data);
                    }
                } else { //no DataType
                    if (this.onclick) {
                        this.onclick(data);
                    }
                }


            }
        }, newPlugin)
        return {
            plugin: newPlugin
        };
    }


    //This object will autocopy to each plugin/
sb = {
    applyClass: function(inClass) {
    },
    createTabWithParams: function(url, s, moreData) {
        //Scope: plugin
        var newUrl = this.url
        newUrl = newUrl.replace(/{image_url}/g, '%c')
        newUrl = newUrl.replace(/{page_url}/g, encodeURIComponent(this.page_url))
        newUrl = newUrl.replace(/{page_title}/g, encodeURIComponent(this.page_title))
        newUrl = newUrl.replace(/{page_description}/g, encodeURIComponent(this.page_description))
        newUrl = newUrl.replace(/{text}/g, encodeURIComponent(this.text));
        newUrl = newUrl.replace(/%s/g, s).replace('%c', encodeURIComponent(s.replace('img', 'i3'))).replace(/%t/g, encodeURIComponent(moreData.title));
        this.createTab(newUrl)
    },
    createTab: function(url) {
        //scope: Plugin
        window.open(url, '_blank')
    },
    dialog: function(inElement, settings) {
        inElement = $(inElement)
        $('input', inElement).not('[type=password]').inputLoadAndRemember(this)
        var cSettings = $.extend({}, settings, {
            element: inElement,
            ui: 'dialog',
            title: this.name
        })
        var dialog = new Dialog(cSettings)
        dialog.show()
        $('input', dialog.contentDocument).first().focus()
        return dialog;
    },
    dialog3: function(inElement) {
        inElement = $(inElement)
        $('input', inElement).not('[type=password]').inputLoadAndRemember(this)
        //$('button',inElement).button();
        iframe = document.createElement('iframe').appendTo(document.body)
        iframe.style.position = 'absolute'
        iframe.frameBorder = 0
        document.body.appendChild(iframe)
        $(iframe).position({
            of: document
        })
        //Changed: close margin-8px;   width:100% //class=close
        var div = $('<div style=width:inherit class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-front ui-dialog-buttons ui-draggable ui-resizable">' +
            '<div style=cursor:default class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">' +
            '<span id=title class="ui-dialog-title"></span>' +
            '<button  class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close" role="button" aria-disabled="false" title="close"><span style=margin:-8px class="ui-button-icon-primary ui-icon ui-icon-closethick"></span></button>' +
            '</div>' +
            '<div id=content class="ui-dialog-content ui-widget-content">' +
            '</div>' +
            '</div>')
        iframe.contentDocument.body.appendChild(div[0])
        $('[title=close]', div).click(function() {
            askToClose();
        })
        $('#content', iframe.contentDocument.body).append(inElement[0])
        $('#title', iframe.contentDocument.body).html('Hello World')


        div = document.createElement('div')
        div.innerHTML = '<link rel="stylesheet" href="jquery-ui-1.9.2.custom.min.css"></link><style>body {color:white;}</style>'
        iframe.contentDocument.body.appendChild(div)
        var askToClose = function() {
            iframe.remove();
        }
        var closeOnEsc = function(e) {
            if (e.keyCode == 27)
                askToClose()
            document.removeEventListener('keyup', closeOnEsc);
        }
        document.addEventListener('keyup', closeOnEsc)
        iframe.contentDocument.addEventListener('keyup', closeOnEsc)

        var resizeFrame = function() {
            iframe.style.height = iframe.contentDocument.height + 'px'
            iframe.style.width = iframe.contentDocument.width + 'px'
        }
        resizeFrame()
        $('input', iframe.contentDocument).first().focus()
    },
    dialog2: function(inElement) {
        //Scope: plugin
        inElement = $(inElement).wrap('<div class="noCss">').parent();
        $('input', inElement).not('[type=password]').inputLoadAndRemember(this)
        $('button', inElement).button();

        inElement.dialog({
            modal: true,
            minWidth: 460,
            title: this.name + ' - ' + 'Selection Bar'
        });
        return $(inElement);
    },
    storageGet: function(inVar, def) {
        var key = (this.toolbar && this.toolbar.namespace) + '_' + this.key + '_' + inVar;
        var ans;
        if (extStorageGet)
            ans = extStorageGet(key)
        else
            ans = localStorage[key];
        if (ans === undefined) ans = def;
        return isNumber(ans) ? parseFloat(ans) : ans;
    },
    storageSetDefault: function(inVar, inVal) {
        if (this.storageGet(inVar) == undefined) this.storageSet(inVar, inVal)
    },
    storageSet: function(inVar, inVal) {
        var key = (this.toolbar && this.toolbar.namespace) + '_' + this.key + '_' + inVar;
        if (extStorageSet)
            return extStorageSet(key, inVal)
        else
            return localStorage[key] = inVal
    }

}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var sb_plugins = {};

function addObjectToPlugins(object) {
    if (!Array.isArray(object)) object = [object]
    $.each(object, function() {
        var object = this;
        newPlugin = createPluginFromObject(object);
        if (newPlugin.error) {
            console.log('cannot add plugin, error', newPlugin.error)
            return
        }
        newPlugin = newPlugin.plugin;
        sb_plugins[newPlugin.key] = newPlugin
    });
}


jQueryThingsLoaded = false
loadjQueryThings = function() {
    if (jQueryThingsLoaded) return
    jQueryThingsLoaded = true
    $.ajaxPrefilter(function(settings, orgSettings, xhr) {
        if (settings.showProgress) {
            var html = $('<center class=progresscancel><div>Saving Online...<br><div style=height:20px;background-color:skyblue name=progressbar></div><button name=cancel>Cancel</button></div></center>');
            var dialog = new Dialog({
                title: 'Uploading',
                ui: 'dialog',
                element: html,
                onclose: function() {
                    xhr.abort()
                }
            }).show();
            var progressbar = $("[name=progressbar]", html)
            progressbar.css({
                width: '0%'
            })

                function updateProgress(per) {
                    progressbar.css({
                        width: per + '%'
                    })
                }
            settings.xhr = function() {
                var x = new XMLHttpRequest;
                x.upload.onprogress = function(p) {
                    var total = p.total
                    var loaded = p.loaded
                    updateProgress(p.loaded / p.total * 98)
                };
                return x
            }
            // settings.xhr().upload.onprogress=function () {console.log('ar',arguments)}	;
            xhr.fail(function() {
                $('[name=status]', html).html('Cannot upload. Try again later');
            })
            xhr.done(function() {
                dialog.remove()
            })
            $('[name=cancel]', html).click(function() {
                // console.log('clickcancel')
                dialog.remove();
                xhr.abort()
            })
        }
    });
    $.ajaxSetup({
        showProgress: true
    })



    $.fn.inputLoadAndRemember = function(plugin) {
        this.each(function() {
            // console.log(this, this.getAttribute('name'))
            if (this.getAttribute('name').length < 1) {
                console.log('Every input must have "name" Attribute')
            } else {
                // console.log(00);
                $(this).val(plugin.storageGet(this.getAttribute('name')));
                $(this).on('input', function() {
                    plugin.storageSet(this.getAttribute('name'), $(this).val())
                })
            }
        })
    }
}


/**
 * [Toolbar description]
 * @param {[type]} options [description]
 */
function Toolbar(options) {
    loadjQueryThings();
    this.obj_plugins = {};
    var $toolbar = ''
    var dataTypes = []
    $toolbar = $('<div class="plugin-toolbar"></div>');
    if (!options.theme) {
        var style = "background: #fff;box-shadow: 0 2px 2px rgba(0,0,0,0.15);border: 1px #aaaaab solid;border-radius: 4px;display:inline-block;";
        if (options.whiteIcons) {
            style += 'padding-top:3px;';
        }
        $toolbar.attr('style', style);
    }
    var toolbar = this;

    function create$toolbar() {
        var html;
        $toolbar.html('');
        $toolbar.css('z-index', toolbar.zIndex)
        var index = 0

        var count = 0;
        $.each(toolbar.obj_plugins, function(a, b, c) {
            this.dataTypes = this.dataType.split(' ');
            for (var d1 in dataTypes)
                for (var d2 in this.dataTypes)
                    if (dataTypes[d1] == this.dataTypes[d2]) count++
        })

        var thisIndex = -1
        $.each(toolbar.obj_plugins, function(a, b, c) {
            if (options.doNotRenderDefaults && this.editorDefault) {
                return ;
            }
            var found = false
            for (var d1 in dataTypes)
                for (var d2 in this.dataTypes)
                    if (dataTypes[d1] == this.dataTypes[d2]) found = true
            if (!found) return;
            if (options.theme) {
                html = $('<div class="tb_button" plugin-key="' + this.key + '"><img src=' + toolbar.icon_base + (this.key + '.png') + ' ></div>')
            } else {
                var style = options.whiteIcons && 'padding: 4px 3px;margin-bottom: 3px;margin-left: 3px;margin-right: 2px;background: #777;float: left;border: none;color: #fff;height: 20px;line-height: 20px;border-radius: 3px;cursor: pointer;box-sizing: content-box;float:left;' || "float:left";
                html = $('<div style="' + style +
                '"><div style=display:none;font-size:10px;font-family:arial;text-align:center>' + this.name + '</div><img class=tb_button plugin-key="' + this.key + '"src=' + toolbar.icon_base + (this.key + '.png') + ' ></div>')
                //options.button_size = 15
            }
            index++;
            $('img,div', html).attr('width', options.button_size + 'px')
            $('img,div', html).attr('height', options.button_size + 'px')
            $('img,div', html).css({
                'width': options.button_size + 'px',
                'height': options.button_size + 'px',
                'border-right': 'none',
                'border-left': 'none',
                'border-bottom': 'none',
                'box-sizing': 'content-box',
                'padding': options.whiteIcons ? '0' : '5px',
                'float': 'left'
            });
            html.attr('title', this.name)
            var plugin = this;
            plugin.$ = html;
            var img = $('img', html).on({
                'error': function() {
                    // console.log(plugin);
                },
                'mouseenter': function() {
                    //$(this).addClass('hover')
                },
                'mouseleave': function() {
                    if (plugin.state != 'down')
                        $(this).removeClass('hover')

                },
                'mousedown mouseup': function(e) {
                    e.stopPropagation()
                },
                'click': function(e) {
                    if (window.getSelection().type == 'Range') {
                        text = window.getSelection().getRangeAt(0).toString()
                    }
                    if (toolbar.keepDown && plugin.state != 'down') {
                        $.each(toolbar.obj_plugins, function(k, plugin) {
                            if (plugin.state == 'down') {
                                plugin.state = 'up';
                            }
                        });
                        $toolbar.find('img').css('background', '#fff');
                        img.css('background', '#4BBAFF');
                        plugin.state = 'down';
                        toolbar.active = plugin;
                    } else if (toolbar.keepDown && plugin.state == 'down') {
                        plugin.state = 'up';
                        toolbar.active = null;
                        img.css('background', '#fff');
                    }

                    toolbar.request(function(img) {
                        if (plugin.closeOnClick === false) e.stopPropagation()
                        plugin.run(img, e)
                    }, plugin);
                }

            })


            thisIndex++;

            //colors
            if (options.colors === true) {
                thisColorIndex = thisIndex
                if (thisColorIndex >= buttons_colors.length) thisColorIndex = 0;
                $('img', html).css('backgroundColor', buttons_colors[thisColorIndex])
            }


            $toolbar.append(html)
            if (Math.round(count / this.toolbar.lines + 1) == index)
            // 	// $toolbar.append('<br>')
                html.css('clear', 'both')
        })
        //Enlarge Button
        if (options.enlargable) {
            $rightButton = $('<div style=cursor:pointer;float:left><img style="margin:-5px"  src=' + toolbar.icon_base + 'right.png' + '></div>')
            $leftButton = $('<div style=cursor:pointer;float:left><img style="width:15px; height:15px;padding: 5px; box-sizing: content-box;float: left" src=' + toolbar.icon_base + 'left.png' + '></div>')
            $toolbar.append($rightButton).append($leftButton);
            updateMinMax();
            $rightButton.add($leftButton).find('img')
                .css('height', options.button_size)
                .on('mousedown', function(e) {
                    e.stopPropagation();
                })
            $rightButton.on('click', function(e) {
                toolbar.storageSet('isMax', 'yes')
                // e.stopPropagation();
                updateMinMax();
                return false
            })
            $leftButton.on('click', function(e) {
                toolbar.storageSet('isMax', 'no')
                // e.stopPropagation();				
                updateMinMax();
                return false
            })
        }
    }
    var $rightButton, $leftButton
    var updateMinMax = function() {
        if (toolbar.isMax()) {
            $leftButton.show()
            $rightButton.hide()
            $('.tb_button', $toolbar).parent().show();
        } else {
            $leftButton.hide()
            $rightButton.show()
            // console.log(options)
            $('.tb_button', $toolbar).parent().hide().slice(0, options.min_buttons_num).show();
        }
    }
    this.isMax = function() {
        return toolbar.storageGet('isMax') == 'yes'
    }

    this.addPlugins = function(object) {
        if (!Array.isArray(object)) object = [object];
        $.each(object, function(key, cfg) {
            var newPlugin = createPluginFromObject(cfg);
            if (newPlugin.error) {
                console.log('cannot add plugin, error', newPlugin.error, newPlugin);
                return
            }
            newPlugin = newPlugin.plugin;
            newPlugin.toolbar = toolbar;
            toolbar.obj_plugins[newPlugin.key] = newPlugin;
        });
    };
    this.removeToolbar = function() {
        // console.log('there');
        $(options.element).html('')
        $(document).off('click', toolbar.removeToolbar);
    }
    var bindCloseOnClick = function() {
        // console.log('here');
        window.setTimeout(function() {
            $(document).on('click', toolbar.removeToolbar)
        }, 0)
    }
    var init = function() {
        dataTypes = options.type.split(' ');
        options = $.extend({}, {
            icon_base: 'icons/',
            lines: 1,
            min_buttons_num: 2,
            zIndex: 20000,
            button_size: 15
        }, options)
        for (var x in options) {
            this[x] = options[x]
        }
        this.request == this.request || this.requestImage;
        this.addPlugins(options.plugins)
        if (this.position == 'static') {
            create$toolbar()
            $(options.element).append($toolbar);

            if (options.pushDown) {
                $toolbar.css({
                    position: 'fixed',
                    top: '0px',
                    left: '0px',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderTopRightRadius: '0px'
                    // border: 'none'
                })

                function getFixedElements() {
                    return $('*').filter(function() {
                        return $(this).css("position") === 'fixed' //|| $(this).css("position") === 'absolute';
                    });
                }

                var toolbarHeight = $($toolbar).height() + 5
                getFixedElements().not($toolbar).css('margin-top', function(i, value) {
                    return parseInt(value) + toolbarHeight
                });

                var nnww=(parseInt($('tml').css('margin-top')) || 0) + toolbarHeight

                try{
                s=document.createElement('style');
                document.getElementsByTagName('html')[0].appendChild(s)
                s.innerText='@media print {.ws_toolbar_top {display:none}} @media screen {html {margin-top:' + nnww + 'px;position:relative}'
                }catch(asdare){}
                // $(document.body).css('margin-top', 20);

            }
        }
        if (options.closeOnClick) bindCloseOnClick();
    }
    this.getPluginByKey = function(key) {
        // return _.find(toolbar.obj_plugins, function(obj) {
        // 	return obj.key == key
        // })
        if (this.obj_plugins[key]) return this.obj_plugins[key]
    }
    this.storageGet = function(inVar, def) {
        var key = (this.namespace && 'toolbarnonamespace') + '_' + inVar;
        var ans;
        if (extStorageGet)
            ans = extStorageGet(key)
        else
            ans = localStorage[key];
        if (ans === undefined) ans = def;
        return isNumber(ans) ? parseFloat(ans) : ans;
    },
    this.storageSetDefault = function(inVar, inVal) {
        if (this.storageGet(inVar) == undefined) this.storageSet(inVar, inVal)
    },
    this.storageSet = function(inVar, inVal) {
        var key = (this.namespace && 'toolbarnonamespace') + '_' + inVar;
        if (extStorageSet)
            return extStorageSet(key, inVal)
        else
            return localStorage[key] = inVal
    }

    init.call(this)


}



function appendStyle(x, media) {
    style = document.createElement('style');
    if (media) style.media = media
    style.innerText = x;
    if (document.body)
        document.body.appendChild(style);
}


function appendFirstStyle() {
    style = document.createElement('style')
    var x = ''
    x += '.tb_button {padding:1px;cursor:pointer;border-right: 1px solid #8b8b8b;border-left: 1px solid #FFF;border-bottom: 1px solid #fff;}'
    x += '.tb_button.hover {borer:2px outset #def; background-color: #f8f8f8 !important;}'
    x += '.ws_toolbar {z-index:100000} .ws_toolbar .ws_tb_btn {cursor:pointer;border:1px solid #555;padding:3px}   .tb_highlight{background-color:yellow} .tb_hide {visibility:hidden} .ws_toolbar img {padding:2px;margin:0px}'
    // x += '.ui-dialog  td {color:white!important}'
    appendStyle(x)
}
if (document.readyState == 'complete') appendFirstStyle();
else window.addEventListener('load', appendFirstStyle)