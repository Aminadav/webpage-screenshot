function iGet(theImage){
	alert(theImage.length);
	$('text').html(theImage);
}
chrome.runtime.sendMessage({type:'getScreenshot',id:location.hash},IGet)