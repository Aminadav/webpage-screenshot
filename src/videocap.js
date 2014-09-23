window.URL=window.webkitURL;
navigator.getUserMedia=navigator.webkitGetUserMedia

function onFailSoHard(e){
console.log(e)
}
var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var localMediaStream = null;

function snapshot() {
  if (localMediaStream) {
	canvas.width=video.videoWidth
	canvas.height=video.videoHeight
    ctx.drawImage(video, 0, 0);
    // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
    //document.querySelector('img').src = canvas.toDataURL('image/webp');
	background=chrome.extension.getBackgroundPage().background;
	background.webcam= canvas.toDataURL('image/webp');
	background.title='Webcam Capture';
	background.description='';
	chrome.tabs.create({url:chrome.extension.getURL('editor.html')});
  }
}

video.addEventListener('click', snapshot, false);
document.getElementById('btnTs').addEventListener('click',snapshot);

// Not showing vendor prefixes or code that works cross-browser.
navigator.getUserMedia({video: true}, function(stream) {
  video.src = window.URL.createObjectURL(stream);
  localMediaStream = stream;
}, onFailSoHard);