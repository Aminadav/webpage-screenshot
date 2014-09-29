
var cropperLoaded=false
loadCropper=function(){
		loadjQuery();
		if(cropperLoaded) return;
		cropperLoaded=true;

		removeClip=function() {
			// objects_show();
			if(window.crop)
				if(window.crop.icons){
				window.crop.icons.detach();
				$('#crop_helper').add('.crop_handle').remove();
				$(document).off('.removeCrop');
			}
		}

		showCropOverFlow=function() {
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
			removeClip()
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
				},
			}
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
			//if (e.keyCode == 27)
			removeClip()
		})
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
		})

}