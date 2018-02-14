String.prototype.twoDigits=function () {return this.replace(/^(.)$/,'0$1')}
var canvasToDataURL;
if (window.extension && extension.online) {
	var screenshot = chrome.extension.getBackgroundPage().screenshot;
}
else{
	screenshot={canvas:true}
}
var shadowDistance=5;
var imageURL,imageId;
if (!localStorage['lastTool']) localStorage['lastTool']='crop';
function editor_obj()
	{
	var theColor='#ff0000',lineWidth=2;
	var canvas,canvasOffset,$canvas,c,canvasData,$canvasData,czindex=5,startX,startY,points=[];
	var scrollBarWidth,scrollBarHeight;
	var scrollLeft,scrollTop;
	var tool={current:'line',status:'ready'};
	var clip={rx1:0,rx2:0,ry1:0,ry2:0};
	var cancel=false;
	var lastX,lastY;
	var firstImage;
	var hr;
	var onlineUrl;
	tool.free={};
	tool.highlight={};
	tool.spray={};
	tool.line={};
	tool.rectangle={};
	tool.full={};
	tool.arrow={};

	tool.star={}
	tool.house={}

	tool.ellipsis={};
	tool.crop={};
	tool.text={};
	tool.undo={};
	tool.redo={};

	var levels=[];
	var currentLevel,currentIndex=-1,maxIndex=-1;
	var imageChanged=true;

	function newLevel(inObj)
		{
		imageChanged=true;
		currentIndex++;
		maxIndex++;
		if (levels.length>currentIndex)
			{
			levels.slice(currentIndex);
			maxIndex=currentIndex;
			}
		if (!inObj) inObj={};
	    var newObject = jQuery.extend(true, {}, inObj);
		newObject.canvas=canvas;
		newObject.c=c;
		newObject=$.extend(true,newObject,clip);
		levels[currentIndex]=newObject;
		currentLevel=newObject;
		currentLevel.active=true;
		currentLevel.color=theColor;
		currentLevel.lineWidth=lineWidth;
//		c.strokeStyle=currentLevel.color;
//		c.fillStyle=currentLevel.color;
		resetButtons();
		return(newObject);
		}

	tool.undo.click=function ()
		{
		imageChanged=true;
		if(currentLevel.type=='delete')	{
			currentLevel.item.add(currentLevel.item.data('img')).fadeIn();
			currentLevel.item.data('deleted',false);
			currentLevel.hide=null;
			currentIndex--;
			currentLevel=levels[currentIndex];
		}
		else if (currentLevel.type=='crop')
			{
			currentIndex--;
			currentLevel=levels[currentIndex];
			if (currentIndex<0)
				{
				clip.rx1=clip.ry1=0;
				clip.ry2=$('#imgFixForLong').height();
				clip.rx2=$('#imgFixForLong').width();
				}
			else
				{
				currentLevel=levels[currentIndex];
				clip.rx1= currentLevel.rx1;
				clip.rx2= currentLevel.rx2;
				clip.ry1= currentLevel.ry1;
				clip.ry2= currentLevel.ry2;
				}
			onResize();
			}
		else
			{
			currentLevel.canvas.style.display='none';
			$(currentLevel.canvas).data('img').hide();
			currentIndex--
			currentLevel=levels[currentIndex];
			}
		changeTool('line');
		//$('canvas.tool:visible:last').hide();
		resetButtons();
		};
	tool.redo.click=function ()
		{
		imageChanged=true;
		currentIndex++;
		currentLevel=levels[currentIndex];
		if (currentLevel.type=='delete'){
			currentLevel.item.add(currentLevel.item.data('img')).fadeOut();
			currentLevel.item.data('deleted',true);
			currentLevel.hide=true;
		}
		else if (currentLevel.type=='crop')
			{
			clip.rx1=currentLevel.rx1;
			clip.rx2=currentLevel.rx2;
			clip.ry1=currentLevel.ry1;
			clip.ry2=currentLevel.ry2;
			onResize();
			}
		else
			{
			currentLevel.canvas.style.display='';
			$(currentLevel.canvas).data('img').show();
		}
		changeTool('line');
		resetButtons();
		};


	function createCanvas()
		{
		$canvas=$('<canvas class=tool style=position:relative></canvas>').appendTo($('#clipper')); //.data('clip-x1', clip.rx1).data('clip-y1', clip.ry1);
		if(true || addimg){
			var newImg= $('<img>').appendTo('#clipper') 
			$canvas.data('img',newImg );
		}

		canvas=$canvas[0];
		c=canvas.getContext('2d');
		canvas.width=$canvasData.width();
		canvas.height=$canvasData.height();
		$canvas.data('level',currentLevel);


		currentLevel.canvas=canvas
		currentLevel.c=c
		$canvas.add(newImg).css({'margin-left':-clip.rx1,'margin-top':-clip.ry1});
		$canvas.add(newImg).css( {position:'absolute','z-index':czindex++,left:0 ,'co':$canvasData.position().left,'top':0 ,'color':$canvasData.offset().top-scrollTop} );
		}
	function clipReload()
		{
		clip.rx1=0;
		clip.rx2=canvasData.width;
		clip.ry1=0;
		clip.ry2=canvasData.height;
		}
	this.createLastCanvas=function(todo,moreParams)
		{
		moreParams=moreParams || {}
		if (imageChanged!=localStorage['pngjpg'])
			{
			//$('#done_preview canvas').remove();
			var done=$('<canvas style=display:none; class=done></canvas>')[0];
			done.width=clip.rx2-clip.rx1;
			done.height=clip.ry2-clip.ry1;

			if($('#border1').hasClass('on')){
				done.width+=10;
				done.height+=10;
			}
			var ctx=done.getContext('2d');
			//ctx.drawImage(canvasData.toDataURL(),-clip.rx1,-clip.ry1);
			// var id=canvasData.getContext('2d').getImageData(clip.rx1,clip.ry1,clip.rx2,clip.ry2);
			// var id=canvasData.getContext('2d').getImageData(clip.rx1,clip.ry1,100,100);
			// ctx.putImageData(id,0,0);

			ctx.drawImage(   $('#imgFixForLong')[0],clip.rx1,clip.ry1,clip.rx2-clip.rx1, clip.ry2-clip.ry1 ,0,0,clip.rx2-clip.rx1, clip.ry2-clip.ry1 )

			for(var i=0;i<=currentIndex;i++)
				{
				if(cancel) {noMoreWait(); return;}
				var thisLevel=levels[i];
				thisLevel.canvasOffset={x:clip.rx1,y:clip.ry1};
				if (thisLevel.type!='crop' && thisLevel.type!='delete' && !thisLevel.hide)
				tool[thisLevel.type].draw({canvas:done,ctx:ctx,data:thisLevel});
				}
			imageChanged=localStorage['pngjpg'];
						if($('#border1').hasClass('on')){
			}
			if($('#border1').hasClass('on'))
				addBorderToCanvas(done);
			document.body.appendChild(done);
			if (localStorage['pngjpg']=='png')
				{
				canvasToDataURL=done.toDataURL();
				}
			else
				{
				canvasToDataURL=done.toDataURL('image/jpeg');
//				imageChanged=localStorage['pngjpg'];
//				je.encode ( ctx.getImageData(0,0,done.width,done.height),90,
//					function (y) {
//						canvasToDataURL=y;
//						createLastCanvas(todo);
//					}  ,true)
//				return;
				}
			}
		if(todo=='toolbar') {
			moreParams(canvasToDataURL);
			return
		}
		//chrome.extension.getBackgroundPage().lastCanvas={ height:canvas.height, width:canvas.width, data:canvasToDataURL};
		//$('#bug2')[canvasToDataURL.length>2000000 ? 'show' : 'hide']();
		//document.getElementById('done_preview').appendChild(this);
		//$('#reloadHelper2').unbind().click(function () {addCopyHelper.apply(canvas);});
		if(todo=='save')
			{
			noMoreWait();
			 if(!!window.webkitIntent && webkitIntent.action=='http://webintents.org/edit')
				 {
					webkitIntent.postResult(canvasToDataURL);
				 }

			else
				 {
				if(true){

					dataURItoBlob=function(dataURI) {
							var binary = atob(dataURI.split(',')[1]);
							var array = [];
							for(var i = 0; i < binary.length; i++) {
								array.push(binary.charCodeAt(i));
							}
							return new Blob([new Uint8Array(array)], {type: 'image/jpeg'})
								}
					x=dataURItoBlob(canvasToDataURL)
					url=URL.createObjectURL(x)

				var filename;
				filename=screenshot.title || screenshot.url;
				filename=filename.replace(/[%&\(\)\\\/\:\*\?\"\<\>\|\/\]]/g,' ');
				// filename+='-' + (new Date).getHours().toString().twoDigits() + (new Date).getMinutes().toString().twoDigits() + (new Date).getSeconds().toString().twoDigits()
				filename+=localStorage['pngjpg']=='png' ? '.png' : '.jpg';

				var evt = document.createEvent("MouseEvents");evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, true, false, false, 0, null);
				a=$('<a></a>').appendTo(document.body);
				a.attr({'href':url,'download':filename})[0].dispatchEvent(evt)
				imageChanged=false;
		//		im=$('<div><img /></div>').find('img').attr('src',url).end().dialog()

				}
				else{
				createFile(function (filename)
						{

						$('#topText').html('<a id=sss href="' + filename  + '">Click here to Open</a>');
		//				$('#topText').html('File Saved!');
						$('#save').add('#toGoogleDrive').add('#print').attr('disabled','');
		//				return true;
						var evt = document.createEvent("MouseEvents");evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, true, false, false, 0, null);
						document.getElementById("sss").dispatchEvent(evt)
						$('#save').add('#toGoogleDrive').add('#open').add('#print').attr('disabled','');
						if(localStorage['autosave']=='true') window.close()
						})
				}
						 }
			}
		if(todo=='share')
			{
			postImage(moreParams);
			}
		if(todo=='open')
			{
			var callback=function(filename)
				{
				window.open(filename,'_topopen')
				if(localStorage['autosave']=='true') window.close()
				}
			createFile(callback)
			$('#share').add('#save').add('#open').add('#print').attr('disabled','');

			}
		if(todo=='toGoogleDrive')
			{
			gDrive();
			imageChanged=true
			noMoreWait();
			}
		if(todo=='print')	{
			imageChanged=false
			$('#toPrintImage').one('load',
					function (){
					noMoreWait();
					if(canvasWidth<700)
						{
						this.width=canvasWidth;
						$(this).css('width','');
						}
					else
						{
						this.width=null;
						$(this).css('width','100%');
						}
					window.print()
					});
			$('#toPrintImage')[0].src=canvasToDataURL;
			}
		}

	this.reloadCanvas=function()
		{
		if(screenshot.url) $('title').html(screenshot.url);
		//document.getElementById('divCanvasData').appendChild(canvasData);
		clipReload();
		onResize();
		//editor.reloadCanvas();
		resetButtons();
		$('#toolbar .button[tag=' + localStorage['lastTool'] + ']').trigger('click');
		}

	this.init=function()
		{

		$("#wColorPicker2_3").wColorPicker({
			theme: "blue",
			mode: "hover",
			showSpeed: 300,
			hideSpeed: 300,
			buttonSize: 26,
			initColor:localStorage['color'] || '#FF0000',
			onSelect:function (a) {
				localStorage['color']=a;
				theColor=a;
			}
		}).on('mousedown',function (e) {e.stopPropagation(); return false});;

		//Dragable and deleteable
		(function(){
		var notRemove=false;
		var myInt;
		var	$this;
		$('#divCanvasData').on('mousemove',function (e) {
			if(tool.status!='ready' && tool.current!='text') {
        return;
      }

      var pos = $('#divCanvasData').position();
      $('canvas').each(function (key, canvas) {
        if (key < 2) {
          return ;
        }
				var cc=$(canvas);
				gc=cc[0].getContext('2d');
				x=e.offsetX + e.target.offsetLeft - cc.position().left+clip.rx1;
				y=e.offsetY + e.target.offsetTop - cc.position().top+clip.ry1;
				var doIt=false;

				if (x>0 && y>0 && x < canvas.width && y < canvas.height && canvas.style.display != "none")	{
					id=gc.getImageData(x,y,1,1).data;
					doIt=0
					for(var i=0;i<4;i++){
						if (id[i]!=0){
							doIt=true;
						}
					}
				}
				if (!doIt) {
          return ;
        }
        cc.css({border:'2px dahed gray'});
        var tcc=cc;



        var closeFn = cc.data('close') || function() {
          tcc.css({border:'none'});
          cc.data('myClose').remove();
          cc.data('myClose', false);
          cc.data('close', false);
        };
        clearTimeout(cc.data('time'));
        var a = setTimeout(closeFn, 3000);
        cc.data('close', closeFn);
        cc.data('time', a);
        if (cc.data('myClose')) {
          return false;
        }
        var $myClose = $('<div class="myClose">&times;</div>').css({
          left:cc.position().left+cc.width()-10-clip.rx1
          ,top:cc.position().top-clip.ry1
          ,zIndex:1000
        });
        $myClose = $myClose.appendTo('#divCanvasData').click(function (e){
          e.stopImmediatePropagation();
          tcc.add(tcc.data('img')).fadeOut();
          $myClose.remove();
        }).mousedown(function (e) {
          e.stopImmediatePropagation();
          newLevel();
          currentLevel.type='delete';
          currentLevel.item=tcc;
          tcc.data('deleted', true);
          tcc.data('level').hide=true
        });

        if ($myClose.position().left>clip.rx2-clip.rx1) {
          $myClose.css('left', clip.rx2-clip.rx1-30);
        }
        if ($myClose.position().top<0) {
          $myClose.css('top', 0);
        }
        cc.data('myClose', $myClose);
        return false;
			});
		});
		$('anvas.tool').on('mousemove',
			function (e) {
				$this=$(this);
//				console.log(e.offsetX,e.offsetY,e)
				x=e.offsetX;
				y=e.offsetY;
				doIt=false;
				for(var i=0;i<4;i++)
					{
					if ($this[0].getContext('2d').getImageData(x,y,x,y).data[i]!=0)
						{
						doIt=true;
						}
					}
				if(!doIt) return;
				$('.myBorder').remove(0);
				if (tool.status=='started') return;
				myBorder=$("<div class=myBorder style='position:relative;border:1px dashed 00eeff;z-index:1000;ursor:move'><div style=position:absolute;width:10;height:10;top:0;right:0;cursor:pointer>X</div></div>").appendTo('#divCanvasData')
				myBorder.css({
					left: $(this).position().left +  $('#divCanvasData').scrollLeft()
					,top: $(this).position().top +  $('#divCanvasData').scrollTop()
					,width:$(this).width()
					,height:$(this).height()
//					,zIndex:this.style.zIndex-1
					})
				myBorder.mouseleave(function()
					{
					//	console.log(e);
					myBorder.remove();
					});

				myBorder.click(function()
					{
					$this.remove();
					myBorder.remove();
					})
				$('div',myBorder).mouseenter(
						function (){tool.status='moving'}
						)
				});
		})()




		canvasData=document.getElementById('canvasId');
		$canvasData=$(canvasData);
		binds();
		resetButtons();
		if(screenshot.webcam){
			editor.webcam=true;
			ctx=$('canvas')[0].getContext('2d')
			canvas=$('canvas')[0];
			img=$('<img />')[0];
			img.onload=function (){
				canvas.width=this.width
				canvas.height=this.height
				firstImage=this;
				ctx.drawImage(this,0,0)
				editor.reloadCanvas();
        screenshot.webcam=null;
			}
			img.src=screenshot.webcam
		}
		if(screenshot.apppick){
			editor.apppick=true;
			ctx=$('canvas')[0].getContext('2d')
			canvas=$('canvas')[0];
			img=$('<img />')[0];
			img.onload=function (){
				canvas.width=this.width
				canvas.height=this.height
				firstImage=this;
				ctx.drawImage(this,0,0)
				editor.reloadCanvas();
				screenshot.apppick=null;
			}
			img.src=screenshot.apppick
		}

		if(location.hash=='#last' && screenshot.canvas)
		{
		canvas=$('canvas')[1];
					img=$('#imgFixForLong')[0];
					img.onload=function (){
						canvas.width=this.width
						canvas.height=this.height
						firstImage=this
						canvas.getContext('2d').drawImage(this,0,0)
						// $(this).css({
						// 	width:this.width,
						// 	height:this.height
						// })
						editor.reloadCanvas();
					}
					try{
					img.src=screenshot.canvas.toDataURL()
						}
						catch(sdfsdf) {return}
					screenshot.callback=null
					delete screenshot.callback
					screenshot.canvas.width=screenshot.canvas.height=1
					screenshot.callback=null
					screenshot.canvas.remove()
					screenshot.canvas=null
					delete screenshot.canvas
		}

		 if(!!window.webkitIntent) {
			ctx=$('canvas')[0].getContext('2d')
			canvas=$('canvas')[0];
			img=$('<img />')[0];
			editor.intent=true;
			img.onload=function (){
				canvas.width=this.width
				canvas.height=this.height
				firstImage=this
				ctx.drawImage(this,0,0)
				editor.reloadCanvas();
			}
			img.src=webkitIntent.data
			if(webkitIntent.action=='http://webintents.org/share' || webkitIntent.action=='http://webintents.org/save' )	 {
				$('#share').trigger('click');
			}
		}


//		if (extension.mac) $('#save').hide();
		}
//**********Text
	tool.text.begin=function (e)
		{
		tool.status='started';
		startX=e.x;
		startY=e.y;
		$('#text_helper').remove();
		$('<div id=text_helper style="position:absolute;border:none">adf</div>').appendTo('#divCanvasData');
		x1=startX;y1=startY;
		x2=e.x;y2=e.y;
		if (x1<x2) {rx1=x1;rx2=x2;} else {rx1=x2;rx2=x1;}
		if (y1<y2) {ry1=y1;ry2=y2;} else {ry1=y2;ry2=y1;}

		$('#text_helper')
		.css({'z-index':10000,
			left:-clip.rx1+rx1-8, //+$canvasData.offset().left,
			top:-clip.ry1+ry1-8, //+$canvasData.offset().top,
			height:clip.ry2-startY
			,width:clip.rx2-startX
		})
		b=['left','top','z-index','width','height','position','font-weight','width','fontWeight'];
		var ta=$('<textarea></textarea>');
		for (i in b)
			{
			ta.css(b[i], $('#text_helper').css(b[i])  );
			}
		ta.css(
			{'background-color':'transparent',
			padding:0,
			margin:0,
			border:'none',
			color:theColor,
			'font-size':'15pt',
			'font-weight':'400'
			});
		ta.mousedown(function  (e) {e.stopImmediatePropagation(); })
		ta.appendTo('#divCanvasData').focus();
		$('#text_helper').remove();
		ta.blur(tool.text.finish);
		};
	tool.text.finish=function ()
		{
		newLevel();
		createCanvas();
		currentLevel.type='text';
		a={
			text:$('textarea').val(),
			font: $('textarea').css('font-size')+ ' ' + $('textarea').css('font-family'),
			'font-size':$('textarea').css('font-size'),
			'font-weight':$('textarea').css('font-weight'),
			lineHeight:$('textarea').css('line-height'),
			width:$('textarea').css('width'),
			x: startX, y:startY,
			direction:$('textarea').css('direction')
		};
		currentLevel=$.extend(currentLevel,a);
		$('textarea').remove();
		tool[tool.current].draw({canvas:canvas,ctx:c,data:currentLevel},'toolcreate');
		tool.status='ready'; $('textarea').unbind('blur');
		};
	tool.text.draw=function(inX,toolcreate)
		{
		inX.ctx.textBaseline='top';
		inX.ctx.strokeStyle=inX.data.color;
		inX.ctx.fillStyle=inX.data.color;
		inX.ctx.font=inX.data.font;
		lineHeight=		inX.ctx.font=parseInt(inX.data['font-size']);
		var lines = inX.data.text.split("\n");
		check=multiFillText(inX.canvas,inX.data.text,null,null,parseInt(lineHeight),parseInt(inX.data.width))
		if(toolcreate)
			{
			enlargeCanvas(inX.canvas,inX.data.x,inX.data.y,10000,10000);
			inX.canvas.width=check.width
			inX.canvas.height=check.height+10
			}

		inX.ctx.textBaseline='top';
		inX.ctx.strokeStyle=inX.data.color;
		inX.ctx.fillStyle=inX.data.color;
		inX.ctx.font=inX.data.font;

//		var multiFillText = function(canvas,text, x, y, lineHeight, fitWidth) {
		context=inX.ctx;
		 context.shadowColor = "black";
		 context.shadowBlur = 0;
		 context.shadowOffsetX = 0;
		 context.shadowOffsetY = 0;
		multiFillText(inX.canvas,inX.data.text,toolcreate? 0:inX.data.x-clip.rx1 ,toolcreate?0:inX.data.y-clip.ry1,parseInt(lineHeight),parseInt(inX.data.width))
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		updateImgFromCanvas();
//		for (a=0; a<lines.length; a++) {
//				inX.ctx.fillStyle='000';
//				inX.ctx.globalAlpha='0.2'
//				inX.ctx.fillText(lines[a],+2, +2+ parseInt(lineHeight)*(a));
//				inX.ctx.globalAlpha='1'
//				inX.ctx.strokeStyle=inX.data.color;
//				inX.ctx.fillStyle=inX.data.color;
//				inX.ctx.fillText(lines[a], 0,  + parseInt(lineHeight)*(a));
//				}

		};
//********crop
	tool.crop.begin=function  (e)
		{
		tool.status='started';
		startX=e.x;
		startY=e.y;
		};
	tool.crop.click=function()
		{
		//clipReload();
		onResize();
		};
	tool.crop.up=function ()
		{
			// currentLevel.type='crop';
		if( ry2-ry1 + rx2-rx1<100) {
			tool.crop.draw()
			return
		}
		clip.rx1=rx1;
		clip.rx2=rx2;
		clip.ry1=ry1;
		clip.ry2=ry2;
		newLevel();
		currentLevel.type='crop';
		tool.crop.draw()
		}
	tool.crop.draw=function (inX)
		{
//		clip.rx1=rx1;
//		clip.rx2=rx2;
//		clip.ry1=ry1;
//		clip.ry2=ry2;
		$('#crop_helper').remove();
//		$('#divCanvasData').css({'width':x2-x1,height:y2-y1})
		onResize();
		$('#divCanvasData').scrollTop(0).scrollLeft(0);
		tool.status='ready';
		//$('#toolbar .button[tag=line]').trigger('click');
		//tool.current='line';
		resetButtons();
		};
	tool.crop.move=function (e)
		{
		x1=startX; y1=startY;
		x2=e.x; y2=e.y;
		if(  $('#divCanvasData').scrollTop() + $('#divCanvasData').height() - e.y < 35){
			$('#divCanvasData')[0].scrollTop+=30;
			e.y+=30;
		}
		if(  $('#divCanvasData').scrollLeft() + $('#divCanvasData').width() - e.x < 35){
			$('#divCanvasData')[0].scrollLeft+=30;
			e.x+=30;
		}
		if(    e.y  - $('#divCanvasData').scrollTop() < 35){
			$('#divCanvasData')[0].scrollTop-=30;
			e.y-=30;
		}
		if(    e.x  - $('#divCanvasData').scrollLeft() < 35){
			$('#divCanvasData')[0].scrollLeft-=30;
			e.x-=30;
		}

		if (x1<x2) {rx1=x1;rx2=x2;} else {rx1=x2;rx2=x1;}
		if (y1<y2) {ry1=y1;ry2=y2;} else {ry1=y2;ry2=y1;}
		$('#crop_helper').remove();
		$('<div id=crop_helper><div id=crop_helper_bottom></div><div id=crop_helper_left></div><div id=crop_helper_top></div><div id=crop_helper_right></div></div>').appendTo('#divCanvasData');
		$('#crop_helper *').css({
				'background-color':'blue',
				'opacity':'0.6',
				'position':'absolute',
				'z-index':10000
				});
		$('#crop_helper_left').css({'ackground-color':'blue',
				left: 0,top:$canvasData.position().top,top:0,
				width:rx1-clip.rx1,height:$canvasData.height()+scrollTop
				});
		$('#crop_helper_top').css({'ackground-color':'red',
				left: rx1-clip.rx1,top:0,
				width:clip.rx2-(rx1-clip.rx1),height:ry1-clip.ry1
				});
		$('#crop_helper_bottom').css({'ackground-color':'yellow',
				left: rx1-clip.rx1,top:ry2-clip.ry1,
				width:clip.rx2-(rx1-clip.rx1),height:clip.ry2-ry2
				});
		$('#crop_helper_right').css({'ackground-color':'green',
				left: rx2-clip.rx1,top:ry1-clip.ry1,
				width:clip.rx2-(rx2-clip.rx1),height:ry2-ry1
				});
		};

	function pos(e) {
		ans ={x:clip.rx1+e.pageX-$('#divCanvasData').offset().left+$('#divCanvasData').scrollLeft(), y:clip.ry1+e.pageY-$('#divCanvasData').offset().top+$('#divCanvasData').scrollTop()};
		if (ans.x<0  || ans.y<0) return (false);
		if (e.pageX> $('#divCanvasData').offset().left+$('#divCanvasData').width()-scrollBarWidth ) return(false);
		if (e.pageY> $('#divCanvasData').offset().top+$('#divCanvasData').height()-scrollBarHeight ) return(false);
		if (e.pageX< $('#divCanvasData').offset().left ) return(false);
		if (e.pageY< $('#divCanvasData').offset().top ) return(false);
		return (ans);
		}

	function canvasAutoResize(e,dif)
		{
		ans=getMinMax();
		$canvas.css({left:ans.x1-dif,top:ans.y1-dif});
		canvas.width=ans.x2-ans.x1+dif*2;
		canvas.height=ans.y2-ans.y1+dif*2;
		c.moveTo(points[0].x-ans.x1,points[0].y-ans.y1);
		return({x1:ans.x1-dif,x2:ans.x2+dif,y1:ans.y1-dif,y2:ans.y2+dif,w:x2-x1,h:y2-y1});
		}
	function getMinMax(points)
		{
		x1=y1=65535;
		x2=y2=0;
		$.each(points,function (a,b)
			{
			if (b.x<x1) x1=b.x;
			if (b.x>x2) x2=b.x;
			if (b.y<y1) y1=b.y;
			if (b.y>y2) y2=b.y;
			});
		return ({x1:x1,x2:x2,y1:y1,y2:y2});
		}
//**********Spray
	tool.spray.begin=function (e)
		{
		tool.status="started";
		newLevel();
		createCanvas();
		currentLevel.type='spray';
		currentLevel.points=[];
		tool.spray.move(e);
		};
	tool.spray.move=function(e)
		{
		for(var j=c.lineWidth*35; j>0; j--) {
			var rndx = e.x + Math.round(Math.random()*(c.lineWidth*15)-(c.lineWidth*2));
			var rndy = e.y+ Math.round(Math.random()*(c.lineWidth*15)-(c.lineWidth*2));
			currentLevel.points.push({x:rndx, y:rndy});
			}
		ans=getMinMax(currentLevel.points);
		enlargeCanvas(canvas,ans.x1,ans.y1,ans.x2,ans.y2);
		tool[tool.current].draw({canvas:canvas,ctx:c,data:currentLevel});
		};
	tool.spray.draw=function (inX)
		{

//		id=inX.ctx.createImageData(inX.canvas.width,inX.canvas.height);
		id=inX.ctx.getImageData(0,0,inX.canvas.width,inX.canvas.height);
		pix=id.data;
		for(var i=0;i<inX.data.points.length;i++)
			{
			thisPoint= parseInt(inX.data.points[i].y-inX.data.canvasOffset.y-1)* inX.canvas.width*4;
			thisPoint+=parseInt(inX.data.points[i].x-inX.data.canvasOffset.x)*4;

			pix[thisPoint]=parseInt(inX.data.color.slice(4,-1).split(',')[0]);
			pix[thisPoint+1]=parseInt(inX.data.color.slice(4,-1).split(',')[1]);
			pix[thisPoint+2]=parseInt(inX.data.color.slice(4,-1).split(',')[2]);	
	}
		var id=inX.ctx.getImageData(0,0,inX.canvas.width,inX.canvas.height);
		var pix=id.data;
		var thisPoint;

		var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(inX.data.color);
		var colors = [
			parseInt(rgb[1], 16),
			parseInt(rgb[2], 16),
			parseInt(rgb[3], 16)
		];
		for(var i=0;i<inX.data.points.length;i++) {
			thisPoint= parseInt(inX.data.points[i].y-inX.data.canvasOffset.y-10)* inX.canvas.width*4;
			thisPoint+=parseInt(inX.data.points[i].x-inX.data.canvasOffset.x-10)*4;

			pix[thisPoint]=colors[0];
			pix[thisPoint+1]=colors[1];
			pix[thisPoint+2]=colors[2];
			pix[thisPoint+3]=255;
		}
		inX.ctx.putImageData(id,0,0);
		updateImgFromCanvas();
	};
	tool.spray.up=function (){tool.status='ready';};
////    Free
	tool.free.up=function (){tool.status='ready';};
	tool.free.begin=function (e)
		{
		tool.status="started";
		newLevel();
		createCanvas();
		currentLevel.type='free';
		currentLevel.points=[];
		tool.free.move(e);
		};
	tool.free.move=function(e)
		{
		currentLevel.points.push({x:e.x,y:e.y});
//		ans=canvasAutoResize(e,2);
		canvas.height=canvas.height+1;
		canvas.height=canvas.height-1;
		ans=getMinMax(currentLevel.points);
		enlargeCanvas(canvas,ans.x1,ans.y1,ans.x2,ans.y2);
		tool[tool.current].draw({canvas:canvas,ctx:c,data:currentLevel});
		};
	tool.free.draw=function(inX)
		{
		context=inX.ctx
		context.shadowBlur = 5;
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 5;
		context.lineWidth=inX.data.lineWidth;

		// inX.ctx.beginPath();
		// inX.ctx.lineWidth=inX.data.lineWidth;

		// inX.ctx.strokeStyle='00';
		// inX.ctx.fillStyle='000';
		// inX.ctx.globalAlpha=0.3;
		// for(var i=1;i<inX.data.points.length;i++)
		// {
		// 	inX.ctx.lineTo(inX.data.points[i].x -inX.data.canvasOffset.x+shadowDistance  ,inX.data.points[i].y -inX.data.canvasOffset.y+shadowDistance);
		// };
		// inX.ctx.stroke();
		// inX.ctx.closePath();
		inX.ctx.beginPath();
		inX.ctx.strokeStyle=inX.data.color;
		inX.ctx.globalAlpha=1;
		inX.ctx.fillStyle=inX.data.color;
		for(var i=1;i<inX.data.points.length;i++)
			{
			inX.ctx.lineTo(inX.data.points[i].x -inX.data.canvasOffset.x  ,inX.data.points[i].y -inX.data.canvasOffset.y);
			};

		inX.ctx.stroke();
		inX.ctx.closePath();

		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		updateImgFromCanvas();
		};

		////    highlight
			tool.highlight.up=function (){tool.status='ready';};
			tool.highlight.begin=function (e)
				{
				tool.status="started";
				newLevel();
				createCanvas();
				currentLevel.type='highlight';
				currentLevel.points=[];
				tool.highlight.move(e);
				};
			tool.highlight.move=function(e)
				{
				currentLevel.points.push({x:e.x,y:e.y});
		//		ans=canvasAutoResize(e,2);
				canvas.height=canvas.height+1;
				canvas.height=canvas.height-1;
				ans=getMinMax(currentLevel.points);
				enlargeCanvas(canvas,ans.x1,ans.y1,ans.x2,ans.y2);
				tool[tool.current].draw({canvas:canvas,ctx:c,data:currentLevel});
				};
			tool.highlight.draw=function(inX)
				{
				context=inX.ctx
				context.shadowBlur = 5;
				context.shadowOffsetX = 5;
				context.shadowOffsetY = 5;
				context.globalAlpha=0.45
				inX.ctx.lineWidth=20;

				// inX.ctx.beginPath();
				// inX.ctx.lineWidth=inX.data.lineWidth;

				// inX.ctx.strokeStyle='00';
				// inX.ctx.fillStyle='000';
				// inX.ctx.globalAlpha=0.3;
				// for(var i=1;i<inX.data.points.length;i++)
				// {
				// 	inX.ctx.lineTo(inX.data.points[i].x -inX.data.canvasOffset.x+shadowDistance  ,inX.data.points[i].y -inX.data.canvasOffset.y+shadowDistance);
				// };
				// inX.ctx.stroke();
				// inX.ctx.closePath();
				inX.ctx.beginPath();
				inX.ctx.strokeStyle=inX.data.color;
				inX.ctx.fillStyle=inX.data.color;
				for(var i=1;i<inX.data.points.length;i++)
					{
					inX.ctx.lineTo(inX.data.points[i].x -inX.data.canvasOffset.x  ,inX.data.points[i].y -inX.data.canvasOffset.y);
					};

				inX.ctx.stroke();
				inX.ctx.closePath();

				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				updateImgFromCanvas();
				};		
	//line
	tool.line.begin=function (e)
		{
		tool.status="started";
		newLevel();
		createCanvas();
		currentLevel.type='line';
		currentLevel.start={x:e.x,	y:e.y};
		};
	tool.line.move=function(e)
		{
		currentLevel.end={x:e.x,y:e.y};
		canvas.height=canvas.height+1;
		canvas.height=canvas.height-1;
		enlargeCanvas(canvas,currentLevel.start.x,currentLevel.start.y,currentLevel.end.x,currentLevel.end.y);
		tool[tool.current].draw({canvas:canvas,ctx:c,data:currentLevel});
		};
	tool.line.draw=function(inX)
		{
		if (! (inX.data.start && inX.data.end)) return;
		inX.ctx.beginPath();
		inX.ctx.strokeStyle=inX.data.color;
		inX.ctx.fillStyle=inX.data.color;
		inX.ctx.lineWidth=inX.data.lineWidth;
		 drawLine=function(x1,y1,x2,y2,shadow)
			{
			inX.ctx.lineWidth=inX.data.lineWidth;
			if(shadow)
				{
				inX.ctx.strokeStyle='000';
				inX.ctx.globalAlpha=0.2;
				}
			else
				{
				drawLine(x1+shadowDistance,y1+shadowDistance,x2+shadowDistance,y2+shadowDistance,true)
				inX.ctx.strokeStyle=inX.data.color;
				inX.ctx.fillStyle=inX.data.color;
				inX.ctx.globalAlpha=1;
				}
			inX.ctx.beginPath();
			inX.ctx.moveTo(x1,y1);
			inX.ctx.lineTo(x2,y2);
			inX.ctx.stroke();
			inX.ctx.closePath();
			}
				context=inX.ctx
		context.shadowBlur = 5;
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 5;
		drawLine(inX.data.start.x  -inX.data.canvasOffset.x  ,inX.data.start.y -inX.data.canvasOffset.y,
				inX.data.end.x    -inX.data.canvasOffset.x,inX.data.end.y     -inX.data.canvasOffset.y);
		inX.ctx.lineCap='round';
		inX.ctx.stroke();
		inX.ctx.closePath();
				context=inX.ctx
		context.shadowBlur = 0;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		updateImgFromCanvas();
		};
	tool.line.up=function () {tool.status='ready';};
	//ellipsis
	var baseElippsimDim=30
	tool.ellipsis.begin=function (e)
		{
		tool.status="started";
		newLevel();
		createCanvas();
		e.x-=baseElippsimDim/2
		e.y-=baseElippsimDim/2
		currentLevel.type='ellipsis';
		currentLevel.start={x:e.x,	y:e.y};
		currentLevel.end={x:e.x+baseElippsimDim,	y:e.y+baseElippsimDim};
		tool.ellipsis.move({x:e.x+baseElippsimDim,y:e.y+baseElippsimDim});
		};

	tool.ellipsis.move=function(e)
		{
		currentLevel.end={x:e.x,y:e.y};
		canvas.height=canvas.height+1;
		canvas.height=canvas.height-1;		
		enlargeCanvas(canvas,currentLevel.start.x,currentLevel.start.y,currentLevel.end.x,currentLevel.end.y);

		tool[tool.current].draw({canvas:canvas,ctx:c,data:currentLevel});
		};
	tool.ellipsis.draw=function(inX)
		{
		if (! (inX.data.start && inX.data.end)) return;
		inX.ctx.beginPath();
		inX.ctx.strokeStyle=inX.data.color;
		inX.ctx.fillStyle=inX.data.color;
		inX.ctx.ellipsisWidth=inX.data.ellipsisWidth;
		 drawEllipsis=function(x1,y1,x2,y2,shadow)
			{
			inX.ctx.lineWidth=inX.data.lineWidth;
			if(shadow)
				{
				return
				inX.ctx.strokeStyle='000';
				inX.ctx.globalAlpha=0.2;
				}
			else
				{
				drawEllipsis(x1+shadowDistance,y1+shadowDistance,x2+shadowDistance,y2+shadowDistance,true)
				inX.ctx.strokeStyle=inX.data.color;
				inX.ctx.fillStyle=inX.data.color;
				inX.ctx.globalAlpha=1;
				}
			inX.ctx.beginPath();

				var KAPPA = 4 * ((Math.sqrt(2) -1) / 3);

				var rx = (x2-x1)/2;
				var ry = (y2-y1)/2;

				var cx = x1+rx;
				var cy = y1+ry;
				var trg=inX.ctx;

				trg.beginPath();
				trg.moveTo(cx, cy - ry);
				trg.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);
				trg.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
				trg.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
				trg.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);

			inX.ctx.stroke();
			inX.ctx.closePath();
			}
		drawEllipsis(inX.data.start.x  -inX.data.canvasOffset.x  ,inX.data.start.y -inX.data.canvasOffset.y,
				inX.data.end.x    -inX.data.canvasOffset.x,inX.data.end.y     -inX.data.canvasOffset.y);
		inX.ctx.ellipsisCap='round';
		inX.ctx.stroke();
		inX.ctx.closePath();
		updateImgFromCanvas();
		};
	tool.ellipsis.up=function () {tool.status='ready';};
	//Rectangle

	var baseRectDim=30
	tool.rectangle.begin=function (e)
		{
		tool.status="started";
		newLevel();
		createCanvas();

		e.x-=baseRectDim/2
		e.y-=baseRectDim/2
		currentLevel.type='rectangle';
		currentLevel.start={x:e.x+15,	y:e.y+15};
		currentLevel.end={x:e.x+baseRectDim,	y:e.y+baseRectDim};
		tool.rectangle.move({x:e.x+baseRectDim,y:e.y+baseRectDim});
		
		};
	tool.rectangle.move=function(e)
		{
		currentLevel.end={x:e.x,y:e.y};
		canvas.height=canvas.height+1;
		canvas.height=canvas.height-1;
		enlargeCanvas(canvas,currentLevel.start.x,currentLevel.start.y,currentLevel.end.x,currentLevel.end.y);
		tool[tool.current].draw({canvas:canvas,ctx:c,data:currentLevel});
		};
	tool.rectangle.draw=function(inX)
		{
		if (! (inX.data.start && inX.data.end)) return;

		function drawRect(x1,y1,x2,y2,shadow)
			{
			inX.ctx.lineWidth=inX.data.lineWidth;
			if(shadow)
				{
				return
				inX.ctx.strokeStyle='000';
				inX.ctx.globalAlpha=0.2;
				}
			else
				{
				drawRect(x1+shadowDistance,y1+shadowDistance,x2+shadowDistance,y2+shadowDistance,true)
				inX.ctx.strokeStyle=inX.data.color;
				inX.ctx.fillStyle=inX.data.color;
				inX.ctx.globalAlpha=1;
				}
			inX.ctx.beginPath();
			inX.ctx.moveTo(x1,y1);
			inX.ctx.lineTo(x1,y2);
			inX.ctx.lineTo(x2,y2);
			inX.ctx.lineTo(x2,y1);
			inX.ctx.lineTo(x1,y1);
			if(inX.data.type=='full')
				inX.ctx.fill()
			else
				inX.ctx.stroke();
			inX.ctx.closePath();
			}
				context=inX.ctx
		context.shadowBlur = 5;
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 5;
		drawRect(inX.data.start.x  -inX.data.canvasOffset.x  ,inX.data.start.y -inX.data.canvasOffset.y,
				inX.data.end.x    -inX.data.canvasOffset.x,inX.data.end.y     -inX.data.canvasOffset.y);
				context=inX.ctx
		context.shadowBlur = 0;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		inX.ctx.lineCap='round';
		updateImgFromCanvas()


		};

	function updateImgFromCanvas(){		
		var $i=$(canvas).data('img');
		var $t=$(canvas);
		$i.css({
			'marginTop':$t.css('marginTop'),
			'marginLeft':$t.css('marginLeft'),
			'position':'absolute',
			'left': $t.css('left'),
			'top': $t.css('top'),
			'width': $t.css('width'),
			'height': $t.css('height')
		});
		$i.attr('src', canvas.toDataURL())
	}

	tool.rectangle.up=function () {tool.status='ready';};

	//Full
	tool.full.begin=function (e)
		{
		tool.status="started";
		newLevel();
		createCanvas();
		currentLevel.type='full';
		e.x-=baseRectDim/2
		e.y-=baseRectDim/2
		currentLevel.start={x:e.x+15,	y:e.y+15};
		currentLevel.end={x:e.x+baseRectDim,	y:e.y+baseRectDim};
		tool.full.move({x:e.x+baseRectDim,y:e.y+baseRectDim});
		}
	tool.full.move=tool.rectangle.move;
	tool.full.draw=tool.rectangle.draw
	tool.full.up=tool.rectangle.up;

	//Star
	var baseStarDim=15
	tool.star.begin=function (e)
		{

		tool.status="started";
		newLevel();
		createCanvas();
		currentLevel.type='star';
		currentLevel.start={x:e.x-baseStarDim+15,	y:e.y-baseStarDim+15};
		currentLevel.end={x:e.x+baseStarDim,	y:e.y+baseStarDim};
		tool.star.move(e);
		};
	tool.star.move=function(e)
		{
		currentLevel.end={x:e.x,y:e.y};
		canvas.height=canvas.height+1;
		canvas.height=canvas.height-1;
		enlargeCanvas(	canvas,
			currentLevel.start.x - (currentLevel.end.x - currentLevel.start.x)/2
			,currentLevel.start.y - (currentLevel.end.y - currentLevel.start.y)/2
			,currentLevel.end.x + (currentLevel.end.x - currentLevel.start.x )*2
			,currentLevel.end.y +  (currentLevel.end.y - currentLevel.start.y)*2
		);
		tool[tool.current].draw({canvas:canvas,ctx:c,data:currentLevel});
		};
	tool.star.draw=function(inX)
		{
		if (! (inX.data.start && inX.data.end)) return;

		function drawstar(x1,y1,x2,y2,shadow)
			{
			inX.ctx.lineWidth=inX.data.lineWidth;
			inX.ctx.strokeStyle=inX.data.color;
			inX.ctx.fillStyle=inX.data.color;
			inX.ctx.globalAlpha=1;
			inX.ctx.drawSvg('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="200px" height="200px" viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve"><g>	<path d="M98.88,21.851l23.207,47.022l1.629,3.3l3.642,0.529l51.893,7.541l-37.549,36.602l-2.636,2.569l0.622,3.627l8.864,51.683l-46.414-24.402l-3.258-1.712l-3.257,1.712l-46.414,24.402l8.865-51.683l0.622-3.628l-2.635-2.568L18.51,80.243l51.893-7.541l3.642-0.529l1.629-3.3L98.88,21.851 M98.88,6.034L69.396,65.775l-65.929,9.58l47.707,46.502L39.912,187.52l58.968-31.002l58.969,31.002l-11.262-65.662l47.705-46.502l-65.928-9.58L98.88,6.034L98.88,6.034z"/></g></svg>',
				x1 ,y1  , (x2-x1)*2   ,(y2-y1)*2);
			}
		drawstar(inX.data.start.x  -inX.data.canvasOffset.x  ,inX.data.start.y -inX.data.canvasOffset.y,
				inX.data.end.x    -inX.data.canvasOffset.x,inX.data.end.y     -inX.data.canvasOffset.y);
		updateImgFromCanvas();
		};
	tool.star.up=function () {tool.status='ready';};


