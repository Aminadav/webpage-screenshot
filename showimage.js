background=chrome.extension.getBackgroundPage().background;

var showImage={
	load : function()
		{
		$('#bug')[background.lastImg.data.length>2000000 ? 'show' : 'hide']();
		var img=new Image()
		img.src=background.lastImg.data;
		img.onload=function(){
			$('#theimage').append(img);
			}
		
		}
	}

$(showImage.load);