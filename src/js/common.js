
function cleanUp(url) {
  if (!url) return url
  var url = $.trim(url);
  if (url.search(/^https?\:\/\//) != -1)
    url = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i, "");
  else
    url = url.match(/^([^\/?#]+)(?:[\/?#]|$)/i, "");
  return url[1];
}
function objectUrlToBlob(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    if (this.status == 200) {
      callback(this.response)
    }
  };
  xhr.send()
}