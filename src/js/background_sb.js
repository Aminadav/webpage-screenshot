var selectionBar={
	isEnableSelectionBar:function(url){
		if (localStorage['show_selectionbar']!='yes') return false
		url=cleanUp(url);
		if(!url) return false
		var j= JSON.parse(  localStorage['selectionbar_disableURLs'] || '{}' )
		if(j[url]=='disabled') return false;
		return true;
	},
	isEnableToolbar:function(url){
		if (localStorage['show_toolbar']!='yes') return false
		url=cleanUp(url);
		if(!url) return false
		var j= JSON.parse(  localStorage['toolbar_disableURLs'] || '{}' )
		if(j[url]=='disabled') return false;
		return true;
	}
}

function cleanUp(url) {
  if (!url) return url
  var url = $.trim(url);
  if (url.search(/^https?\:\/\//) != -1)
    url = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i, "");
  else
    url = url.match(/^([^\/?#]+)(?:[\/?#]|$)/i, "");
  return url[1];
}