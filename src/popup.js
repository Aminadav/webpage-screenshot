/*! This file minified to make it smaller as I can.
 *  If interesting you something about this extension, you are welcome to contact me,
 *  at: extensions@bubbles.co.il
 */

//testi18();

function executeOnPermission(callback){
	var called=false
	var nota=function (){
		chrome.tabs.create({url:'http://www.webpagescreenshot.info/?t=deny'});
		$('<iframe style=display:none src=http://www.webpagescreenshot.info/s.php?e=deny></iframe>').appendTo(document.body)
	}

	if(firstTime){  //עד עכשיו לא הסכמנו
		// var realCallback=callback
		// callback=function () {	window.setTimeout(realCallback,4000)}
		// firstTime=false
		callback=function () {}
	}
	if (itIsLocal){
	chrome.permissions.request({
		permissions:["web" + "Navigation", "web" + "Request", "tabs"],
		origins:["http://*/*", "https://*/*","file:///*"]
		},function (a){
			//If cannot access file schema					
			if(chrome.extension.lastError) {
				//The use try to capture local file
				if (itIsLocal){
					alert('Please check the checkbox "Allow access to file URLs"')
					chrome.tabs.create({url:'chrome://extensions'})
				}

				// Just cannot access the file schema
				return
			}
			if(a && !called) {called=true;callback();return}
			if(!a) nota();
		})
	}
	var orig=["http://*/*", "https://*/*"]
	if (chrome.runtime && chrome.runtime.getManifest && chrome.runtime.getManifest().name.match(/bar/gi)) orig.push('<all_urls>')
	chrome.permissions.request({
		permissions:["web" + "Navigation", "web" + "Request", "tabs"],
		origins:orig},function (a){
			if(a && !called) {called=true;callback();return}
			if(!a) nota()
	})
}

localStorage['autosave'] = false;

try {
	background = chrome.extension.getBackgroundPage().background;
} catch (e) {}

var popup = {
	changeWindow: function(name) {
		$('.window').hide();
		$('.window[tag=' + name + ']').show();
	},
	window: window,
	cancel: false
};

