var extension={
	dir : '',
	ver: function(fir,sec)
		{
		if (!sec) {sec=extension.manifest.version;};
		if (!fir) {fir=extension.manifest.version;};
		fir=fir.split('.');
		sec=sec.split('.');
		for(var i=0;i<fir.length;i++)
			{
			try{
				fir[i]=parseInt(fir[i],10)
				sec[i]=parseInt(sec[i],10)
			}
			catch(e){}
			if (fir[i]>sec[i] || !sec[i])
				return {left:true,right:false,equal:false,string:'left'};
			if (fir[i]<sec[i])
				return {left:false,right:true,equal:false,string:'right'};
			}
		if (!fir[i] && sec[i]) return {left:false,right:true,equal:false,string:'right'};
		return ({left:false,right:false,equal:true,string:'equal'});
		},
	manifest : '',
	version : 0,
	online:true,
	load : function ()
		{
		try{extension.dir=chrome.i18n.getMessage('dir');} catch (e) {extension.dir='ltr';extension.online=false}
		if(window.jQuery)
			{
			if (extension.online)
				{
				extension.manifest=JSON.parse( jQuery.ajax( {url:'manifest.json',async:false }).responseText);

				extension.version=extension.manifest.version;
				jQuery(function(){
				jQuery('.msg').each(function () {jQuery(this).html(chrome.i18n.getMessage(jQuery(this).attr('tag'))); });
				jQuery('.ver').each(function () {jQuery(this).html(extension.manifest.version); });
				jQuery(document.body).attr('dir', extension.dir) ;
				var prom=[];
				prom.push({
					title:'Server Ping',
					href:'https://chrome.google.com/webstore/detail/kkhikhabhkibcmceifbkcddldcbachpn',
					img:'https://chrome.google.com/webstore/img/kkhikhabhkibcmceifbkcddldcbachpn/1291646755.31/thumb72?itemtype=app'
					});
				prom.push({
					title:'Hash',
					href:'https://chrome.google.com/webstore/detail/dhakammohmlhhhbcmjhcngkkpjbnakih',
					img:'https://chrome.google.com/webstore/img/dhakammohmlhhhbcmjhcngkkpjbnakih/1287601891.05/thumb72?itemtype=app'
					});
				prom.push({
					title:'DNS Lookup',
					href:'https://chrome.google.com/webstore/detail/odhajmgdndjhboghafonbfafhklgjgnc',
					img:'https://chrome.google.com/webstore/img/odhajmgdndjhboghafonbfafhklgjgnc/1291644139.45/thumb72?itemtype=app'
					});
				prom.push({
					title:'Send Anonymous Email',
					href:'https://chrome.google.com/webstore/detail/hmhilnpniljpeembobdnlmdmcmllbhll',
					img:'https://chrome.google.com/webstore/img/hmhilnpniljpeembobdnlmdmcmllbhll/1291635877.15/thumb72?itemtype=app'
					});
				jQuery(".prom").each(function(){
					var i=Math.round( Math.random()* (prom.length-1))
					$(this).html(
						'Try: <a class=pophref href="' + prom[i].href + '"><img valign=middle width=22px src="' + prom[i].img + '">' + prom[i].title + '</a>'
						);
					})
				jQuery('a.pophref').on('click',document.body,function () {window.open(this.href,'_new')})
				});
				}
			}
		else
			{
			console.log('extension.js cannot work without jQuery');
			}
		}
	}

if (navigator.appVersion.indexOf("Win")!=-1) extension.windows=true;
if (navigator.appVersion.indexOf("Mac")!=-1) extension.mac=true;
if (navigator.appVersion.indexOf("X11")!=-1) extension.x11=true;
if (navigator.appVersion.indexOf("Linux")!=-1) extension.linux=true;


local=false;
function testi18(){
	extension.online=false;
	chrome.i18n={
		getMessage:function(ina){
			return 'm(' + ina + ')';
		}
	}
	chrome.permissions={
		contains:function () {return true}
	}
}


function lj_get(namespace,key,def){
	var temp;
	if(!namespace) {console.log('required parameters namespace');return}
	if(!key) {console.log('required parameter key');return}
	temp=localStorage[namespace] || '{}'
	try{
		temp=JSON.parse(temp)
	}
	catch(e){
		temp={}
	}
	return temp[key] ==undefined ? def : temp[key]
}

function lj_set(namespace,key,value){
	var temp;
	if(!namespace) {console.log('required parameters namespace');return}
	if(!key) {console.log('required parameter key');return}	
	temp=localStorage[namespace] || '{}'
	try{
		temp=JSON.parse(temp)
	}
	catch(e){
		temp={}
	}	
	temp[key]=value
	localStorage[namespace]=JSON.stringify(temp)
}

if(!chrome.i18n) testi18()


extension.load();

