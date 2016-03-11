
var cropperLoaded=false;
var removeClip;
var cropperLoadTime = Date.now();
var cropperOpen = false;
function loadCropper () {
		if (cropperLoaded) {
			return;
		}
		cropperLoaded=true;

		removeClip = function() {
			if (window.crop && window.crop.icons && Date.now() - cropperLoadTime > 1000 ) {
				removeClipInstant();
				cropperOpen = false;
			}
		};
		function removeClipInstant() {
			window.crop.icons.detach();
			$('#crop_helper').add('.crop_handle').remove();
			$(document).off('.removeCrop');
		}

		showCropOverFlow=function() {
			removeClipInstant();
			var minWidth = 60
			var minHeight = minWidth
			if (window.crop.y2 - window.crop.y1 < minHeight) window.crop.y2 = window.crop.y1 + minHeight
			if (window.crop.x2 - window.crop.x1 < minWidth) window.crop.x2 = window.crop.x1 + minWidth

			if (window.crop.x1 < 0) window.crop.x1 = 0
			if (window.crop.y1 < 0) window.crop.y1 = 0
			if (window.crop.y2 < 0) window.crop.y2 = 0
			if (window.crop.x2 > $(document).width() - 5) window.crop.x2 = $(document).width() - 5
			if (window.crop.y2 > $(document).height() - 5) window.crop.y2 = $(document).height() - 5

			x1 = window.crop.x1
			x2 = window.crop.x2
			y1 = window.crop.y1
			y2 = window.crop.y2

			// objects_hide();
			if (x1 < x2) {
				rx1 = x1;
				rx2 = x2;
			} else {
				rx1 = x2;
				rx2 = x1;
			}
			if (y1 < y2) {
				ry1 = y1;
				ry2 = y2;
			} else {
				ry1 = y2;
				ry2 = y1;
			}
			x1 = rx1;
			x2 = rx2;
			y1 = ry1;
			y2 = ry2;


			$('<div id=crop_helper><div id=crop_center></div><div id=crop_helper_bottom></div><div id=crop_helper_left></div><div id=crop_helper_top></div><div id=crop_helper_right></div></div>').appendTo(document.body);


			$('#crop_helper').css({
				// position:'absolute',
				// width:'100%',
				// height:'100%',
				// top:'0px',
				// left: -  ($(document).width() - $(document.body).width()) + 'px'
			})
			if (window.crop.move) $('#crop_helper').css('cursor', window.crop.move + '-resize');
			$('#crop_helper *').css({
				'background-color': 'blue',
				'opacity': '0.8',
				'position': 'absolute',
				'z-index': 10000
			});
			$('#crop_helper_left').css({
				'background-color': '000',
				left: 0,
				top: 0,
				width: x1,
				height: $(document).height()
			});
			$('#crop_helper_top').css({
				'background-color': '000',
				left: x1,
				top: 0,
				width: x2 - x1,
				height: y1
			});
			$('#crop_helper_bottom').css({
				'background-color': '000',
				left: x1,
				top: y2,
				width: x2 - x1,
				height: $(document).height() - y2
			});
			$('#crop_helper_right').css({
				'background-color': '000',
				left: x2,
				top: 0,
				width: $(document).width() - x2,
				height: $(document).height()
			});
			$('#crop_center').css({
				'background-color': '',
				cursor: 'move',
				left: x1,
				top: y1,
				width: x2 - x1,
				height: y2 - y1
			});
			$('#crop_center').data('cord', {
				x1: x1,
				x2: x2,
				y1: y1,
				y2: y2
			});


			hw = 8
			e = $('<div class=crop_handle></div>').css({
				width: hw,
				height: hw,
				'background-color': 'black',
				position: 'absolute',
				'z-index': 10001
			})
			obj = {
				'ne': {
					x: x2 - hw,
					y: y1
				},
				'nw': {
					x: x1,
					y: y1
				},
				'se': {
					x: x2 - hw,
					y: y2 - hw
				},
				'sw': {
					x: x1,
					y: y2 - hw
				},
				'n': {
					x: x1 + (x2 - x1) / 2,
					y: y1
				},
				's': {
					x: x1 + (x2 - x1) / 2,
					y: y2 - hw
				},
				'w': {
					y: y1 + (y2 - y1) / 2,
					x: x1
				},
				'e': {
					y: y1 + (y2 - y1) / 2,
					x: x2 - hw
				}
			};
			var icons = window.crop.icons;
			// icons.hide();
			icons.css({
				'z-index': 10005,
				position: 'absolute'
			}).appendTo('#crop_helper')
			// .position({
			// 	my: 'right top',
			// 	at: 'right bottom+6',
			// 	of: $('#crop_center')
			// });
			position1 = {
				left: $('#crop_center').offset().left,
				top: $('#crop_center').offset().top + $('#crop_center').height() + 10,
				position: 'static'
			}
			position2 = {
				left: $('#crop_center').offset().left,
				top: $('#crop_center').offset().top - icons.height() - 10,
				position: 'static'
			}
			// console.log(icons.width())
			position3 = {
				left: ($(window).width() - icons.width()) / 2,
				top: 0,
				position: 'fixed'
			};
			position = position3
			icons.css({
				left: position.left,
				top: position.top,
				position: position.position
			})

			for (var i in obj)
				e.clone().data('cord', i).css({
					left: obj[i].x,
					top: obj[i].y,
					cursor: i + '-resize'
				}).appendTo( $('#crop_helper') );
		}
		$(document).on('keyup', function(e) {
			removeClip()
		});
		$(document).on('click', 'div[id*=crop_helper_]', function() {
			removeClip()
		})

		scrollOnMove=function(e) {
			if (e.pageY > document.body.scrollTop + $(window).height() - 30)
				document.body.scrollTop += 30
			if (e.pageY < document.body.scrollTop + 30)
				document.body.scrollTop -= 30
		}

		$(document).on('mousedown', '#crop_center', function(e) {
			$(document).on('mousemove.cropcenter', function(e) {
				if (window.crop.startX) {
					window.crop.x1 += e.pageX - window.crop.startX
					window.crop.x2 += e.pageX - window.crop.startX
					window.crop.y1 += e.pageY - window.crop.startY
					window.crop.y2 += e.pageY - window.crop.startY
				}
				showCropOverFlow();
				window.crop.startX = e.pageX
				window.crop.startY = e.pageY
				scrollOnMove(e);
				e.stopPropagation();
				return false
			})
			$(document).on('mouseup.cropcenter', function(e) {
				window.crop.startX = null
				window.crop.startY = null
				$(document).off('.cropcenter');
				e.stopPropagation();
				return false
			})
		})
		$(document).on('mousedown', '.crop_handle', function(e) {
			var lastScreenX, lastScreenY;
			scrollOnMove(e)
			$(document).on('mousemove.handle', {
				cord: $(e.target).data('cord')
			}, function(e) {
				if (lastScreenX) {
					var dirX = lastScreenX < e.screenX ? 'right' : 'left'
					var dirY = lastScreenY < e.screenY ? 'down' : 'up'
				}
				lastScreenX = e.screenX;
				lastScreenY = e.screenY;
				cord = e.data.cord
				if (cord == 'se') {
					window.crop.x2 = e.pageX;
					window.crop.y2 = e.pageY
				}
				if (cord == 'sw') {
					window.crop.x1 = e.pageX;
					window.crop.y2 = e.pageY
				}
				if (cord == 'nw') {
					window.crop.x1 = e.pageX;
					window.crop.y1 = e.pageY
				}
				if (cord == 'ne') {
					window.crop.x2 = e.pageX;
					window.crop.y1 = e.pageY
				}
				if (cord == 'w') {
					window.crop.x1 = e.pageX;
				}
				if (cord == 'e') {
					window.crop.x2 = e.pageX;
				}
				if (cord == 'n') {
					window.crop.y1 = e.pageY;
				}
				if (cord == 's') {
					window.crop.y2 = e.pageY;
				}
				window.crop.move = cord
				scrollOnMove(e)
				showCropOverFlow()
				e.stopPropagation();
				return false
			})
			$(document).on('mouseup.handle', function(e) {
				window.crop.move = null
				showCropOverFlow()
				$(document).off('.handle');
				e.stopPropagation();
				return false
			})
			e.stopPropagation();
			return false
		});
}