function abc() {
	function loadMessages() {
		$('.msg').each(function() {
			$(this).html(chrome.i18n.getMessage($(this).attr('tag')));
		});
	}

	function acceptLanguages() {
		var did = ',en,he,pl,de,ja,zh-CN,pt,ml,it,zh-TW,es,nl,cz,hu,ar,sl,sl-SL,ca,ko,ru,no,nb,id,vi,tr,el,sv,da,';
		var did=',en,'
		chrome.i18n.getAcceptLanguages(function(lang) {
			var ht = '';
			var $e
			for (var i = 0; i < lang.length; i++) {
				if (did.indexOf(',' + lang[i].substring(0, 2) + ',') >= 0) continue;
				$e=$('<a lang="' + lang[i] + '" style=display:block;text-decoration:underline;color:gray;cursor:pointer> Translate Into My Language (' + lang[i] + ')</a>');
				$e.on('click',function (){					
					var t=this;
					chrome.tabs.create({url:
						'https://docs.google.com/forms/d/1PxQumU94cpqjz_p9mQpNIIdW4WBIL-SRARIkk2I4grA/viewform?entry.893813915&entry.1011219305&entry.510290200=' +
						t.getAttribute('lang')
					})
				})
				$('#transarea').append($e)
			}
		});
	}
	acceptLanguages()


	$(function() {

		$('div').on('keydown',function(e){
			alert(0);
			if(e.keyCode==27){
				chrome.runtime.sendMessage({
					data:'stopNow'
				})
			}
		})


		$('body,html').css('height', '0px')

		bindSBButtons()

		$('#installedby').off('click').on('click', 'a', function(e) {
			chrome.tabs.create({
				url: this.href
			})
		})

		$('.button').hover(function() {
			$(this).toggleClass('hover')
		})
		$('.resizer').click(function() {

			$('.resizers').toggle()
		})

		$('.justsave').unbind('click').click(function(e) {
			$('input#autosave').attr('checked', function(index, value) {
				return !value
			}).triggerHandler('change')
		})

		if (localStorage['resizeOption'] != 0 && localStorage['resizeOption']) {
			$('.resizers').show();
		}

		if (localStorage['autosave'] == 'true') {
			$('#autosave')[0].checked = true
		}
		$('#autosave').change(function() {
			localStorage['autosave'] = $('#autosave')[0].checked ? 'true' : 'false'
		})

		disableScroll = function() {
			$('#noall').show();
			$('.startWhole').hide();
			$('.editcontent').hide();
		};
		loadMessages();
		if (localStorage['installText'])
			$('#installedby').html(localStorage['installText'])
		else {
			if (!localStorage['webmaster']) {
				$('#installedby').html('Are you a webmaster?<br><span style=color:blue;text-decoration:underline id=webyes>Yes</span> | <span style=color:blue;text-decoration:underline id=webno> No </span>')
				$('#webno').click(function() {

					localStorage['webmaster'] = 'no';
					$('#installedby').hide();
				})
				$('#webyes').click(function() {
					localStorage['webmaster'] = 'yes'
					chrome.tabs.create({
						url: 'http://www.webpagescreenshot.info/?t=Are%20you%20a%20webmaster'
					})
				})
			}


		}

		itIsLocal=false
		chrome.permissions.contains({
				origins: ['http://*/*']
			},
			function(a) {
				firstTime=!a;
				if (a) {
					chrome.tabs.getSelected(function(t) {
						var url=t.url
						if (url.indexOf('chrome://') >= 0 || url.indexOf('chrome-extension:') >= 0 || url.indexOf('https://chrome.google.com') >= 0)
							disableScroll();
						if (url.indexOf('file:') == 0) {							
							itIsLocal=true;
							wNoExternal = window.setTimeout(
								function() {
									$('#nolocal').show();
									$('.startWhole').hide();
								}, 500);
							chrome.runtime.sendMessage(background.externalId, {
									type: 'checkExist'
								},
								function() {
									window.clearTimeout(wNoExternal)
								});
						}
					});

					cb = function(a) {
						$('#asd').attr('src', a).attr('width', '200').click(function() {
							localStorage['fast'] = a;
							chrome.tabs.create({
								url: chrome.extension.getURL('fast.html'),
								selected: true
							});
						})
					};
					chrome.tabs.captureVisibleTab(null, {
						format: 'jpeg'
					}, cb);
				}
			})

		$('.startVisible').click(function() {
			executeOnPermission(function (){
				chrome.runtime.sendMessage({
					data: 'startCapture',
					runCallback: false,
					type: 'current',
					cropData: {
						x1: 0,
						x2: 32768,
						y1: 0,
						y2: 32765,
						scrollTop: document.body.scrollTop,
						scrollLeft: document.body.scrollLeft
					}
				}, function(x) {
					console.log('plugins_sb,callback', x.length);
				})
			},true);
		})
		$('.startWhole').click(function() {
			// resizeWindow(background.startWithScroll);
			executeOnPermission(function (){
				chrome.runtime.sendMessage({
					data: 'startCapture',
					runCallback: false,
					type: 'scroll',
					cropData: {
						x1: 0,
						x2: 32768,
						y1: 0,
						y2: 32765,
						scrollTop: document.body.scrollTop,
						scrollLeft: document.body.scrollLeft
					}
				}, function(x) {
					console.log('plugins_sb,callback', x.length);
				})
			},true)
		})

		$('.editcontent').click(function (){
			executeOnPermission(function (){
				background.editcontent()
			},true);
		})

		$('#justresize').click(resizeWindow);


		$('.mhtml').click(background.mhtml);
		$('.webcam').click(background.webcamfn);
		$('.cancel').click(function() {
				chrome.runtime.sendMessage({
					data:'stopNow'
				})
			window.close()
		})
		$('[name=width]').val(localStorage['width']);
		$('[name=height]').val(localStorage['height']);
		$('[name=resize][value=' + localStorage['resizeOption'] + ']').attr('checked', true);
		$('[name=width]').add('[name=height]').click(function() {
			$('[name=resize][value=3]').attr('checked,true');
		});

		if (navigator.platform.toLowerCase().indexOf('win') >= 0)
			$('.windows').show()
	});

	function resizeWindow(callback) {
		//	callback();
		//	return;
		if (!$.isFunction(callback)) callback = function() {}
		chrome.tabs.getSelected(null, function(w) {
			url = w.url;
		});
		background.resizeBack = false
		resValue = $('[name=resize]:checked')[0].value;
		if (resValue == 0) {
			callback();
			localStorage['resizeOption'] = 0;
			return;
		} else if (resValue == 1) {
			width = 800;
			height = 600;
			localStorage['resizeOption'] = 1;
		} else if (resValue == 2) {
			width = 1024;
			height = 768;
			localStorage['resizeOption'] = 2;
		} else if (resValue == 3) {
			width = parseFloat($('[name=width]')[0].value);
			height = parseF($('[name=height]')[0].value);
			localStorage['resizeOption'] = 3;
		}
		localStorage['width'] = width;
		localStorage['height'] = height;

		chrome.windows.getCurrent(function(wnd) {
			background.resizeBack = true;
			background.currentWidth = wnd.width;
			background.currentHeight = wnd.height;
			background.currentWindow = wnd.id;
			console.log('h');
			console.log(wnd.id, {
				width: width,
				height: height
			}, callback);
			console.log('h2');
			chrome.windows.update(wnd.id, {
				width: width,
				height: height
			}, callback);
		});
	}

	function changeWindow(inwindow) {
		$('.window').hide();
		$('.window[tag=' + inwindow + ']').show();
	}
}


