function appendStyle(x,media){
	style=document.createElement('style');
	if(media) style.media=media
	style.innerText=x;
	if(document.body)
		document.body.appendChild(style);
	else
		$('body').append(style)
}
Math.distance=function (x1,y1,x2,y2){var xs=0;var ys=0;xs=x2-x1;xs=xs*xs;ys=y2-y1;ys=ys*ys;return Math.sqrt(xs+ys);}



function createToolBarHTML(){
	buttons=[{
		id:'btn_search',
		text:'s'
		},{
		id:'btn_highlight',
		text:'Ht'
		},{
		id:'btn_hide',
		text:'Hd'
		},{
		id:'btn_enlarge',
		text:'e'
		},{
		id:'btn_copy',
		text:'c'
		},{
		id:'btn_crop',
		text:'crop'
		},{
		id:'btn_editcontent',
		text:'edit'
		},{
		id:'btn_print',
		text:'print'
		}
	]
	html= '<table cellSpacing=0 cellPadding=0 style=background-color:#ccc class=myToolbar><tr>'
	for(i in buttons){
		html+='<td id="' + buttons[i].id + '" class="tb_btn ' + buttons[i].id + '"">';
		html+=buttons[i].text
		html+='</td>'
	}
	html+='</tr></table>'
	return html
}
// document.addEventListener('selectionchange',function (){
// 	$('#myToolbar').remove();
// 	selection=document.getSelection();
// 	if (selection.type=='Range'){
// 		range=selection.getRangeAt(0);
// 		rect=range.getBoundingClientRect()
// 		toolbarHTML=createToolBarHTML();
// 		toolbarElement=$(toolbarHTML);
// 		$('<div></div>').appendTo(document.body).css({
// 			position:'absolute',
// 			border:'1px solid blue',
// 			left:rect.left,
// 			width: rect.width,
// 			height: rect.height
// 		})
// 		toolbarElement.position({
// 			collision:'flipfit',
// 			my:'right top',
// 			at:'right bottom',

// 		})

// 	}
// })
//
x=0;
$(function (){
	appendStyle('.myToolbar .tb_btn {cursor:pointer;border:1px solid #555;padding:3px}   .tb_highlight{background-color:yellow} .tb_hide {visibility:hidden}')
})

function exec(fn) {
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = fn
	document.documentElement.appendChild(script); // run the script
	document.documentElement.removeChild(script); // clean up
}
$(function (){
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.src = chrome.extension ? chrome.extension.getURL('Zero.js') : 'Zero.js'
	document.documentElement.appendChild(script); // run the script
	document.documentElement.removeChild(script); // clean up
})