function load_cropper_without_selection(rect) {
	loadCropper();
	if (cropperOpen) {
		return ;
	}
	removeClip();
	cropperOpen = true;
	cropperLoadTime = Date.now();
	window.crop = rect || {
		x1:document.body.scrollLeft+300,
		x2:document.body.scrollLeft+600,
		y1:document.body.scrollTop+300,
		y2:document.body.scrollTop+600
	};

	$('html').css('position','inherit');
	var $toolbar = $('<div class=ws-styles><table style="border: 0;"><tr style="border: 0;vertical-align: middle"><td style="border: 0;vertical-align: middle"><button class="open msg" style="margin:1px;color:black;background-color:white;cursor:pointer;font-size:1em;border: 1px solid #999; border-radius: 4px;padding: 3px 9px;" tag=open></button>' +
	'<button class="save msg" style="margin:1px;color:black;background-color:white;cursor:pointer;font-size:1em;border: 1px solid #999; border-radius: 4px;padding: 3px 9px;" tag=save></button>' +
	'<button class="share msg" tag=share style="margin:1px;color:black;background-color:white;cursor:pointer;font-size:1em;border: 1px solid #999; border-radius: 4px;padding: 3px 9px;"></button></td><td style="border: 0;vertical-align: middle"><div class=realToolbar></div></td></tr></table></div>');

	jQuery('.msg', $toolbar).each(function() {
		jQuery(this).html(chrome.i18n.getMessage(jQuery(this).attr('tag')));
	});
	var $realToolbar = $('.realToolbar', $toolbar);

	window.crop.icons = $toolbar;
	plugins_to_show = defaultPlugins.slice();
	plugins_to_show = $.grep(plugins_to_show, function(o) {
		return (
			// o.key!='openscreenshot' &&
		o.key != 'googledrive'
		)
	})
	$('button.open', $toolbar).on('click', function() {
		removeClip();
		chrome.runtime.sendMessage({
			data: 'captureAll',
			showScrollBar: true,
			disableHeaderAndFooter: true,
			processFixedElements: false,
			cropData: {
				x1: x1,
				x2: x2,
				y1: y1,
				y2: y2,
				scrollTop: document.body.scrollTop,
				scrollLeft: document.body.scrollLeft
			}
		})
	});
	$('button.save', $toolbar).on('click', function() {
		$('[plugin-key=save]').trigger($.Event({
			type: 'click'
		}))
	});

	// $('button.open',$toolbar).on('click',function (){
	// 	$('[plugin-key=open]').trigger($.Event({type:'click'}))
	// })

	$('button.share', $toolbar).on('click', function() {
		$('[plugin-key=openscreenshot]').trigger($.Event({
			type: 'click'
		}));
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
				data: 'captureAll',
				runCallback: true,
				keepIt: true,
				showScrollBar: true,
				disableHeaderAndFooter: true,
				processFixedElements: false,
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
	});
	showCropOverFlow();
}