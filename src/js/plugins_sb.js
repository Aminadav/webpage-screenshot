var plugins_sb = [{
        name: 'Search',
        key: 'search',
        dataType: 'text',
        // url: 'http://search.conduit.com/Results.aspx?q={text}&SearchSource=67&ctid=CT3302431'
        onclick: function(scope) {
            $html = $('<iframe style=width:100%;height:600px;border:0 src="//www.webpagescreenshot.info/search.php?q=' + encodeURIComponent(scope.text) + '""></iframe>')
            var d = new Dialog({
                html: $html,
                title: 'Search Results',
                closeOnClick: true,
                ui: 'dialog'
            })
            d.show()
        }
    },

    {
        name: 'Share',
        key: 'share',
        onclick: function(scope) {
            var asd = [{
                name: 'Facebook',
                key: 'facebook',
                url: 'http://www.facebook.com/sharer/sharer.php?s=100&p[summary]=Taken with Webpage Screenshot&p[title]={page_title}&p[url]={page_url}#{text}'
            }, {
                name: 'Twitter',
                key: 'twitter',
                url: 'http://twitter.com/home?status=%s'
            }, {
                name: 'Google+',
                key: 'gplus',
                url: 'https://plus.google.com/share?url={page_url}#{text}'
            }, {
                name: 'Evernote',
                key: 'evernote',
                url: 'http://s.evernote.com/grclip?url={page_url}&title={text}'
            }, {
                name: 'Gmail',
                key: 'gmail',
                url: 'https://mail.google.com/mail/?view=cm&fs=1&su={page_title}&body={text} {page_url}'
            }, {
                name: 'del.icio.us',
                key: 'del',
                url: 'http://del.icio.us/post?url={page_url}&title={text}'
            }, {
                name: 'Digg',
                key: 'digg',
                url: 'http://digg.com/submit?url={page_url}&title={text}'
            }]
            var $toolbar = $('<div></div>').css({
                position: 'absolute',
                top: scope.event.pageY,
                left: scope.event.pageX
            }).appendTo(document.body)
            var staticPlugin = new Toolbar({
                'plugins': asd,
                'element': $toolbar,
                'namespace': 'shareiBar',
                'button_size': 20,
                'lines': 1,
                closeOnClick: true,
                'whiteIcons': true,
                // page_title: $('title').html() || 'no title',
                // page_description: 'no description',
                // page_url: location.href,
                'icon_base': chrome.extension.getURL('/images/'),
                'position': 'static',
                'type': 'text',
                'zIndex': 11100,
                request: function(callback) {
                    callback(scope.text)
                }
            })
        }
    },

    {
        name: 'Image',
        key: 'crop',
        onclick: function() {
            var plugins_to_show;
            $('html').css('position','inherit');
            if (window.getSelection().rangeCount == 0) return;
            rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
            window.getSelection().empty()
            window.crop = {}
            window.crop.x1 = rect.left + document.body.scrollLeft
            window.crop.y1 = rect.top + document.body.scrollTop
            window.crop.x2 = rect.width + window.crop.x1
            window.crop.y2 = rect.height + window.crop.y1
            var $toolbar = $('<div class=ws-styles><table style="border: 0;"><tr style="border: 0;vertical-align: middle"><td style="border: 0;vertical-align: middle"><button class="open msg" style="margin:1px;color:black;background-color:white;cursor:pointer;font-size:1em;border: 1px solid #999; border-radius: 4px;padding: 3px 9px;" tag=open></button>' +
                '<button class="save msg" style="margin:1px;color:black;background-color:white;cursor:pointer;font-size:1em;border: 1px solid #999; border-radius: 4px;padding: 3px 9px;" tag=save></button>' +
                '<button class="share msg" tag=share style="margin:1px;color:black;background-color:white;cursor:pointer;font-size:1em;border: 1px solid #999; border-radius: 4px;padding: 3px 9px;"></button></td><td style="border: 0;vertical-align: middle"><div class=realToolbar></div></td></tr></table></div>')


            jQuery('.msg', $toolbar).each(function() {
                jQuery(this).html(chrome.i18n.getMessage(jQuery(this).attr('tag')));
            });
            var $realToolbar = $('.realToolbar', $toolbar)


            window.crop.icons = $toolbar;
            plugins_to_show = defaultPlugins.slice();
            plugins_to_show = $.grep(plugins_to_show, function(o) {
                return (
                    // o.key!='webpagescreenshot' &&
                    o.key != 'googledrive'
                )
            })
            $('button.open', $toolbar).on('click', function() {
                removeClip();
                chrome.runtime.sendMessage({
                    data: 'captureAll',
                    type: 'scroll',
                    cropData: {
                        x1: x1,
                        x2: x2,
                        y1: y1,
                        y2: y2,
                        scrollTop: document.body.scrollTop,
                        scrollLeft: document.body.scrollLeft
                    }
                })
            })
            $('button.save', $toolbar).on('click', function() {
                $('[plugin-key=save]').trigger($.Event({
                    type: 'click'
                }))
            })

            // $('button.open',$toolbar).on('click',function (){
            // 	$('[plugin-key=open]').trigger($.Event({type:'click'}))
            // })			

            $('button.share', $toolbar).on('click', function() {
                $('[plugin-key=uploady]').trigger($.Event({
                    type: 'click'
                }));
            });

            plugins_to_show.unshift({
                name: 'annotate',
                key: 'webpagescreenshot',
                dataType: 'image',
                iconAspectRatio: 2,
                onclick: function(scope) {
                    window.open(chrome.extension.getURL('editor.html') + '#last', '_blank')
                }
            });

            var staticPlugin = new Toolbar({
                'plugins': plugins_to_show,
                'element': $realToolbar,
                'namespace': 'imageToolbar',
                'button_size': '20',
                'lines': 2,
                page_title: $('title').html() || 'no title',
                page_description: 'no description',
                page_url: location.href,
                'icon_base': chrome.extension ? chrome.extension.getURL('/images/') : '../images/',
                whiteIcons: true,
                'position': 'static',
                'type': 'image',
                'zIndex': 11000,
                request: function(callback) {
                    removeClip();
                    chrome.runtime.sendMessage({
                        data: 'captureVisible',
                        runCallback: true,
                        keepIt: true,
                        noScroll: true,
                        //type: 'scroll',
                        cropData: {
                            x1: x1,
                            x2: x2,
                            y1: y1,
                            y2: y2,
                            scrollTop: document.body.scrollTop,
                            scrollLeft: document.body.scrollLeft
                        }
                    }, function(x) {
                        callback(x);
                    })
                }
            })
            showCropOverFlow()
        }
    }

    ,

    {
        name: 'Translate',
        key: 'translate',
        onclick: function(scope) {

            chrome.runtime.sendMessage({
                data: 'speak',
                gender: 'male',
                rate: scope.storageGet('speed', 1),
                pitch: scope.storageGet('pitch', 1),
                message: scope.text,
            });


            var translateText = function(text, target, callback) {
                $.ajax({
                    showProgress: false,
                    url: 'https://www.googleapis.com/language/translate/v2?key=AIzaSyCUXax8SFsdoWpTOwWL6xW6nk2wVYs-aNo&target=' + target + '&q=' + text,
                    success: function(e) {
                        callback(e.data.translations[0].translatedText)
                    }
                })
            }
            var showDialog = function($html) {
                scope.dialog($html);
            }
            var $divTranslated;
            var createHtml = function(inSelectElement) {
                var $e = $('<div><div class=translated></div><div class=selectElement></div></div>')
                $e.find('.selectElement').append(inSelectElement);
                $divTranslated = $e.find('.translated');
                return $e;
            }
            var changeTranslate = function(target) {
                translateText(scope.text, target, function(ans) {
                    $divTranslated.attr('dir', target == 'iw' || target == 'ar' ? 'rtl' : 'ltr')
                    $divTranslated.html(ans);
                })
            }
            var createSelectElement = function(inLang) {
                var $e = $('<select>');
                $e.on('change', function() {
                    changeTranslate(this.value)
                    scope.storageSet('target', this.value)
                })
                var isSelected
                currentLang = scope.storageGet('target')
                for (var x in inLang) {
                    if (currentLang == inLang[x].code) isSelected = ' selected';
                    else isSelected = '';
                    $('<option value=' + inLang[x].code + isSelected + '>' + inLang[x].lang + '</option>').appendTo($e)
                }
                return $e
            }

            var init = function() {
                // chrome.i18n.getAcceptLanguages(function(lang) {
                $selectElement = createSelectElement([{
                    lang: 'Afrikaans',
                    code: 'af'
                }, {
                    lang: 'Albanian',
                    code: 'sq'
                }, {
                    lang: 'Arabic',
                    code: 'ar'
                }, {
                    lang: 'Azerbaijani',
                    code: 'az'
                }, {
                    lang: 'Basque',
                    code: 'eu'
                }, {
                    lang: 'Bengali',
                    code: 'bn'
                }, {
                    lang: 'Belarusian',
                    code: 'be'
                }, {
                    lang: 'Bulgarian',
                    code: 'bg'
                }, {
                    lang: 'Catalan',
                    code: 'ca'
                }, {
                    lang: 'Chinese Simplified',
                    code: 'zh-CN'
                }, {
                    lang: 'Chinese Traditional',
                    code: 'zh-TW'
                }, {
                    lang: 'Croatian',
                    code: 'hr'
                }, {
                    lang: 'Czech',
                    code: 'cs'
                }, {
                    lang: 'Danish',
                    code: 'da'
                }, {
                    lang: 'Dutch',
                    code: 'nl'
                }, {
                    lang: 'English',
                    code: 'en'
                }, {
                    lang: 'Esperanto',
                    code: 'eo'
                }, {
                    lang: 'Estonian',
                    code: 'et'
                }, {
                    lang: 'Filipino',
                    code: 'tl'
                }, {
                    lang: 'Finnish',
                    code: 'fi'
                }, {
                    lang: 'French',
                    code: 'fr'
                }, {
                    lang: 'Galician',
                    code: 'gl'
                }, {
                    lang: 'Georgian',
                    code: 'ka'
                }, {
                    lang: 'German',
                    code: 'de'
                }, {
                    lang: 'Greek',
                    code: 'el'
                }, {
                    lang: 'Gujarati',
                    code: 'gu'
                }, {
                    lang: 'Haitian ',
                    code: 'ht'
                }, {
                    lang: 'Hebrew',
                    code: 'iw'
                }, {
                    lang: 'Hindi',
                    code: 'hi'
                }, {
                    lang: 'Hungarian',
                    code: 'hu'
                }, {
                    lang: 'Icelandic',
                    code: 'is'
                }, {
                    lang: 'Indonesian',
                    code: 'id'
                }, {
                    lang: 'Irish',
                    code: 'ga'
                }, {
                    lang: 'Italian',
                    code: 'it'
                }, {
                    lang: 'Japanese',
                    code: 'ja'
                }, {
                    lang: 'Kannada',
                    code: 'kn'
                }, {
                    lang: 'Korean',
                    code: 'ko'
                }, {
                    lang: 'Latin',
                    code: 'la'
                }, {
                    lang: 'Latvian',
                    code: 'lv'
                }, {
                    lang: 'Lithuanian',
                    code: 'lt'
                }, {
                    lang: 'Macedonian',
                    code: 'mk'
                }, {
                    lang: 'Malay',
                    code: 'ms'
                }, {
                    lang: 'Maltese',
                    code: 'mt'
                }, {
                    lang: 'Norwegian',
                    code: 'no'
                }, {
                    lang: 'Persian',
                    code: 'fa'
                }, {
                    lang: 'Polish',
                    code: 'pl'
                }, {
                    lang: 'Portuguese',
                    code: 'pt'
                }, {
                    lang: 'Romanian',
                    code: 'ro'
                }, {
                    lang: 'Russian',
                    code: 'ru'
                }, {
                    lang: 'Serbian',
                    code: 'sr'
                }, {
                    lang: 'Slovak',
                    code: 'sk'
                }, {
                    lang: 'Slovenian',
                    code: 'sl'
                }, {
                    lang: 'Spanish',
                    code: 'es'
                }, {
                    lang: 'Swahili',
                    code: 'sw'
                }, {
                    lang: 'Swedish',
                    code: 'sv'
                }, {
                    lang: 'Tamil',
                    code: 'ta'
                }, {
                    lang: 'Telugu',
                    code: 'te'
                }, {
                    lang: 'Thai',
                    code: 'th'
                }, {
                    lang: 'Turkish',
                    code: 'tr'
                }, {
                    lang: 'Ukrainian',
                    code: 'uk'
                }, {
                    lang: 'Urdu',
                    code: 'ur'
                }, {
                    lang: 'Vietnamese',
                    code: 'vi'
                }, {
                    lang: 'Welsh',
                    code: 'cy'
                }, {
                    lang: 'Yiddish',
                    code: 'yi'
                }])
                $html = createHtml($selectElement);
                $selectElement.trigger('change')
                var d = new Dialog({
                    html: $html,
                    width: '300px',
                    title: 'Translate',
                    closeOnClick: true,
                    ui: 'dialog'
                })
                d.show()
                // });
            }
            init();
        }
    },

    {
        name: 'Copy',
        key: 'copy-text',
        onclick: function(scope) {
            chrome.runtime.sendMessage({
                'data': 'copyText',
                'text': scope.text
            });
        }
    },

    {
        name: 'Speak',
        key: 'speak',
        onclick: function(scope) {
            var $html, $speedButtons, $pitchbutton
                scope.storageSetDefault('speed', 1);
            scope.storageSetDefault('pitch', 2);
            var init = function() {
                $html = $('<div><div class=buttons></div><div style=clear:both class=text></div></div>');
                $speedButton = $('<div class=speedButton style="background-size:cover;width:24px;height:24px;background-image:url(' +
                    chrome.extension.getURL('/images/') + 'fast.png);"></div>');
                $speedButton.on('click', speedButtonClick)

                $pitchButton = $('<div class=pitchButton style="background-size:cover;width:24px;height:24px;background-image:url(' +
                    chrome.extension.getURL('/images/') + 'pitch.png);"></div>');

                $speedButton.add($pitchButton).css({
                    'float': 'left',
                    backgroundColor: 'white',
                    margin: 2,
                    border: '1px solid gray',
                    cursor: 'pointer'
                })
                $pitchButton.on('click', pitchButtonClick)
                $('.buttons', $html).append($speedButton).append($pitchButton)
                $('.text', $html).html(scope.text);
                var d = new Dialog({
                    html: $html,
                    title: 'Speak',
                    closeOnClick: true,
                    namespace: 'tts',
                    onClose: function() {
                        chrome.runtime.sendMessage({
                            data: 'speak-stop'
                        })
                    },
                    ui: 'dialog'
                })
                d.show()
                respeak();
            };

            var respeak = function() {
                chrome.runtime.sendMessage({
                    data: 'speak',
                    gender: 'male',
                    rate: scope.storageGet('speed', 1),
                    pitch: scope.storageGet('pitch', 1),
                    message: scope.text,
                });
            };

            var pitchButtonClick = function() {
                var pitch = scope.storageGet('pitch', 0) + 1
                if (pitch > 2) pitch = 1
                scope.storageSet('pitch', pitch)
                // console.log(pitch)
                respeak();
            }

            var speedButtonClick = function() {
                var speed = scope.storageGet('speed', 1) + 1
                if (speed > 2) speed = 1
                scope.storageSet('speed', speed)
                // console.log(speed)
                respeak();
            }
            init()
        }
    },

    {
        name: 'Edit text',
        closeOnClick: true,
        key: 'edittext',
        onclick: function(scope) {
            scope.applyClass('editthiscontent');
            window.getSelection().empty()
            $('.editthiscontent').attr('contenteditable', true).removeClass('.editthiscontent')[0].focus();
        }
    }, {
        name: 'Enlarge Text',
        key: 'enlarge',
        closeOnClick: false,
        onclick: function(scope) {
            var randomCssClass = "rangyTemp_" + (+new Date());
            scope.applyClass(randomCssClass)
            var current = parseFloat($('.' + randomCssClass).css('zoom'))
            newZoom = current ? current + 0.2 : 1.2
            $("." + randomCssClass).css({
                "zoom": newZoom
            }) //.attr('contentEditable',true).removeClass(randomCssClass);;
        }
    }, {
        name: 'Ensmall text',
        closeOnClick: false,
        key: 'ensmall',
        onclick: function(scope) {
            var randomCssClass = "rangyTemp_" + (+new Date());
            scope.applyClass(randomCssClass)
            var current = parseFloat($('.' + randomCssClass).css('zoom'))
            newZoom = current ? current - 0.2 : 1.2
            $("." + randomCssClass).css({
                "zoom": newZoom
            }) //.attr('contentEditable',true).removeClass(randomCssClass);;
        }
    }, {
        name: 'highlight text',
        key: 'highlight',
        onclick: function(scope) {
            scope.applyClass('tb_highlight');
        }
    }, {
        name: 'Erase text',
        key: 'erase',
        closeOnClick: true,
        onclick: function(scope) {
            applyClass('tb_hide');
            window.getSelection().empty()
        }
    },

    {
        name: 'Help',
        key: 'help',
        onclick: function(scope) {
            var html, $html;
            html = chrome.i18n.getMessage('selectionbar_help')
            html = html.replace(/\r\n/g, '<br />')
            html = html.replace(/SelectionBar/g, 'SelectionBar&trade;')
            $html = $('<div>').html(html)
            var d = new Dialog({
                html: $html,
                title: 'Webpage Screenshot bar - WSB',
                closeOnClick: true,
                ui: 'dialog'
            })
            d.show()
        }
    }


]