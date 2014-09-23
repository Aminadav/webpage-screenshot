document.getElementById('q').href=location.hash.substring(1)
var evt = document.createEvent("MouseEvents");evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, true, false, false, 0, null);
document.getElementById('q').dispatchEvent(evt)