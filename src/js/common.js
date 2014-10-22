
function cleanUp(url) {
  if (!url) return url
  var url = $.trim(url);
  if (url.search(/^https?\:\/\//) != -1)
    url = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i, "");
  else
    url = url.match(/^([^\/?#]+)(?:[\/?#]|$)/i, "");
  return url[1];
}