//house
	var baseHouseDim=30
	tool.house.begin=function (e)
		{

		tool.status="started";
		newLevel();
		createCanvas();
		currentLevel.type='house';
		currentLevel.start={x:e.x-baseHouseDim/2,	y:e.y-baseHouseDim/2};
		currentLevel.end={x:e.x+baseHouseDim,	y:e.y+baseHouseDim};
		tool.house.move(e);
		};
	tool.house.move=function(e)
		{
		currentLevel.end={x:e.x,y:e.y};
		canvas.height=canvas.height+1;
		canvas.height=canvas.height-1;
		enlargeCanvas(	canvas,
			currentLevel.start.x - (currentLevel.end.x - currentLevel.start.x)/2,
			currentLevel.start.y - (currentLevel.end.y - currentLevel.start.y)/2,
			currentLevel.end.x+ (currentLevel.end.x - currentLevel.start.x ),
			currentLevel.end.y+  (currentLevel.end.y - currentLevel.start.y)
		);
		tool[tool.current].draw({canvas:canvas,ctx:c,data:currentLevel});
		};
	tool.house.draw=function(inX)
		{
		if (! (inX.data.start && inX.data.end)) return;

		function drawhouse(x1,y1,x2,y2,shadow)
			{
			inX.ctx.lineWidth=inX.data.lineWidth*2;
			inX.ctx.strokeStyle=inX.data.color;
			inX.ctx.fillStyle=inX.data.color;
			inX.ctx.globalAlpha=1;
			inX.ctx.drawSvg('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" width="200px" height="148.333px" viewBox="0 0 200 148.333" enable-background="new 0 0 200 148.333" xml:space="preserve"><polyline fill="none" stroke="#strokeColor#"  points="32.875,56.208 33.248,56.838 33.248,137.203 168.183,137.203 168.183,56.838 		"/> <polyline  fill="none" stroke="#strokeColor#" points="194.936,77.92 147.189,43.877 99.444,9.833 51.699,43.877 3.952,77.92 		"/>  </svg>'.replace(/#strokeColor#/g,inX.data.color),
				x1 ,y1  , (x2-x1)*2   ,(y2-y1)*2);
			}
		drawhouse(inX.data.start.x  -inX.data.canvasOffset.x  ,inX.data.start.y -inX.data.canvasOffset.y,
				inX.data.end.x    -inX.data.canvasOffset.x,inX.data.end.y     -inX.data.canvasOffset.y);
		updateImgFromCanvas();

		};
	tool.house.up=function () {tool.status='ready';};


	//arrow
	tool.arrow.begin=function (e)
		{
		tool.status="started";
		newLevel();
		createCanvas();
		currentLevel.type='arrow';
		currentLevel.start={x:e.x,	y:e.y};
		};
	tool.arrow.move=function(e)
		{
		currentLevel.end={x:e.x,y:e.y};
		canvas.height=canvas.height+1;
		canvas.height=canvas.height-1;
		// currentLevel.start.x-=30
		// currentLevel.start.y-=30
		enlargeCanvas(canvas,currentLevel.start.x,currentLevel.start.y,currentLevel.end.x,currentLevel.end.y);
		tool[tool.current].draw({canvas:canvas,ctx:c,data:currentLevel});
		};
	tool.arrow.draw=function(inX)
		{
		if (! (inX.data.start && inX.data.end)) return;

		function drawArrow(x1,y1,x2,y2,shadow)
			{
			inX.ctx.lineWidth=inX.data.lineWidth;
			if(shadow)
				{
				inX.ctx.strokeStyle='000';
				inX.ctx.globalAlpha=0.2;
				return
				}
			else
				{
				drawArrow(x1+shadowDistance,y1+shadowDistance,x2+shadowDistance,y2+shadowDistance,true)
				inX.ctx.strokeStyle=inX.data.color;
				inX.ctx.fillStyle=inX.data.color;
				inX.ctx.globalAlpha=1;
				}
			inX.ctx.beginPath();
			inX.ctx.moveTo(x1,y1);
			inX.ctx.lineTo(x2,y2);
			var dy=8
			var dx1=7
			var dx2=7
			var DeltaX = x2 - x1;
			var DeltaY = y2 - y1;
			var L = Math.sqrt(DeltaX*DeltaX + DeltaY*DeltaY);


			inX.ctx.lineTo(x2 - DeltaY * dy / L  - DeltaX * dx1 / L,
			               y2 + DeltaX * dy / L -  DeltaY * dx1 / L);

			inX.ctx.lineTo(x2 + DeltaX * dx2 / L,
		               y2 + DeltaY * dx2 / L);

			inX.ctx.lineTo(x2 + DeltaY * dy / L - DeltaX * dx1 / L,
		               y2 - DeltaX * dy / L - DeltaY * dx1 / L);

			inX.ctx.lineTo(x2, y2);

			inX.ctx.stroke();
			inX.ctx.closePath();
			}

		drawArrow(inX.data.start.x  -inX.data.canvasOffset.x  ,inX.data.start.y -inX.data.canvasOffset.y,
				inX.data.end.x    -inX.data.canvasOffset.x,inX.data.end.y     -inX.data.canvasOffset.y);
		inX.ctx.lineCap='round';
		updateImgFromCanvas();

		};
	tool.arrow.up=function () {tool.status='ready';};
	//
	function drawLevel(inX)
		{
//		offset=enlargeCanvas(currentLevel.startX,currentLevel.startY,currentLevel.lineTo.x,currentLevel.lineTo.y);
//		tool[currentLevel.type].draw(inX.canvas,inX.ctx,currentLevel)
		}
	function enlargeCanvas(canvas,x1,y1,x2,y2)
		{
		if (x1<x2) {rx1=x1;rx2=x2;} else {rx1=x2;rx2=x1;}
		if (y1<y2) {ry1=y1;ry2=y2;} else {ry1=y2;ry2=y1;}
		currentLevel.canvasOffset={x:rx1-7,y:ry1-7};
			$(canvas).css({left:rx1-7,top:ry1-7});
			canvas.width=rx2-rx1+25;
			canvas.height=ry2-ry1+25;

		$(canvas).data('img').css({'left':$(canvas).css('left'),'top':$(canvas).css('top'),'width':canvas.width,'height':canvas.height})
		return({x:rx1,y:ry1});
		}
	function stopTool()
		{
		if (tool.status=='started')
			{
			tryFunc(tool[tool.current].up);
			tryFunc(tool[tool.current].finish);
			}
		}
	function changeTool(inTool)
		{
		if(inTool.type=='undo' && inTool.type=='redo' && inTool.type=='crop') {}
		else
		localStorage['lastTool']=inTool;
		stopTool();
		$('.button [tag=' + inTool + ']').trigger('mousedown');
		tool.current=inTool;
		}

	function tryFunc(inFunc) {if ($.isFunction(inFunc)) inFunc();}


	function onResize()
		{
		if(true)
			{
			canvasWidth=clip.rx2-clip.rx1;
			canvasHeight=clip.ry2-clip.ry1;
			$('#clipper').css({'height':clip.ry2-clip.ry1,'overflow':'hidden','width':clip.rx2-clip.rx1,'position':'absolute'})
			//
			if(firstImage){
			$('#canvasId').attr('height',clip.ry2-clip.ry1);
			$('#canvasId')[0].getContext('2d').drawImage(firstImage,0,0);
			}

			$canvasData.css({
				"margin-left":-clip.rx1,
				"margin-top":-clip.ry1
				});
			$canvasData.css({'clip':'clip.rect(' + clip.ry1 +' ' +clip.rx2+ ' ' + clip.ry2 + ' ' + clip.rx1 + ')'}).css('position','absolute');
			$('canvas').add('#clipper img').not('#canvasId').each(function ()
					{
					$(this).css({'margin-left':-clip.rx1,'margin-top':-clip.ry1});
					});
			}
		else
			{
			$canvasData.css({margin:0,clip:'none'});
			canvasWidth=$canvasData.width();
			canvasHeight=$canvasData.height();
			$('canvas').not('#canvasId').each(function ()
					{
					$(this).css({'margin':0});
					});
			}
		maxWidth=window.innerWidth;
		maxHeight=window.innerHeight- $('#header').height()- $('#fotter').height();

		$('#header').add('#fotter').width(maxWidth);

		divCanvasData=$('#divCanvasData');
    var height = canvasHeight;
    if (height > maxHeight) {
      height = maxHeight;
    }
		divCanvasData.css(
				{
					left:canvasWidth>maxWidth ? 0 : (maxWidth/2)-(canvasWidth/2) ,
					width:canvasWidth>maxWidth ? maxWidth : canvasWidth,
					height:height,
					'overflow-x' : canvasWidth+16<maxWidth ?'hidden' : 'auto',
					'overflow-Y' : canvasHeight<maxHeight ?'hidden' : 'auto',
          'top': '50%',
          'margin-top': ($('#header').height()/2 - height/2) + 'px'
				});
		scrollBarHeight= canvasWidth<maxWidth ? 0 : 16;
		scrollBarWidth= canvasHeight<maxHeight  ? 0 : 16;
		onScroll();

		// window.setTimeout(function(){
		// 	if(lj_get('settings','framebench_tooltip')!='hide' && lj_get('settings','framebench_button')=='yes'){
		// 		lj_set('settings','framebench_tooltip','hide')
		// 		$('.fbtip').remove();$('<div class=fbtip style=z-index:1000;width:330px;height:350px;position:absolute><div style="position:absolute;width:100%"><img src="/images/framebench_tooltip.png"><span class=fbtipblose style=color:blue;cursor:pointer>Close</span></div></div>').hide().appendTo(document.body).position({my:'right+50 top',of:'.fbUpload',at:'middle bottom'}).show().find('.fbtipblose').on('click',function () {$('.fbtip').fadeOut()})
		// 		$(document).one('mouseup',function () {$('.fbtip').fadeOut();})
		// 	}
		// },1000)
	}


	function canBorder(){
		$('#border1').off().on('click',function () {
			$(this).toggleClass('on')
			if($(this).hasClass('on')){
				// $('#cborder').css({marginLeft:'0px',marginTop:'0px',zIndex:1000,top:'0px',left:'0px'}).attr( {'width':$('#clipper').width()+10,'height': $('#clipper').height()+10 });
				//  addBorderToCanvas($('#cborder')[0]);
				//   $('#clipper').height($('#clipper').height()+10)
				//   $('#clipper').width($('#clipper').width()+10)
				//  addBorderToCanvas($('#cborder')[0])
			}
			})
		return !(clip.rx1==0 || clip.ry1==0)
	}
	function resetButtons()
		{
		$('#border1')[canBorder() ? 'show' : 'hide']()
		$('.button[tag=undo]').attr('status', currentIndex>-1 ? 'on' :'Disable');
		$('.button[tag=undo]')[currentIndex>-1 ? 'removeClass' :'addClass']('disable');

		$('.button[tag=redo]').attr('status',maxIndex>currentIndex ? 'on' :'Disable');
		$('.button[tag=redo]')[maxIndex>currentIndex ? 'removeClass' :'addClass']('disable');

		$('#toolbar .button').each(function()	{
			$(this).attr('title', $(this).attr('tag'));
			if ($(this).attr('status')=="on"){
				$(this).attr({'src':'images/drawing/' + $(this).attr('tag')+ ($(this).attr("tag")==tool.current? 'On' : 'Off') + '.png'})
						.css({'cursor':'pointer'});
				$(this)[$(this).attr("tag") ==tool.current ? 'addClass':'removeClass']('on');
				}
			else
				$(this).attr({'src':'images/drawing/' + $(this).attr('tag')+ 'Disable.png'})
						.css({'cursor':'not-allowed'});
			});

		}
	function onScroll()
	{
		scrollLeft=$('#divCanvasData').scrollLeft();
		scrollTop=$('#divCanvasData').scrollTop();
	};

//************Binds****************
	function binds()
	{

	$('.linePickerOverlay hr').click(function(){
		lineWidth = parseInt(this.style.height);
		$('.linePickerOverlay').slideUp();
	});
	$('.save-to-pdf').click(createPDF)
	// $('#thumbnail').click(createThumbnails)
	$('#LineWidthPicker').mouseenter(function(){
		var $overlay = $('.linePickerOverlay');
		if (!$overlay.is(":visible")) {
			$overlay.slideDown();
		}
	}).mouseleave(function(){
		$('.linePickerOverlay').slideUp();
	});

	$('.donation').click(function (e) {
    e.preventDefault();
    $('.donation-drop').toggle();
  });
  $('.more-plugins').click(function (e) {
    e.preventDefault();
    $('.more-plugins-drop').toggle();
  });
  $('body').click(function (e) {
    if (!e.isDefaultPrevented()) {
      $('.donation-drop, .more-plugins-drop').hide();
    }
  });

  $(document.body).bind('mousedown', function (e) {
    if (e.button == 0) {
      var dime = pos(e);
      if (!dime) {
        stopTool();
      }
      if (dime && tool.current == 'text') stopTool()
      if (dime && tool.status == 'ready') {
        tool[tool.current].begin(dime);
      }
      if (e.delegateTarget.id == "page-editor") {
        return false;
      }
    }
  });
	$(document.body).bind('mousemove',function (e)
		{
		dime=pos(e);
		$('#divCanvasData').css('default');
		$('#divCanvasData').css('cursor','default');
		if (dime)
			{
			if(tool.status=='ready' || tool.status=='started')
				{
				$('#divCanvasData').css('cursor','crosshair');
				}
			if(tool.status=='started')
				{
				if ($.isFunction (tool[tool.current].move)) tool[tool.current].move( dime);
				}

			}
		});
	$(window).resize(onResize);

	$(document.body).bind('mouseup',function (e)
		{
		dime=pos(e);
//		if (!dime) return;
//		if (dime) if ($.isFunction(tool[tool.current].up)) tryFunc( tool[tool.current].up)
if (tool.current)
		tryFunc( tool[tool.current].up);
		});

//	$(document).bind('keydown','alt+1',function ()
//			{changeTool('free');	});
//
//	$(document).bind('keydown','alt+2',function ()
//			{
//			changeTool('line');
//			});
//	$(document).bind('keydown','alt+3',function ()
//			{
//			changeTool('spray');
//			});
//	$(document).bind('keydown','alt+4',function ()
//			{
//			drawDot(5,2,3,'black');
//			});
//
//	$(document.body).bind('keydown','alt+z',function ()

		$('#toolbar .button').click(function ()
			{
				$this=$(this);
				if ($this.attr('status')=='on')
					{
					changeTool( $this.attr('tag'));
					if ($.isFunction(tool[$this.attr('tag')].click))
						tool[$this.attr('tag')].click();
					$this.attr({'src':'images/drawing/' + $this.attr('tag')+'On.png'});
					$this.addClass('on');
					resetButtons();
					}

			});

	$('#divCanvasData').bind('scroll',onScroll);

	$('#a_share').click(function ()
		{
		postImage();
		});

	$('#save').click(save);
	$('#open').click(open);


	}
//Finishi binding


	function postImage(service)
		{
		service=service || '';
		(function (){
	//		$(this).hide();
			$('#topText').html('uploading <a href="#" id=a_cancel>Cancel</a>');

			var canvas=$('canvas.done')[0];
			var url= screenshot.url;
			var options= localStorage['options'];

			//canvasToDataURL; //.replace(/^data:image\/(png|jpg);base64,/, "")
			hr=$.ajax({url:'https://www.openscreenshot.com/upload3.asp',type:'post',data:{type:localStorage['pngjpg'],title:screenshot.title,description:screenshot.description,imageUrl:url,options:options,data:canvasToDataURL,service:service},
				complete:
				function (a,b,c) {
						if(cancel) {$('#topText').html('Canceled!');$('#save').add('#toGoogleDrive').add('#print').attr('disabled',null); return;}
						noMoreWait();

/* Fixing the vulnerable that discovered by Google */
						var response=a.responseText.replace(/^\s+|\s+$/g,"");  // remove trailing white space
						if (/"/.test(response) || />/.test(response) || /</.test(response) || /'/.test(response) || response.indexOf("http:") != 0 ) {
							$("#topText").html('Please try again in some minutes. We are working to solve this issue.');
						} else {
							if(cancel) return;
							response=response.split(',');
							imageURL = response[0];
							onlineUrl=imageURL;
							imageDelete=response[1];
							shareService(service,imageURL)
						}
	//					$('#topText').html
	//					('<a target="_new" href=' + imageURL + ' style=font-size:10px;>' + imageURL + '</a><br/><a href="#" id="fb"><img alt="" style="vertical-align:middle" src="images/logo_facebook.png"></a><a href="#" id="gmail"><img alt="" style="vertical-align:middle" src="images/logo_gmail.png"></a><a href="#" id="hotmail"><img alt="" style="vertical-align:middle" src="images/logo_msn.png"></a><a href="#" id="myspace"><img alt="" style="vertical-align:middle" src="images/logo_myspace.png"></a><a href="#" id="twitter"><img alt="" style="vertical-align:middle" src="images/logo_twitter.png"></a>');

						onResize();
						}
						});
			})()
		}



//**********Drawing///
	function drawDot(x, y, size, col, trg) {

	x = Math.floor(x)+1; //prevent antialiasing of 1px dots
	y = Math.floor(y)+1;

	if(x>0 && y>0) {

		if(!trg) { trg = c; }
		if(col || size) { var lastcol = trg.fillStyle; var lastsize = trg.lineWidth; }
		if(col)  { trg.fillStyle = col;  }
		if(size) { trg.lineWidth = size; }
		if(trg.lineCap == 'round') {
			trg.arc(x, y, trg.lineWidth/2, 0, (Math.PI/180)*360, false);
			trg.fill();
		} else {
			var dotoffset = (trg.lineWidth > 1) ? trg.lineWidth/2 : trg.lineWidth;
			trg.fillRect((x-dotoffset), (y-dotoffset), trg.lineWidth, trg.lineWidth);
		}
		if(col || size) { trg.fillStyle = lastcol; trg.lineWidth = lastsize; }

		}
	}

	function drawLine()
			{
			c.strokeStyle="rgba(0,0,0,0.1)";
			c.moveTo(100,100);
			c.lineTo(300,300);
			c.stroke();
			}

	function save()
		{
		if (localStorage['lastTool']=='text')
			changeTool('line');
		else changeTool(localStorage['lastTool']);
		pleaseWait();
		window.setTimeout(function () {editor.createLastCanvas('save')},0)
		}
	function share()
		{
		if (localStorage['lastTool']=='text')
			changeTool('line');
		else changeTool(localStorage['lastTool']);
		pleaseWait();
		upload();
		}
	function pleaseWait(){
		cancel=false;
		$('#serviceButtons button').attr('disabled','true').css({'cursor':'default','border':'none'});
		$('#topText').html('Working..')
	}
	function noMoreWait(){
		$('#serviceButtons button').attr('disabled',null).css({'cursor':'','border':''});
		$('#topText').html('');
		cancel=false
	}
	function upload(inService){
		if (localStorage['lastTool']=='text')
			changeTool('line');
		else changeTool(localStorage['lastTool']);
		pleaseWait();
		// console.log(imageChanged);
		if(imageChanged!=localStorage['pngjpg'])
			window.setTimeout(function () {editor.createLastCanvas('share',inService)},0)
		else
			window.setTimeout(function () {shareService(inService,onlineUrl)},0)
		noMoreWait();
	}
	function toGoogleDrive()
		{
		if (localStorage['lastTool']=='text')
			changeTool('line');
		else changeTool(localStorage['lastTool']);
		pleaseWait();
		window.setTimeout(function () {editor.createLastCanvas('toGoogleDrive')},0)
		}
	function open()
		{
		if (localStorage['lastTool']=='text')
			changeTool('line');
		else changeTool(localStorage['lastTool']);
		pleaseWait();
		window.setTimeout(function () {editor.createLastCanvas('open')},0)
		}
	function print()
		{
		if (localStorage['lastTool']=='text')
			changeTool('line');
		else changeTool(localStorage['lastTool']);
		pleaseWait();
		window.setTimeout(function () {editor.createLastCanvas('print')},0)
		}

	}

