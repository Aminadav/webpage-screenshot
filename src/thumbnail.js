function createThumbnails(){
	var $html
	$html=$('<div>Click an image to save</div>')

	editor.createLastCanvas();
	dataUrl=$('canvas').last()[0].toDataURL()
	dataUrl=dataUrl.slice(22) //23 for jpeg
	var bigImage=new Image()
	bigImage.src='data:image/png;base64,' + dataUrl
	bigWidth=$('canvas').last()[0].width
	bigHeight=$('canvas').last()[0].height
	aspectWH=$('canvas').last()[0].width/$('canvas').last()[0].height

	tCanvas=$('<canvas></canvas')[0];
	fixedWidth=[75,150,300];
	fixedHeight=fixedWidth;
	fixed=fixedHeight;
	$html.append('<div>Fixed Width:</div>')
	for(x in fixedWidth){
		tCanvas.width=fixedWidth[x]
		tCanvas.height= fixedWidth[x] / aspectWH
		tCanvas.getContext('2d').drawImage(bigImage,0,0,bigWidth,bigHeight,0,0,tCanvas.width,tCanvas.height)
		$t=$('<div class=image><div><b>' + fixedWidth[x] + '</b> x ' + tCanvas.height + '</div></div>')
		$('<img>').attr('src',tCanvas.toDataURL()).appendTo($t);
		$t.appendTo($html);
	}
	$html.append('<br><div style=clear:both>Fixed Height:</div>')
	for(x in fixedHeight){
		tCanvas.height=fixedHeight[x]
		tCanvas.width= fixedHeight[x] * aspectWH
		tCanvas.getContext('2d').drawImage(bigImage,0,0,bigWidth,bigHeight,0,0,tCanvas.width,tCanvas.height)
		$t=$('<div class=image><div>' + tCanvas.width  + ' x <b>' +  fixedHeight[x] + '</b></div></div>')
		$('<img>').attr('src',tCanvas.toDataURL()).appendTo($t);
		$t.appendTo($html);
	}
	$html.append('<br><div style=clear:both>Fixed Width & Height:</div>')
	for(x in fixedHeight){
		tCanvas.height=fixed[x]
		tCanvas.width= fixed[x]
		tWidth=bigWidth
		tHeight=bigHeight
		if(tWidth<tHeight)
			tHeight=tWidth;
		else
			tWidth=tHeight;
		tCanvas.getContext('2d').drawImage(bigImage,0,0,tWidth,tHeight,0,0,tCanvas.width,tCanvas.height)
		$t=$('<div class=image><div>' + tCanvas.width  + ' x ' + tCanvas.height + '</div></div>')
		$('<img>').attr('src',tCanvas.toDataURL()).appendTo($t);
		$t.appendTo($html);
	}
	$("<div style=clear:both></div>").appendTo($html);
	$('.image',$html).css({
		"text-align":"center",
		border:"1px solid gray",
		float:"left",
		margin:"1"
	})	
	$('img',$html).css({
		cursor:'pointer'
	}).on('click',function (){
		dataURItoBlob=function(dataURI) {
				var binary = atob(dataURI.split(',')[1]);
				var array = [];
				for(var i = 0; i < binary.length; i++) {
					array.push(binary.charCodeAt(i));
				}
				return new Blob([new Uint8Array(array)], {type: 'image/jpeg'})
					}
		x=dataURItoBlob(this.src)
		url=URL.createObjectURL(x)
		var filename;
		filename=(screenshot.title || screenshot.url) + '.pdf';
		filename=filename.replace(/[%&\(\)\\\/\:\*\?\"\<\>\|\/\]]/g,' ');
		filename+='.png';
		var evt = document.createEvent("MouseEvents");evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, true, false, false, 0, null);
		a=$('<a></a>').appendTo(document.body);
		a.attr({'href':url,'download':filename})[0].dispatchEvent(evt)
	})
	var d=new Dialog({
		html:$html,
		title:'Thumbnails',
		ui:'dialog'
	})
	d.show()	
}