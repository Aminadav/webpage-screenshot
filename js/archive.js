
function archivePage(screenshot_data){

  var pngDataURItoBlob=function(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'})
  }

  var send_download = function(blob,dt,dtype,ext){
    var url=URL.createObjectURL(blob);
    console.log(url);
    var evt = document.createEvent("MouseEvents");evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, true, false, false, 0, null);
    var a=$('<a></a>').appendTo(document.body);
    var filename = 'webarc_' + dt.getTime() + '.' + dtype + '.' + ext;
    a.attr({'href':url,'download':filename})[0].dispatchEvent(evt);
  };

  let now = new Date();
  //PAGE SRC
  var blob_src = new Blob([ screenshot_data['captureCodeTxt'] ], {type : "text/plain;charset=utf-8"});
  send_download(blob_src,now, 's','html');


  //META
  var meta = {
    'url': screenshot_data['url'],
    'title': (screenshot_data['title'] || ''),
    'dt': now.toISOString()
  };
  var blob_meta = new Blob([ JSON.stringify(meta, null, 2) ], {type : "text/plain;charset=utf-8"});
  send_download(blob_meta,now, 'm','json');

  //IMAGE
  var blob_image = pngDataURItoBlob(screenshot_data['image_data']);
   send_download(blob_image,now, 'i','png');
}