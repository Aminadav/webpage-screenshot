document.addEventListener('ws-data',function (e){
	console.log('intab',e)
	chrome.runtime.sendMessage({data:'event',eventData:e.data})
})
console.log(1);
document.addEventListener('getOptions',function (e){
	loadjQuery();
	$(function (){chrome.runtime.sendMessage({data:'event',eventData:{type:'options'}},function(o){
	a=document.createEvent('MessageEvent');
	a.initMessageEvent('options',false,false,o);
	document.dispatchEvent(a)
	})})
})

/*

	"content_scripts": [{
		"matches": ["http://www.webpagescreenshot.info/*", "https://www.webpagescreenshot.info/*"],
		"js": ["inmysite.js"],
		"run_at": "document_start"
	}, {
		"matches": ["http://www.webpagescreenshot.info/robots*.asp*"],
		"js": ["oauth2/oauth2_inject.js"],
		"run_at": "document_start"
	}],
	*/