var editor=new editor_obj();
localStorage['captureCount']++;
editor.window=window;
editor.close=window.close;
editor.captureCount=localStorage['captureCount'];
$(function ()
	{
	editor.init();
	//here
	if(extension.online) {
		if (!editor.appick && !editor.webcam && !editor.intent){
			 window.setTimeout( screenshot.createScreenShot,0 )
		}
	}
});

createFile=function(callback)
	{
	var filename;
	filename=screenshot.title || screenshot.url;
	filename=filename.replace(/[%&\(\)\\\/\:\*\?\"\<\>\|\/\]]/g,' ');
	filename+='-' + (new Date).getHours().toString().twoDigits() + (new Date).getMinutes().toString().twoDigits() + (new Date).getSeconds().toString().twoDigits()
	filename+=localStorage['pngjpg']=='png' ? '.png' : '.jpg';


	if(true){
		var x=dataURItoBlob(canvasToDataURL);
		// console.log(x)
		var y=URL.createObjectURL(x);
		callback(y)
	}
	if(!true)
			{
		//New filesaver
		saveAs(	dataURItoBlob(canvasToDataURL),  filename);
		callback('saved')
			}
	else if(!true)
			{
	onInitFs=function (fs) {
		  fs.root.getFile(filename, {create: true}, function(fileEntry) {
			// Create a FileWriter object for our FileEntry (log.txt).
			fileEntry.createWriter(function(fileWriter) {

			  fileWriter.onwriteend = function(e) {
				console.log('Write completed.');
			  };

			  fileWriter.onerror = function(e) {
				console.log('Write failed: ' + e.toString());
			  };
			  // Create a new Blob and write it to log.txt.
//			  var bb = new window.WebKitBlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
//			  bb.append('Lorem Ipsum');
			  fileWriter.write(dataURItoBlob(canvasToDataURL));

			}, errorHandler);

		  window.setTimeout(function (){callback(fileEntry.toURL())},500);
		  }, errorHandler);
	}
	window.requestFileSystem(window.TEMPORARY, 1024*1024*1024*1024*1024, onInitFs, errorHandler);
		}
	}






///multiline
var multiFillText = function(canvas,text, x, y, lineHeight, fitWidth) {
	var ctx = canvas.getContext('2d');
	var cutOff = 210,
    DEBUG = false;
    var draw = x !== null && y !== null;

    text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
    sections = text.split("\n");

    var i, str, wordWidth, words, currentLine = 0,
        maxHeight = 0,
        maxWidth = 0;

    var printNextLine = function(str) {
        if (draw) {
            ctx.fillText(str, x, y + (lineHeight * currentLine));
        }

        currentLine++;
        wordWidth = ctx.measureText(str).width;
        if (wordWidth > maxWidth) {
            maxWidth = wordWidth;
        }
    };

    for (i = 0; i < sections.length; i++) {
        words = sections[i].split(' ');
        index = 1;

        while (words.length > 0 && index <= words.length) {

            str = words.slice(0, index).join(' ');
            wordWidth = ctx.measureText(str).width;

            if (wordWidth > fitWidth) {
                if (index === 1) {
                    // Falls to this case if the first word in words[] is bigger than fitWidth
                    // so we print this word on its own line; index = 2 because slice is
                    str = words.slice(0, 1).join(' ');
                    words = words.splice(1);
                } else {
                    str = words.slice(0, index - 1).join(' ');
                    words = words.splice(index - 1);
                }

                printNextLine(str);

                index = 1;
            } else {
                index++;
            }
        }

        // The left over words on the last line
        if (index > 0) {
            printNextLine(words.join(' '));
        }


    }

    maxHeight = lineHeight * (currentLine);

    if (DEBUG) {
        ctx.strokeRect(x, y, maxWidth, maxHeight);
    }

    if (!draw) {
        return {
            height: maxHeight,
            width: maxWidth
        };
    }
};
//multiFillText("Many San Franciscans blahblahblahblahblaasdfasdfasdfhblhblaha never travel here, located as it is at the southern edge of the Mission valley, served by only a few city bus lines and perched atop a steep hill, to boot", 0, 0, 15, cutOff);
////multiFillText('blahblahblahblahblahblhblaha sdf ads fa dsf ad', 0, 150, 15, cutOff);
//multiFillText('Right AV Valve - Mitral (Bicuspid) Valve', 0, 150, 15, cutOff);
//multiFillText('right common carotid arteries', 0, 190, 15, cutOff);
//multiFillText("Expressionism can be used to describe various art forms but, in its broadest sense, it is used to describe any art that raises subjective feelings above objective observations. The paintings aim to reflect the artist's state of mind rather than the reality of the external world. The German \nExpressionist movement began in 1905 with artists such as Kirchner and Nolde, who favored the Fauvist style of bright colors but also added stronger linear effects and harsher outlines.", 0, 210, 15, cutOff);
//
//multiFillText('right common\ncarotid arteries', 0, 500, 15, cutOff);​


var googleAuth;
function gDrive(){
	start=function()	{
	$('#topText').html
			('Uploading...');
		googleAuth.authorize(function() {
		// Ready for action
		  googleAuth.getAccessToken();
		  xhr=new XMLHttpRequest();
			xhr.open("POST", "https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart", true);
		 xhr.setRequestHeader('Authorization', 'OAuth ' + googleAuth.getAccessToken())
			var meta = {
			"title": screenshot.title,
			"mimeType": "image/png",
			"description": 'Taken by Screenshot Extension. https://www.openscreenshot.com'
			};
			var bound = 287032396531387;

			var parts = [];
			parts.push('--' + bound);
			parts.push('Content-Type: application/json');
			parts.push('');
			parts.push(JSON.stringify(meta));
			parts.push('--' + bound);
			parts.push('Content-Type: image/png');
			parts.push('Content-Transfer-Encoding: base64');
			parts.push('');
			parts.push(canvasToDataURL.slice(22));
			parts.push('--' + bound + '--');
			xhr.setRequestHeader("Content-Type", "multipart/mixed; boundary=" + bound);
			xhr.onload = function(e){
					console.log("DRIVE OK", this, e);
					e=JSON.parse(this.response);
					if (e.error) {
						googleAuth.clear();
						imageURL=JSON.parse(this.response).id;
						$('#save').add('#print').add('#open').add('#toGoogleDrive').attr('disabled','');
						$('#topText').html
							('Cannot Access;,<a id=trygdrive href=#> try Again</a>.');
						$('#trygdrive').click(gDrive);
					}
					else{
						link=e.alternateLink;
						$('#save').add('#print').add('#open').add('#toGoogleDrive').attr('disabled','');
						chrome.tabs.create({url:link});
						$('#topText').html('');
						$('#save').add('#print').add('#open').add('#toGoogleDrive').attr('disabled','');
							$('#topText').html('');
					xh=new XMLHttpRequest();
					xh.open("POST","https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyC5S6Uxzx6oUxIEHMWZU4eOm7mL6DupChw");
					xh.setRequestHeader('Authorization', 'OAuth ' + googleAuth.getAccessToken());
					xh.setRequestHeader('Content-Type', 'application/json');
					xh.onload=function (e){
						imageURL=JSON.parse(this.response).id;
						$('#save').add('#print').add('#open').add('#toGoogleDrive').attr('disabled','');
						$('#topText').html
								('Saved: <a target="_blank" href=' + imageURL + ' style=font-size:10px;>' + imageURL + '</a><br/>');
						//<a href="#" id="fb"><img alt="" style="vertical-align:middle" src="images/logo_facebook.png"></a><a href="#" id="gmail"><img alt="" style="vertical-align:middle" src="images/logo_gmail.png"></a><a href="#" id="hotmail"><img alt="" style="vertical-align:middle" src="images/logo_msn.png"></a><a href="#" id="myspace"><img alt="" style="vertical-align:middle" src="images/logo_myspace.png"></a><a href="#" id="twitter"><img alt="" style="vertical-align:middle" src="images/logo_twitter.png"></a>');
					}
					xh.send('{"longUrl":"' + link + '"}');
					}

				};
			theParts=parts.join("\r\n");
			xhr.send(theParts);
		});
	}

	// $('#topText').html
	// 		('Authorize');
	// googleAuth = new OAuth2('google', {
	//   client_id: '545443912834-j7vdfe6gar81lu14oatf33tgtlcbi5gq.apps.googleusercontent.com',
	//   client_secret: '213pVJTRShuSGESsRO92G1qV',
	//   api_scope: 'https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/urlshortener https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
	// },start);
}

//Hover Menu

function l(a){
	// v=$('textarea').val()
	// $('textarea').val(v + '\r\n' + a)
}
$(function(){
	$('.hovermenu').sethover()
})


$.fn.sethover=function(x){
	this.each(function (){
		new sethover( $(this))
	})

	function sethover(elm){
		var hideTimeout,newDiv,arrow;

		 setoff=function(){
		 	l(elm.length);
			$(elm).off('mouseenter');
		}
		 seton=function(){
			$(elm).on('mouseenter',showHover)
		}

		showHover=function(){
			l('mousenter')
			var $t=$(this);
			//setoff();

			clearTimeoutFN=function (){
				console.log('clear-hide');
				//alert('remove,' + hideTimeout+ ', ' + $(elm).text());
				if(hideTimeout) window.clearTimeout(hideTimeout);
			}
			hideTimeoutFN=function (){
				clearTimeoutFN();
				console.log('set-hide');
				hideTimeout=window.setTimeout(function (){
					hideTimeout=false;
					 arrow.remove();
					newDiv.add(arrow).fadeOut('fast');
					$t.add('newdiv').off('.hovermenu');
					seton();
				},300);
				//alert('create' + hideTimeout + ', ' + $(elm).text());
			};

			this.donthide=function (){
				clearTimeoutFN();
				$t.add(newDiv).off('.hovermenu');
			//	newDiv.slideDown();
			}

			newDiv=$t.data('hover') ||  $(this).find('.menu');

			$t.data('hover',newDiv);

			$(newDiv).add(this).off('.hovermenu').on(
				{
				'mouseleave.hovermenu':hideTimeoutFN,
				'mouseenter.hovermenu':clearTimeoutFN
			})

			$('a',newDiv).on('click',function (){
				//alert('clicked')
				//return false
			});
			newDiv.show();
			newDiv.position({
				my:'right top+10',
				at:'right bottom',
				of:this
			});

			arrow=$('<div class=sss style=position:absolute;background-repeat:no-repeat;width:16px;height:16px;background-image:url(old/nd/ui_top_triangle.png)></div>')
			$(this).find('.sss').remove()
			$(this).append(arrow);
			arrow.position({
				my:'right bottom',
				at:'right-10 top+2',
				of:newDiv
			})

			newDiv=newDiv.add(arrow);
			getH=newDiv.height();
			//newDiv.hide();
			window.hz = window.hz || 10
			newDiv.css({'z-index':window.hz++,overflow:'hidden'})
			// newDiv.animate({height:getH},'fast')
			//newDiv.fadeIn('fast')
		}
		seton();
	}
}


//

var border =[];
$(function(){
	base='//localhost/www.openscreenshot.com/docs/'
	base='nd/';

	border[1]={
		corner: document.createElement('img'),
		down: document.createElement('img'),
		right: document.createElement('img'),
		empty: document.createElement('img')
	}
	// border[1].corner.src = base + 'corner1.png'
	// border[1].down.src = base + 'down1.png'
	// border[1].right.src = base + 'right1.png'
	// border[1].empty.src = base + 'empty.png'
})

function addBorderToCanvas(e) {
    var c, e

    c = e.getContext('2d');

    corner=border[1].corner
    down=border[1].down
    right=border[1].right
    empty=border[1].empty

    c.drawImage(corner, e.width - corner.width, e.height - corner.height)

     for (var i = e.width - corner.width - down.width; i > down.width; i -= down.width)
        c.drawImage(down, i, e.height - down.height)
    for(;i>=0;i--)
    	c.drawImage(empty, i, e.height - down.height)
    for (var i = e.height - corner.width - right.height; i > right.height; i -= right.height)
        c.drawImage(right, e.width - right.width, i)
      for(;i>=0;i--)
    	c.drawImage(empty, e.width - empty.width, i)
}

function addBorderToDiv(e){
    canvas=document.createElement('canvas')
    canvas.width=$(e).width()+15
    canvas.height=$(e).height()+15
    document.body.appendChild(canvas)
    addBorderToCanvas(canvas)
    $(canvas).position(
    	{my:'left bottom',at:'left+15 bottom+15', of:e,
    	collision :'none',
    	within:e
    	})
}










$(function(){
	var plugins_to_show=defaultPlugins.slice();

	staticPlugin=new Toolbar({
		'plugins':plugins_to_show,
		'element': document.getElementById('toolbarContainer'),
		'namespace':'editor',
		enlargable:false,
		page_title:screenshot.title,
		page_description:screenshot.description,
		page_url:screenshot.url,
		doNotRenderDefaults: true,
		whiteIcons: true,
		button_size: 20,
		'icon_base':'images/',
		'position':'static',
		'type':'image',
		'theme': true,
		request:function (callback){
			editor.createLastCanvas('toolbar',function (data){
				callback(data)
			})
		},
		requestText:function (callback){
			alert('you asked to get the text');
			callback();
		}
  });

	$('.share').on('click',function (e){
		var x=staticPlugin.getPluginByKey('openscreenshot')
		editor.createLastCanvas('toolbar',function (data){
			x.run(data, e);
		});
	});
	
	$('.save').on('click',function (e){
		var x=staticPlugin.getPluginByKey('save')
		editor.createLastCanvas('toolbar',function (data){
			x.run(data, e)
		})
	});

	$('.save-to-printer').on('click',function (e){
		var x=staticPlugin.getPluginByKey('print')
		editor.createLastCanvas('toolbar',function (data){
			x.run(data, e)
		})
	});

	$('.save-to-clipboard').on('click',function (e){
		var x=staticPlugin.getPluginByKey('copy');
		editor.createLastCanvas('toolbar', function (data){
			x.run(data, e)
		})
	});

	// $('.save-to-thumbnail').on('click', createThumbnails);

	$('.fbUpload').on('click',function (e){
		var x=staticPlugin.getPluginByKey('framebench')
		editor.createLastCanvas('toolbar',function (data){
			x.run(data, e);
		});
	});

	document.addEventListener("keydown", function(e) {
		if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
			e.preventDefault();
			var x=staticPlugin.getPluginByKey('openscreenshot');
			editor.createLastCanvas('toolbar', function (data){
				x.run(data, e)
			});
		}
	}, false);
});

if (location.hash == "#paste") {
  (function (e) {
    var t;
    e.event.fix = function (e) {
      return function (t) {
        t = e.apply(this, arguments);
        if (t.type.indexOf("copy") === 0 || t.type.indexOf("paste") === 0) {
          t.clipboardData = t.originalEvent.clipboardData
        }
        return t
      }
    }(e.event.fix);
    t = {callback: e.noop, matchType: /image.*/};
    return e.fn.pasteImageReader = function (n) {
      if (typeof n === "function") {
        n = {callback: n}
      }
      n = e.extend({}, t, n);
      return this.each(function () {
        var t, r;
        r = this;
        t = e(this);
        return t.bind("paste", function (e) {
          var t, i;
          i = false;
          t = e.clipboardData;
          return Array.prototype.forEach.call(t.types, function (e, s) {
            var o, u;
            if (i) {
              return
            }
            if (e.match(n.matchType) || t.items[s].type.match(n.matchType)) {
              o = t.items[s].getAsFile();
              u = new FileReader;
              u.onload = function (e) {
                return n.callback.call(r, {
                  dataURL: e.target.result,
                  event: e,
                  file: o,
                  name: o.name
                })
              };
              u.readAsDataURL(o);
              return i = true
            }
          })
        })
      })
    }
  })(jQuery);
  
  $(function () {
    $('<center class=paste_modal style="position:absolute;top:150px;width:100%"><br><span style="padding:20px;font-size:40px;border:1px solid black">Press Ctrl+V to paste an image</span></center>').appendTo(document.body);
    $("html").pasteImageReader(function (e, t, n) {
      $(".paste_modal").remove();
      var r = document.createElement("img");
      r.src = e.dataURL, canvas = $("canvas")[1], img = $("#imgFixForLong")[0];
      img.onload = function () {
        canvas.width = this.width, canvas.height = this.height, firstImage = this, canvas.getContext("2d").drawImage(this, 0, 0), editor.reloadCanvas()
      };
      img.src = r.src
    });
  })

};
$(function() {
    if (location.hash == "#capture")
    {
      //background.title = "Screen Capture";
      // $("title").text(background.title);
      //  staticPlugin.page_title = background.title;
        alert("You can capture any window, just make sure it\'s not minimized.\nThis feature is still in a beta, so please contact me and share your experience");
        chrome.desktopCapture.chooseDesktopMedia(["window", "screen"], function(n) {
        n && navigator.webkitGetUserMedia({
            audio: !1,
            video: {
                mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: n,
                    maxWidth: 3e3,
                    maxHeight: 3e3
                }
            }
        }, function(n) {
			// debugger
            video = document.createElement("video")
			video.src = URL.createObjectURL(arguments[0])
			window.setTimeout(function() {
                cs = document.createElement("canvas")
				cs.width = video.videoWidth
				cs.height = video.videoHeight
				cs.getContext("2d").drawImage(video, 0, 0, cs.width, cs.height)
				// n.stop()
				image = document.createElement("img")
				image.src = cs.toDataURL()
				canvas = $("canvas")[1]
				img = $("#imgFixForLong")[0]
				img.onload = function() {
                    canvas.width = this.width
					canvas.height = this.height
					firstImage = this
					canvas.getContext("2d").drawImage(this, 0, 0)
					editor.reloadCanvas()
                }, img.src = image.src
            }, 500)
        }, function() {})
    	})
	}
});


$(function(){
	window.setTimeout(function(){
		$(document).trigger('resize')
	},100)
});

$(function() {
$('.icon').click(function() {

        if (localStorage.showrat) return;
        localStorage.showrat = true
        window.setTimeout(function() {
            $('.pleaseRate').remove();
            $('<div class=pleaseRate style="font-size:40px;padding:10px;background-color:white;border:1px solid gray;border-radius:3px">Do you like Screenshot Extension?<hr><div style=font-size:22px;text-align:center>Please rate us!<br>We really appreciate your 5-star review and we thank you for taking the time.<br><br><button><a target=_blank href="https://chrome.google.com/webstore/detail/akgpcdalpfphjmfifkmfbpdmgdmeeaeo/reviews" style="padding:20px;font-size:20px;font-weight:bolder">Rate now</a>&nbsp;<button>No Thanks</button><br><a href="https://github.com/AminaG/openscreenshot">Fork on GitHub</a></div>')
            .css({
                top: '100px',
                left: '15%',
                'position': 'absolute'
            }).hide().appendTo(document.body).slideDown();
            $(document).off('.slideup').on('click.slideup', function() {
                $('.pleaseRate').slideUp()
            })
        }, 3000)
    })
})