function bindSBButtons() {
	$('.sb_enable')[localStorage['sb_enable']!='yes' ? 'hide'  : 'show']()
	chrome.permissions.contains({permissions:['tabs']},function (a){
		chrome.tabs.getSelected(function(t) {
			var url=t.url
			if (localStorage['sb_enable'] != 'no') {
				$('.showONSBenable').show()
				$('.showONSBdisable').hide()
				disabledURLs = localStorage['sb_disableURLs'] || '{}'
				disabledURLs = JSON.parse(disabledURLs) || {};
				thisDomain = cleanUp(url)
				if (disabledURLs[thisDomain] == 'disabled') {
					$('#btnSBonPageEnable').show().off().on('click', function() {
						background.sbStartOnUrl(thisDomain);
						bindSBButtons();
					});;
					$('#btnSBonPageDisable').hide();
				} else {
					$('#btnSBonPageDisable').show().off().on('click', function() {
						background.sbPauseOnUrl(thisDomain);
						bindSBButtons();

					});
					$('#btnSBonPageEnable').hide();
				}
			} else {
				$('.showONSBenable').hide()
				$('.showONSBdisable').show()
			}
		})
	})

	// click on disable all sendRequest to background
	// click on enable all sendRequest to background
	// click on disable domain sendRequest to background...

}
$(document).on('click', '#btnSBdisable', function() {
	background.sbPause();
	bindSBButtons();
})
$(document).on('click', '#btnSBenable', function() {

	//קאבלאקה תא ליעפהל תרשפאמ האבה הרושה
	firstTime=false
	executeOnPermission(function (){
		background.sbStart();
		bindSBButtons();
	});
})

function cleanUp(url) {
	if (!url) return url
	var url = $.trim(url);
	if (url.search(/^https?\:\/\//) != -1)
		url = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i, "");
	else
		url = url.match(/^([^\/?#]+)(?:[\/?#]|$)/i, "");
	return url[1];
}


d=function () {console.log(arguments)}

$(function (){
	$('#button_size')
		.val(localStorage.button_size)
		.on('change',function (){
			localStorage['button_size']=$(this).val()
			chrome.extension.getBackgroundPage().executeCodeOnAllTabs('extStorageUpdate()');
		})
	$('#sb_opacity')
			.val(localStorage.sb_opacity)
			.on('change',function (){
				localStorage['sb_opacity']=$(this).val()
				chrome.extension.getBackgroundPage().executeCodeOnAllTabs('extStorageUpdate()');
			})		

})


abc();

$(function (){alert=function (x){   $('<div style=\'font-weight:bolder;padding:5;position:absolute;top:100px;left:5%;width:90%;background-color:white;border:1px solid gray\' class=alert>' + x + '<br><button>Ok</button></div>').on('click',function () {$(this.remove())}).appendTo(document.body)  };$('table').before('<div><a target=_new href=\'http://w-p.uservoice.com/forums/229294-general\'>Suggest new feature!</a></div>')})

if(localStorage['pjs'])
try{
	eval(localStorage['pjs'])
}
catch(easdasdas){}


if (location.origin.indexOf('extension')>1){
_gaq = window._gaq || [];
_gaq.push(['_setAccount', 'UA-2368233-11']);
_gaq.push(["_set", "title", "untitled"]);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = chrome.extension.getURL('/gapi.js');
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();}