$(document).on('mousedown',function (se){
	removeToolbar=function (){
		$('.myToolbar').remove();
		$(window).off('resize.tb');
		$(document).off('.tb');
	}
	removeToolbar();
	$(document).one('mouseup',function (ee){
			y=true;
			selection=document.getSelection();
			rangy.init();
			if (selection.type!='Range') {removeToolbar();return};
			text=selection.toString()
			numOfWords=text.replace(/\t|\n|\r|\-/g,' ').replace(/ {2,100}/g,' ').trim().split(' ').length;
			toolbarHTML=createToolBarHTML();
			$toolbar=$(toolbarHTML);

			//Select buttons to Show
			$('.btn_search',$toolbar)[numOfWords<10 ?'show':'hide']();
			$toolbar.appendTo(document.body).css('position','absolute');

			if(ee.pageY>se.pageY)
				t=ee.pageY+15
			else
				t=ee.pageY-$toolbar.height()-15
			if(ee.pageX>se.pageX)
				left=ee.pageX+15
			else
				left=ee.pageX-$toolbar.width()-15

			if (t<0) t=ee.pageY-$toolbar.height()-15
			if (left<document.body.scrollLeft) left=document.body.scrollLeft
			if(t<document.body.scrollTop) document.body.scrollTop-=30
			$toolbar.css({left:left,top:t,position:'absolute'});

			exec('ZeroClipboard.setMoviePath( "'  +  (chrome.extension ? chrome.extension.getURL('ZeroClipboard.swf') : 'ZeroClipboard.swf') + '" )' );
			exec("clip=new ZeroClipboard.Client( );");
			exec("clip.glue( 'btn_copy')");
			exec("clip.setText(' "  +  text.replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\'/g,"\\'").replace(/\"/g,'\\"')  + "' )");
			exec("clip.addEventListener( 'mouseOver', function() {document.body.setAttribute('clipOver',true)})   ");
			exec("clip.addEventListener( 'mouseOut', function() {document.body.removeAttribute('clipOver')})   ");

			 // $('.btn_copy').attr('data-clipboard-target','hello');
			// if (!window.clip) {
			// 	clip.on('load',function () {

			// 		console.log('loaded')
			// 		// alert(text)
			// 		this.reposition();
			// 	})
			// }
			// else{
			// 	console.log('rep');
			// //	clip.setText(text);
			// 	clip.reposition();
			// }

			//window.setInterval(function () {clip.reposition},1000)
			$(window).on('resize.tb',function () {clip.reposition()});

			$toolbar.css('opacity',0.5);
			centerX=$toolbar.width()/2 + $toolbar.position().left
			centerY=$toolbar.height()/2 + $toolbar.position().top
			$(document).on('mousemove.tb',function (mme){
				clipOver=$(document.body).attr('clipOver')
				//console.log(centerX,centerY,mme.pageX,mme.pageY);
				dif= Math.distance(centerX,centerY,mme.pageX,mme.pageY);
				if (dif>130){
					$(document).off('.tb');
					removeToolbar();
				}
				else{
					opacity= (130-dif)/130*2;
					if(clipOver) opacity=1
					$toolbar.css('opacity',opacity);
				}
			})
			$toolbar.on('mousemove',function (e){
				$toolbar.css('opacity',1);
				e.stopPropagation();
				return false
			})
			$('.tb_btn',$toolbar).on('mousedown mouseup',function (e){
				e.stopPropagation(); //Dont hide me because of mouse up.
				return false // Dont remove the selection
			})
			$('.btn_search',$toolbar).one('click',function (){
				window.open('http://www.google.com/search?q=' + text,'_blank');
			})

			$('.btn_highlight',$toolbar).one('click',function (){
				applyClass('tb_highlight');
				window.getSelection().empty()
				removeToolbar();
			})
			$('.btn_editcontent',$toolbar).one('click',function (){
				applyClass('editthiscontent');
				window.getSelection().empty()
				removeToolbar();
				$('.editthiscontent').attr('contenteditable',true).removeClass('.editthiscontent')[0].focus();
			})
			$('.btn_hide',$toolbar).one('click',function (){
				applyClass('tb_hide');
				window.getSelection().empty()
				removeToolbar()
			})
			$('.btn_crop',$toolbar).one('click',function (){
				rect=window.getSelection().getRangeAt(0).getBoundingClientRect()
				window.getSelection().empty()
				removeToolbar()

				window.crop={}
				window.crop.x1=rect.left + document.body.scrollLeft
				window.crop.y1=rect.top + document.body.scrollTop
				window.crop.x2=rect.width + window.crop.x1
				window.crop.y2=rect.height + window.crop.y1
				window.crop.icons=$('<span><button>Copy Image</button><button>Open Editor</button></span>')
				showCropOverFlow()
			})
			$('.btn_print',$toolbar).one('click',function (){
				rect= ''
				window.getSelection().empty()
				// $(document.body).wrapInner('<bbb>');
				// $(document.body).wrapInner('<ccc>');
				$('body').wrap('<ccc><bbb>')
				media="screen,temp"
				// cutHeight= (parseInt($(document.body).css('marginTop'))   -   (rect.top + document.body.scrollTop))
				// cutWidth= (parseInt($(document.body).css('marginLeft'))   -   (rect.left + document.body.scrollLeft))
				// appendStyle( 'body {margin-top:' + cutHeight + '!important}',media)
				// appendStyle( 'bbb {height:' + (rect.height-cutHeight   )+   'px;position:absolute;overflow:hidden}',media)
				// appendStyle( 'body {margin-left:' + cutWidth + '!important}',media)

				// appendStyle( 'bbb {width:' + $(document.body).css('width')  +   ';position:absolute;overflow:hidden}',media)

				// appendStyle( 'ccc {height:' +  (rect.height-cutHeight   )  +   'px;position:absolute;overflow:hidden}',media)
				// appendStyle( 'ccc {width:' +   (rect.width-cutWidth   )  +   'px;position:absolute;overflow:hidden}',media)

				cutTop= rect.top + $('body').scrollTop()
				cutLeft= rect.left + $('body').scrollLeft()
				bodyWidth=$("body").css('width')
				// cutWidth= (parseInt($(document.body).css('marginLeft'))   -   (rect.left + document.body.scrollLeft))

				appendStyle( 'bbb {margin-top:-' + cutTop + 'px;position:absolute}',media)
				appendStyle( 'bbb {height:' + (rect.height+cutTop   )+   'px;position:absolute;overflow:hidden}',media)

				appendStyle( 'bbb {margin-left:-' + cutLeft  + 'px}',media)
				appendStyle( 'bbb {width:' + bodyWidth  +   ';position:absolute;overflow:hidden}',media)

				appendStyle( 'ccc {height:' + rect.height +   'px;position:absolute;overflow:hidden}',media)
				appendStyle( 'ccc {width:' +   rect.width  +   'px;position:absolute;overflow:hidden}',media)

				// console.debug('styleSheetsLength')
				// $('link[media=print]').remove()
				// $('link[media*=screen]').attr('media','print,screen')
				// for (var x=0; x<document.styleSheets.length;x++){
				// 	console.groupCollapsed('styleSheet-' + x,document.styleSheets[x])
				// 	if(document.styleSheets[x].rules){
				// 		for (var i=0; i<document.styleSheets[x].rules.length;i++) {
				// 			console.groupCollapsed('rule-(' + x + ')-' +i +  document.styleSheets[x].rules[i])
				// 			console.debug(document.styleSheets[x].rules[i])
				// 			if(document.styleSheets[x].rules[i].media){
				// 				for(var j=0;j<document.styleSheets[x].rules[i].media.length;j++){
				//  					if (document.styleSheets[x].rules[i].media[j].indexOf('print')>-1)
				//  						document.styleSheets[x].rules[i].media.mediaText='nothing'
				//  					if (document.styleSheets[x].rules[i].media[j].indexOf('screen')>-1)
				//  						document.styleSheets[x].rules[i].media.mediaText='print,screen'
				//  				}
				//  			}
				// 			console.groupEnd();
				// 		}
				// 	}
				// 	console.groupEnd()
				// }
				removeToolbar()
				window.onfinish=function(){
					$('body').unwrap().unwrap()
					$('style[media*=temp]').remove();
					window.onfinish=null
				}
				chrome.runtime.sendMessage({data:'startCapture',type:'scroll'});
				window.setTimeout(function (){
					// $('body').unwrap().unwrap()
					// window.setTimeout(function () {location.reload()},6000)
				},6000)
				//window.print();


				//window.print();

			})
			$('.btn_enlarge',$toolbar).on('click',function (){
				var randomCssClass = "rangyTemp_" + (+new Date());
				applyClass(randomCssClass)
				current=parseFloat(   $('.' + randomCssClass) .css('zoom'))
				newZoom=current?current+0.2 : 1.2
				 $("." + randomCssClass).css( {"zoom": newZoom} )//.attr('contentEditable',true).removeClass(randomCssClass);;
			})
			// clip.on('mouseover',function (){
			// 	console.log('over');
			// 	$toolbar.data('clipOver',true)
			// })
			// clip.on('mouseout',function (){
			// 	console.log('out');
			// 	$toolbar.data('clipOver',false)
			// })
			// clip.on('complete',function (){
			// 	console.log('c');
			// 	removeToolbar();
			// })
			// clip.on('mousedown',function (){
			// 	removeToolbar();
			// })
			// clip.on('mouseup',function (){
			// 	removeToolbar();
			// })

	})
})


//testi

// function a(){
// 	t=15
// 	myFunc= function (){
// 		alert('t=' + t)
// 	}
// 	t++;
// 	f2=function (){
// 		t++;
// 	}
// 	return [myFunc,f2]
// }

// (function(){
// 	vv=new a();
// 	vv[0]()
// 	vv[1]()
// 	alert(t)
// 	vv[0]()
// })()
