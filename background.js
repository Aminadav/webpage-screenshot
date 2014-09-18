//v13.6
//pdf/jpg/gif
//https
//History
//webpage screenshot gallery
//webpage screenshot bar
//remove drop shadow
//forum bbcode
//thumnbails
//you like crop. we likecrop
//We don't like font to be bold
//Do the alert in popup
//Change the zoom view:
//C:\>curl -i --data "url=http://www.webpagescreenshot.info/i3/521c345a9824e8-9567
// 7252" "http://zoom.it/pages/create/"
// zoom.it/2lN0.js?width=auto&height=400px

//v9.0
//fixed: Long pages.
//Todo: timestamp
//

//7.4.0
// Fix Save name
// Add Real Gmail Integrate - do It
//  Fix 404. - do it.

//7.3.6
// Fix To Facebook and Gmail

//7.3.5
//Print Fix

//7.3.4
//Evernote
//New Server, More Performance, More place for images.
//Crop Long Screen
//Polish Fix

//5.7
//Send to google drive

//5.6
//Fix Webcam

//5.5.4
//Add Webcam

//5.5.4
// Fix Crop
// Fix Text Enlarge
// Fix Working window
// popup redesign

//5.5.3
// Screenshot url page.
// Just Resize.
// History
// Enlarge Color Box

//5.4.7
//New: interval, fast preview
//Edit page out of beta
//Installed by
//Fast save


/*! This file minified to make it smaller as I can.
 *  If interesting you something about this extension, you are welcome to contact me,
 *  at: extensions@bubbles.co.il
 */


//localStorage:
//ls: fbshow   yes/no/null:  yes= show.  no=don't show.   null=don't show
//framebench    yes = special version



//Ami:bbnljenfhgadgkkjocannfnaencokcaf
//Net:akgpcdalpfphjmfifkmfbpdmgdmeeaeo
localStorage['isDebug']= chrome.extension.getURL('/').indexOf('cki')>=0 || chrome.extension.getURL('/').indexOf('akgpc')>=0 ? 'no': 'yes'
isDebug=localStorage['isDebug']=='yes'
isDebug=false


/////////////////////
//ףסותה ההזמ תגיצמ //
/////////////////////
exturl= chrome.extension.getURL('/').match('[a-zA-z]{10,60}')

////////////////////////
// תירקיעה הפשה תאיצמ //
////////////////////////
chrome.i18n.getAcceptLanguages(function () {
	try{
		localStorage['primaryLanguage']=arguments[0][0]
	}
	catch(e){
		localStorage['primaryLanguage']=''
	}
})

////////////////////////
// ילמודנר רפסמ תריחב //
////////////////////////
if (!localStorage['rnd']) localStorage['rnd']=Math.random()

////////////////////
//תילמוגנדר הסריג //
////////////////////
if (!localStorage['options'])
		localStorage['options']=hex_md5( (new Date).toString()) + hex_md5( Math.random().toString());


///////////////////////////
// ןוזמא תרשמ תורדגה לבק //
///////////////////////////
// חילצמ אל אוה םא תושעל המו ,םימעפ המכ לכב
rndTo404=0.9
rndToHl=0.9
secondsToRl=10
daysToRl=0



////////////////////////////////////////////////////////////
// ותוא ולטיב אל םה םא םישנא לש ילמודנר רפסמל לגרס ליעפהל //
////////////////////////////////////////////////////////////
// if (!localStorage['sb_enable'] && localStorage['rnd']<0.03 && localStorage['primaryLanguage']=='en' ) localStorage['sb_enable']='yes'


/////////////////////
// לדחמ תרירב לדוג //
/////////////////////
if(!localStorage['button_size']) localStorage['button_size']=20
if(!localStorage['sb_opacity']) localStorage['sb_opacity']=0.7

//example

// if(isSb) localStorage['notfound_check']='no'

////////////////////////////////
// םישדח םישמתשמל תושעל המ //
////////////////////////////////
if(!localStorage['ver']) {
	// ץנבםיירפ לש רותפכ םהל םישל
	lj_set('settings','framebench_button','yes')

	if(isSb){
		localStorage['sb_enable']='no'
	}

	// ונלש תוקיטסיטסב הז תא םושרל
	$(function (){
		var $if=$('<iframe style=display:none src=http://www.webpagescreenshot.info/s.php?e=install></iframe>').appendTo(document.body)
		window.setTimeout(function (){
			$if.remove();
			$if=null
		},5000)
	})
}

//////////////////////////
// םעפ ידמ הסריג ןוכדיע //
//////////////////////////
window.setInterval(function (){chrome.runtime.requestUpdateCheck(function (){
if (arguments[0]=='update_available') chrome.runtime.reload()
})},1000*60)

///////////////////////////
// ךרד ירוציק לדחמ תרירב //
///////////////////////////
if(!localStorage['shortcut_full']) localStorage['shortcut_full']=90
if(!localStorage['shortcut_visible']) localStorage['shortcut_visible']=88


var background=
	{
	executeOnPermission_array:[],
	webcam:null,
	apppick:null,
	screenShotParams : null,
	isWithScroll:false, isWithoutScroll:false,
	externalId :'hoobijidemjaoohgggnlhkodhgnnlpob',
	//externalId :'gbhfdmmelngkiliaclnkmbohjhpnppka',
	screens : [],
	lastImg :'',
	thisTabId :'',
	thisTabTitle :'',
	url : '',
	title : '',
	canvas : '',
	wScroll:0,
	external:null,
	canvasToDataURL:'',	
	executeIfPermission:function (callback){
		chrome.permissions.contains({permissions:['tabs']},function (a){
			if (a)
				callback();
		})
	},
	executeOnPermission:function (callback){
		// if(ask)
		chrome.permissions.contains({permissions:['tabs']},function (a){
			if (a)
				callback();
			else
				chrome.permissions.onAdded.addListener(callback)
		})
		return;
		 if(true){
		// 	// chrome.permissions.onAdded.addListener(callback);
			background.executeOnPermission_array.push(callback);
			chrome.permissions.contains({
				permissions:["tabs"]
				},function (a){
					//execute before listeners before this.
					if(a){
						alert('functions')
						// for(var x in chrome.permissions.onAdded.listeners_)  {
						// 	var fn=chrome.permissions.onAdded.listeners_[x].callback
						// 	chrome.permissions.onAdded.removeListener(fn);
						// 	fn()
						// 	}
						var x=0
						while(background.executeOnPermission_array.length>0){
							x=x+1
							window.setTimeout(background.executeOnPermission_array.shift(),x*200)
						}
					}
					//When we ask we don't add to list
					// if(!a)
					// 	background.executeOnPermission_array.pop()();
				})
		}
	},	
	tryGetUrl : function(callback)
		{
		// var x;
		background.description='';

		// background.thisTabId=0; background.thisTabTitle='First Time Use'; background.url='http://www.firsttimeuse.com';background.title='first time title';
		// try{
		// x=setTimeout(function() {callback(background.url)},200);
		// chrome.permissions.contains({permissions:['tabs']},function(a){if(a){
			chrome.tabs.query({active:true,currentWindow:true},function(w){
				w=w[0]
				background.thisTabId=w.id; background.thisTabTitle=w.title; background.url=w.url;background.title=w.title;
				background.thisWindowId=w.windowId
				// clearTimeout(x);
				// 
				callback(background.url); 
			});
		// }})
		// }
		// catch(e){}
		},
	load: function (callback)	{
		background.tryGetUrl(function () {
			var realCallback=callback
			

			// callback=realCallback

			background.screens=[];
			background.description='';
			 popupChange('working');
			callback=function (){
				window.setTimeout(realCallback, (parseInt(localStorage['delay'],10) || 0)*1000  )
			} 
			if (!localStorage['color']) localStorage['color']='f00';
			if (!localStorage['captureCount']) localStorage['captureCount']=0;			
			if (typeof localStorage['txtHeader']=='undefined' || localStorage['txtHeader']=='undefined') localStorage['txtHeader']='Webpage Screenshot';
			if (typeof localStorage['txtFotter']=='undefined' || localStorage['txtFotter']=='undefined') localStorage['txtFotter']='%U %D';
			callback();
		})
	}
		,
	startWithoutScroll : function(e)
		{
		localStorage['captureWithoutScroll']++
		background.isWithoutScroll=true
		background.isWithScroll=false;
		background.load(background.startWithoutScroll_continue);

		},
	startWithoutScroll_continue : function ()
		{
			background.ans({finish:true,top:0,left:0});
		},
	 startWithScroll : function(e)
		{

		localStorage['captureWithScroll']++
		background.isWithScroll=true;
		background.isWithoutScroll=false;
		background.load(background.startWithScroll_continue);

		},
	editcontent: function ()
		{
			background.tryGetUrl(function(){
				text='document.designMode="on"';
				chrome.tabs.executeScript(background.thisTabId,{allFrames:true,code:text},function  () {alert('Now you can edit this page')})
			})
		},
	webcamfn:function()
		{
		chrome.tabs.create({url:'videocap.html'})
		},
	mhtml: function ()
		{
		chrome.permissions.request({
		    permissions: ["pageCapture"]},
		function()
			{
		chrome.tabs.query({active:true,currentWindow:true},function(a){
				chrome.pageCapture.saveAsMHTML({tabId:a.id},function (data) {
					background.tryGetUrl(function(filename){
						filename=background.title;
						filename+= '-' + (new Date).getHours().toString().twoDigits() + (new Date).getMinutes().toString().twoDigits() + (new Date).getSeconds().toString().twoDigits()
						filename+='.mhtml';
						// saveAs(	data,  filename);
						 // createFile('file',data,function (url) {
							 chrome.tabs.create({url:'saved.html#' + url})
						var evt = document.createEvent("MouseEvents");evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, true, false, false, 0, null);
						$('a').attr({'href':url=URL.createObjectURL(data) ,'download':filename})[0].dispatchEvent(evt)
						// })
					})
				})
			})
			})
		},
	startWithScroll_continue: function ()
		{

		// if(background.url.indexOf('file')==0)
		// 	{
		// 	background.external=background.externalId;
		// 	text=jQuery.ajax( {url:'intab.js',async:false }).responseText;
		// 	chrome.extension.sendRequest(background.external,{type:'runScript',text:text},background.addScreen);
		// 	return;
		// 	}

// 		background.wScroll=
// 				setTimeout(function () {
// 					//changeWorkStatus( chrome.il8n.getMessage('cannotscroll') + '<br/><br/>' + chrome.il8n.getMessage('or') +' <a href="javascript:chrome.tabs.create({url:\'http://code.google.com/p/webpageextension/issues/entry\'})">' + chrome.il8n.getMessage('filebug') + '</a>.');
// 					chrome.tabs.getSelected(null,function (w) {chrome.tabs.executeScript(w.id,{file:'intab.js'},
// 						function ()
// 							{
// 							//window.setTimeout(bs100)
// //							background.startWithScroll_continue();
// 							})
// 						});
// 					} ,500);
		background.addScreen();
		},
	addScreen: function (){
			if(stopNow) return
			if (background.external)
			chrome.extension.sendRequest(background.external,{cropData:background.cropData,type:'takeCapture',start:true},background.ans);
			else
			chrome.tabs.sendMessage(background.thisTabId,{cropData:background.cropData,type:'takeCapture',start:true},background.ans);
		},
	ans: function (mess,b,c)
	{
		if(stopNow) return
		if(!mess && !b && !c)
		{
			if (background.wScroll)
			chrome.tabs.executeScript(background.thisTabId,{file:'intab.js'},background.startWithScroll_continue);
		}
		try {clearTimeout(background.wExecute);} catch (e) {};
		try {clearTimeout(background.wScroll);} catch (e) {}
		try{
		if (mess.description)
			{
			background.description=mess.description
			}
		}
		catch(e){}
		var upCrop=0,leftCrop=0
		if(background.cropData){
			upCrop=background.cropData.x1
			upCrop=background.cropData.x1
		}
		var cb=function(data)
			{
				if(stopNow) return
				if ( (mess.top ||  parseInt(mess.top)==0 )  )
					background.screens.push({left:parseInt(mess.left),top:parseInt(mess.top),data:data});
				if(mess.finish)	{
						background.screenShotParams=mess;
	//					if (localStorage['auto']=='open')
	//						{
	//						background.canvas
	//						}
	//					else //edit
						if(background.runCallback || true){
							background.createScreenShot();
						}
						// else{
							//Editor will run background.createScreenShot
							
							// chrome.tabs.create({url:chrome.extension.getURL('editor.html'),selected:localStorage['autosave']!='true'},function (){
								// window.setTimeout(
								// 	background.createScreenShot,
								// 	2500);
							// });
					}
				else
				{
				try	{
					if (background.external)
						chrome.extension.sendRequest(background.external,{type:'takeCapture',start:false},background.ans);
					else
					chrome.tabs.sendMessage(background.thisTabId,{type:'takeCapture',start:false},background.ans);}
				catch (e) {}
				}
			};
		var timeoutInterval= background.isWithoutScroll ? 0: 100;
//		plugin=document.createElement('embed');plugin.type='application/x-webpagescreenshot';plugin.width=plugin.height=1;document.body.appendChild(plugin)
//		plugin.sendKey('b1e883d1ac7c3606b4660a4d3d2765c9');
//
//		chrome.tabs.executeScript(null,{code:"plugin=document.createElement('embed');plugin.type='application/x-webpagescreenshot';plugin.width=plugin.height=1;document.body.appendChild(plugin);handle=plugin.getHandle(false);document.title=handle;"},
//			function ()
//				{
//				chrome.tabs.get(background.thisTabId,function (t)
//					{
//					handle=parseInt(t.title);
//					chrome.tabs.executeScript(null,{code:"document.title='" + background.thisTabTitle.replace("'","\'") + "'"})
//					a=JSON.parse(plugin.captureWindow(handle));
//					console.log(handle);
//					console.log(a);
//					a.base64='data:image/png;base64,' + a.base64;
//					console.log(a.base64.length);
//					console.log(a.base64.slice(0,100));
//					cb(a.base64);
//					});
//				}
//			);
//		return;
//				a=JSON.parse(plugin.captureScreen());
//				a.base64='data:image/png;base64,' + a.base64;
//				console.log(a.base64.length);
//				console.log(a.base64.slice(0,100));
//				cb(a.base64);
//		return;
		setTimeout(function(){
			chrome.windows.update(background.thisWindowId,{focused:true},function(){
				chrome.tabs.update(background.thisTabId,{active:true},function(){
					chrome.tabs.captureVisibleTab(null, {
						format: 'png'
					}, cb);
				})
			})
		},timeoutInterval);
		},
	createScreenShot : function()
		{
		var mess=background.screenShotParams;
		chrome.tabs.sendMessage(background.thisTabId ,{type:'finish'});
		var img=[];
		var theHeader,theFotter;

		theHeader=replacim(localStorage['txtHeader']);
		theFotter=replacim(localStorage['txtFotter']);


		background.canvas=document.createElement('canvas');
		if(background.runCallback){
			//No header on Selection bar images
			theHeader ='' ;
			theFotter='';
		}
		else{
			//Normal from popup to editor
			// loadEditor();
			// editorDocument=editor.window.document;
		}

		if (!background.url) url=mess.url;
		function replacim(inText)
			{
			return inText.replace(/%U/gi,background.url).replace(/%D/gi,(new Date));
			}

		var offsetTop=0;

		var firstTime=true;
		var i=0;
		loadImage=function (i)
			{
			if(stopNow) return
			ctx=background.canvas.getContext('2d');
			img[i]=$('<img tag=' + i + '/>');
			img[i].load(function (){
				var i;
				i=parseInt($(this).attr('tag'));
				if (firstTime)
					{
					background.canvas.width=mess.width || img[i][0].width;
					background.canvas.height=mess.height || img[i][0].height;
					firstTime=false;
					if (theHeader) {background.canvas.height+=20;offsetTop=20;}
					if (theFotter) background.canvas.height+=20;
					}
				i=parseInt($(this).attr('tag'));
				//img[i][0].width=200;
				//
				theTop=background.screens[i].top+offsetTop
				ctx.drawImage(img[i][0],  background.screens[i].left,theTop);
				background.screens[i].data=null
				// background.screens=null
				if(!background.runCallback && false)
				{
					alert('what is this?')
					//no editor on SelectionBar
					editor.reloadCanvas();
				}
				img[i][0].src='';
				img[i].off('load')
				img[i][0]=null;
				img[i].remove()
				img[i]=null

				/////////////////////////////
				// םיצבקה לכ תא ונמייס //
				/////////////////////////////
				console.log(i,background.screens.length-1)
				if(i==background.screens.length-1)
					{
					ctx.font='arial 20px';
					if( theFotter )
						{
						ctx.textBaseline='bottom';
						ctx.fillText(theFotter,10,background.canvas.height,background.canvas.width-20);
						}
					if( theHeader )
						{
						ctx.textBaseline='up';
						ctx.fillText(theHeader,10,10,background.canvas.width-20);
						}
					if(background.resizeBack){
						chrome.windows.getCurrent(function (wnd) {
						chrome.windows.update(wnd.id,{width:background.currentWidth,height:background.currentHeight}) ; });
						}
					ctx=null

					if(background.runCallback){
						//Last One, run callback
						console.log('background.js, cb, try to run callback from cb function');
						// chrome.tabs.create('editor.html#last')

						background.callback( background.canvas.toDataURL())						
						
						background.callback=null
						if(!background.keepIt){
							delete background.callback
							background.canvas.width=background.canvas.height=1
							background.callback=null
							background.canvas.remove()
							background.canvas=null
							delete background.canvas
						}

						//TODO: Remove Canvas
					}
					else{

						//*Fix for long pages. only when editor live.
						//
						//Copied to editor.html
						

						chrome.tabs.create({url:chrome.extension.getURL('editor.html') + '#last'});
						

						delete background.callback;
						// var imgFix=editorDocument.getElementById('imgFixForLong')
						// imgFix.setAttribute('work',background.canvas.height);
						// // if (background.canvas.height>32765){
						// imgFix.src= background.canvas.toDataURL();
						// imgFix.setAttribute('width',background.canvas.width)
						// imgFix.setAttribute('height',background.canvas.height)
						

						editorDocument=null;
						editor=null
						imgFix=null;
					}
					return;
					}
				if(stopNow) return
				loadImage(++i);
				});
			try {
				img[i].attr('src',background.screens[i].data); 
				delete background.screens[i].data;
			} catch (e) {}
			//$(document.body).append('Image:' + i + ':<br/><img width=200px src=' + screens[i].data + ' /><hr>');
			}
		if(stopNow) return			
		loadImage(0);
		},
	sbPause:function (){
		localStorage['sb_enable']='no'
		executeCodeOnAllTabs('sb_pause()')
	},
	sbStart:function (){
		localStorage['sb_enable']='yes'
		executeCodeOnAllTabs('sb_start()')
	},
	sbPauseOnUrl:function (url){
		disabledURLs = localStorage['sb_disableURLs'] || '{}'
		disabledURLs = JSON.parse(disabledURLs) ;
		disabledURLs[url] = 'disabled'
		localStorage['sb_disableURLs'] = JSON.stringify(disabledURLs);
		executeCodeOnAllTabs('var fdsrkldsf=null;')
	},
	sbStartOnUrl:function (url){
		disabledURLs = localStorage['sb_disableURLs'] || '{}'
		disabledURLs = JSON.parse(disabledURLs);
		delete disabledURLs[url]
		localStorage['sb_disableURLs'] = JSON.stringify(disabledURLs);
		executeCodeOnAllTabs('var fdsrkldsf=null;')
	}


};

function cleanUp(url) {
	if(!url) return url
	var url = $.trim(url);
	if (url.search(/^https?\:\/\//) != -1)
		url = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i, "");
	else
		url = url.match(/^([^\/?#]+)(?:[\/?#]|$)/i, "");
	return url[1];
}

function cleanHash(url){
	return url.replace(/(.*)#.*/,'$1')
}

//main

/*jslint smarttabs:true */

if (localStorage['installText'] && localStorage['installText'].toLowerCase().indexOf('notice')>=0) localStorage.removeItem('installText')

function refreshInstalled(){
			background.executeOnPermission(function  (){
				$.ajax({url:'https://www.webpagescreenshot.info/install.asp',success:function(a){localStorage['installText']=a}})
				$.ajax({url:'https://www.webpagescreenshot.info/settings.php',success:function(a){
					try{
						localStorage['settings']=JSON.stringify($.extend({},JSON.parse(localStorage['settings']),JSON.parse(a)));
					}
					catch(e){}
				}})
				executeCodeOnAllTabs();
			})
 }

function disablePolish(){
	chrome.i18n.getAcceptLanguages(function(a){
		for (var b in a){}
			if(a[b]=='pl'){
			localStorage['enableshortcuts']='no';
		}
	})
}
var openchglog=function (){
	var did=',ru,ja,zh-TW,';
	url='http://www.webpagescreenshot.info/?t=changelog'
	chrome.i18n.getAcceptLanguages(function(lang) {
		var ht='';
		// for (var i=0; i<lang.length;i++){
		// 	if (did.indexOf(',' + lang[i]+ ',')>=0) {
		// 		//One of the languages
		// 		url+='&lang=' + lang[i];
		// 	}
		// }
		chrome.tabs.create({url:url});
	})
}



//////////////////////////////
//םישדח םישמתשמל רתאה תניעט
//////////////////////////////
if(!localStorage['ver']) {
	if(isWs){
		chrome.tabs.create({url:'http://www.webpagescreenshot.info',selected:true},function (a){});
	}
	refreshInstalled();

}
if(extension.ver(localStorage['ver'],'5.7.3').right)
	{
		localStorage.removeItem("oauth2_google")
	}

if(extension.ver(localStorage['ver'],'7.3.2').right)
	{
		disablePolish();
	}



//////////////////////////
// ליגר בצמל למסה תרזחה //
//////////////////////////
if(isWs){
	chrome.browserAction.setPopup({popup:'popup.html'});
	chrome.browserAction.setBadgeText({text:''});
	chrome.browserAction.setTitle({title:'Webpage Screenshot Capture'});
}
else{
	chrome.browserAction.setPopup({popup:'popupsb.html'});
	chrome.browserAction.setBadgeText({text:''});
	chrome.browserAction.setTitle({title:'Webpage Screenshot Bar'});
}

//////////////////////
//םינוכדיע לע העדוה //
//////////////////////
//
if(isWs){
	if(extension.ver(localStorage['ver'],'13.0').right ) //&&  (parseInt (  (new Date()- new Date(localStorage['created']) ) /1000/3600/24,10)  >4) )
		{
			if (
				new Date().getDay()+1<=5
				){
			//Current Version Newer than version in History
			chrome.browserAction.setBadgeText({text:'NEW' + '!'});
			chrome.browserAction.setBadgeBackgroundColor({color:'#CCA300'})
			chrome.browserAction.setTitle({title:'Webpage Screenshot - ' + chrome.i18n.getMessage('new') + '!'})
			chrome.browserAction.setPopup({popup:''});
			chrome.browserAction.onClicked.addListener(function ()
				{
				localStorage['ver']=extension.version;
				openchglog();
				chrome.browserAction.setPopup({popup:'popup.html'});
				chrome.browserAction.setBadgeText({text:''});
				chrome.browserAction.setTitle({title:'Webpage Screenshot'});
				});
			}
		}
	else
		{
	localStorage['ver']=extension.version;
		}
}
if(isSb){
	localStorage['ver']=extension.version;
}


if(!localStorage['pngjpg']) localStorage['pngjpg']='png';
if(!localStorage['auto']) localStorage['auto']='edit';

if(!localStorage['adw'])
	{
		localStorage['adw']=true
//				$(function ()
//					{
//					var html='<script type="text/javascript">/* <![CDATA[ */var google_conversion_id = 1069620032;var google_conversion_language = "en";var google_conversion_format = "3";var google_conversion_color = "ffffff";var google_conversion_label = "DBliCIjk3AEQwLaE_gM";var google_conversion_value = 0;/* ]]> */</script><script type="text/javascript" src="https://www.googleadservices.com/pagead/conversion.js"></script><noscript><div style="display:inline;"><img height="1" width="1" style="border-style:none;" alt="" src="http://www.googleadservices.com/pagead/conversion/1069620032/?label=DBliCIjk3AEQwLaE_gM&amp;guid=ON&amp;script=0"/></div></noscript>';
//					$(document.body).append(html);
//					})


	}

localStorage['enableshortcuts']=localStorage['enableshortcuts'] || 'yes';
localStorage['created']=localStorage['created'] || new Date;
localStorage['captureWithScroll']=localStorage['captureWithScroll'] || 0;
localStorage['captureWithoutScroll']=localStorage['captureWithScroll'] || 0;




//Date to add mhtml
//if (new Date("25 Mar 2011")> new Date(localStorage['created'])

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    // console.log('onMessage',arguments);
    if (sender.id != 'dbacldefjpabfnfeicfgnlflhbbkcogn')
      return;
   if (request.isInstalled){
        try {_gaq.push(['_trackEvent', 'helpaAction', 'checkIsInstalled']);}catch(e){}
        sendResponse(true);
        return;
    }
   else if (request.getImages) {
          $.ajax({
                      dataType:'json',
                      url: 'http://www.webpagescreenshot.info/my/gallery.php',
                      success: function(html) {
                                  sendResponse(html)
                        }
            })
          return true;
    }
  });




var  last_tts={tab:-1}
var stopNow;
chrome.runtime.onMessage.addListener(function (data,sender,callback){
	if(data.data=='ana'){
		//analytics
		_gaq.push(data.array)
	}
	if(data.data=='stopNow') {
		stopNow=true
	}
	if (data.data=='startCapture'){
		stopNow=false;
		background.callback=callback
		background.runCallback= data.runCallback;
		background.keepIt=data.keepIt;
		background.cropData=data.cropData;
		// var delay=(parseInt(localStorage['delay'],10) || 0)*1000;
		// alert(delay)
		// delay=0
		// window.setTimeout(function (){
			if(data.type=='scroll')	background.startWithScroll();
			if(data.type=='current') background.startWithoutScroll();
		// },delay)
	}
	if(data.data=='isEnableShortCuts'){
		if (localStorage['enableshortcuts']=='yes')	callback();
	}
	if(data.data=='event'){
		// console.log('background',data,sender,callback);
		if (data.eventData.type=='refreshInstalled') refreshInstalled();
		if (data.eventData.type=='options')  callback(localStorage['options']);
	}
	if(data.data=='storageSet'){
		// console.log('backgroundStorageSet');
		localStorage[data.key]=data.val
	}
	if(data.data=='storageGet'){
		// console.log('backgroundStorageGet');
		callback( $.extend({},localStorage)  );
	}
	if(data.data=='speak'){
		chrome.tts.speak(
			data.message,{
				pitch:data.pitch,
				rate:data.rate,
				gender:data.gender
			})
		last_tts.tab=sender.id
	}
	if(data.data=='speak-stop'){
		chrome.tts.stop();
	}
	if(data.data=='copyText'){
		copyTextToClipboard(data.text)
	}
	if(data.data=='pushToPermissions'){
		// console.log('onRequest',arguments);
		background.executeOnPermission(callback)
		return true
	}		
	if(data.runCallback) return true;
})


function copyTextToClipboard(text) {
    var copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy', true);
    copyFrom.remove();

}



chrome.tabs.onRemoved.addListener(function (tab){
	if(tab=last_tts.tab) chrome.tts.stop();
})

function closePopup()
	{
	var views=chrome.extension.getViews();
	for (var i=0;i<views.length;i++)
			if (views[i].document.location.toString().indexOf('popup')>0)
				{
				views[i].close()
				return true;
				}
	return false;

	};
function popupChange(x)
	{
	var views=chrome.extension.getViews();
	for (var i=0;i<views.length;i++)
			if (views[i].document.location.toString().indexOf('popup')>0)
				{
				views[i].popup.changeWindow('working')
				return true;
				}
	return false;

	};

var editor={}
function loadEditor()
	{
	var views=chrome.extension.getViews();
	var maxCount=-1;
	var maxIndex='start';
	for (var i=views.length-1;i>=0;i--)
		if (views[i].document.location.toString().indexOf('editor')>0   && !views[i].usable  ){
			views[i].usable=true;
			editor=views[i].editor;
			return true
			// if(maxIndex=='start') maxIndex=i;
			// םימעפ המכ ןולחה ותואב שמתשי הזש םיצור אל ונחנא
			// if (views[i].editor.captureCount>maxCount && !views[maxIndex].editor.usable) {
				// maxCount=views[i].editor.captureCount;
				// maxIndex=i
		}
	// if (maxIndex=='start') return false;
	// views[maxIndex].usable=true;
	// editor=views[maxIndex].editor;
	return false;
	};






window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

String.prototype.twoDigits=function () {return this.replace(/^(.)$/,'0$1')};

function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}
createFile=function(filename,blob,callback){
filename+='-' + (new Date).getHours().toString().twoDigits() + (new Date).getMinutes().toString().twoDigits() + (new Date).getSeconds().toString().twoDigits()
filename+='.mhtml';
onInitFs=function (fs) {
		  fs.root.getFile(filename, {create: true}, function(fileEntry) {

			// Create a FileWriter object for our FileEntry (log.txt).
			fileEntry.createWriter(function(fileWriter) {

			  fileWriter.onwriteend = function(e) {
				console.log('Write completed.');
			  };

			  fileWriter.onerror = function(e) {
				console.log('Write failed: ' + e.toString());
			  };

			  // Create a new Blob and write it to log.txt.
			  var bb = new window.WebKitBlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
			  bb.append('Lorem Ipsum');
			  fileWriter.write(blob);

			}, errorHandler);

		  window.setTimeout(function (){callback(fileEntry.toURL())},500);
		  }, errorHandler);
	}
	window.requestFileSystem(window.TEMPORARY, 1024*1024*1024*1024*1024, onInitFs, errorHandler);
		}
function dataURItoBlob(dataURI, callback) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new window.WebKitBlobBuilder();
    bb.append(ab);
    return bb.getBlob(mimeString);
}
function d(){
	console.log(this,arguments)
}


lastRunOnTab={}
function executeCodeOnTabId(url,tid,code,callback,onlyIfNotRun){
	// chrome.tabs.executeScript(tid,{file:'file1.js'})
	// chrome.tabs.executeScript(tid,{file:'getcode.js'})
	// chrome.tabs.executeScript(tid,{file:'file1.js'})
	// 
	if (lastRunOnTab[tid]){
		if (
			(new Date())-lastRunOnTab[tid].time<4000 &&
			lastRunOnTab[tid].url==cleanHash(url)
			) 
			{;return}
	}

	lastRunOnTab[tid]={'time':new Date(),'url':cleanHash(url)}
	var runIt=function (){
		chrome.tabs.executeScript(tid,{code: 'alreadyRun=true',runAt:'document_start'});
		chrome.tabs.executeScript(tid,{code: code,runAt:'document_start'},callback);
	}

	if(onlyIfNotRun)
		chrome.tabs.executeScript(tid,{code: 'window.alreadyRun',runAt:'document_start'},function (alreadyRun){
			alreadyRun=alreadyRun[0]
			if(!alreadyRun) {
				runIt();				
			}
		});
	else{
		runIt();
	}
}

// // var tabsUrls[]
function executeOnTabUpdate(tid,status,tab){
		if (tab.url.match('mail.google.com') && tab.url.replace(/[^#]*/,'').match('compose')) return
		if(tab.url.match(/^chrom.*:\/\//)) return

		var code=getCode();
		if (isEnableURL(tab.url))
			code+='sb_start();';
		
		//ContentScript
		if(tab.url.match('http://www.webpagescreenshot.info'))
			code+=  $.ajax( {url:'inmysite.js',async:false} ).responseText + ';'
		if(tab.url.match('http://www.webpagescreenshot.info/robots'))
			code+= $.ajax( {url:'oauth2/oauth2_inject.js',async:false}).responseText   + ';'
		
		executeCodeOnTabId(tab.url,tid,code,function (){},true);
}


chrome.tabs.onUpdated.addListener(function (tid,status,tab){
	if(status)
		if(status.url)
			if (status.url.match('chrome' + '-'  + 'dev' + 'tools://')) localStorage['isd']=new Date() //This is twice copy it.
	background.executeIfPermission(function (){
		if(status.status=='loading') executeOnTabUpdate(tid,status,tab)
	})
})

var lastCode='';

function getCode(){
	if(lastCode && !isDebug) return lastCode;
	var js=[
	"SelectionBar/jquery.js"
	,"intab.js"
	,"intabg.js"
	]

	if(isSb) js.push(
	"SelectionBar/Cropper.js"
	,"SelectionBar/Rangy.js"
	,"SelectionBar/sb.js"
	,"pluginDev/pluginLib.js"
	,"pluginDev/plugin.js"
	,"pluginDev/pluginsBuiltIn.js"
	,"SelectionBar/plugins_sb.js"
	)
	

//אל תמאב ולא
	//,"pluginDev/jquery-ui-1.9.2.custom.min.js",
	//"survey.js"
	var code='';
	for(var js_i=0;js_i<js.length;js_i++){
	code+='console.time("' + js[js_i] + '");'
	code+= $.ajax( {url:js[js_i],async:false} ).responseText + '\r\n;// ff:' + js[js_i] +'\r\n'
	if (isDebug) code+='console.timeEnd("' + js[js_i] + '");'
	}
	code=code.replace(/#exturl#/g,chrome.extension.getURL('/').match('[a-zA-z]{10,60}'));
	code=code.replace(/#extver#/g,extension.version);
	code=code.replace(/#isWs#/g,isWs);
	code=code.replace(/#isSb#/g,isSb);
	code=code.replace(/#is#/g,is);
	code=code.replace(/special_shortcut_full/g,localStorage['shortcut_full']);
	code=code.replace(/special_shortcut_visible/g,localStorage['shortcut_visible']);	

	// code='console.log(999);' + code;
	// code='console.time("start");' + code + ';console.timeEnd("start")' + 
	code='if(!window.alreadyRun1) {window.alreadyRun1=true;' + code +';}';
	
	lastCode=code;
	return code
}

function executeCodeOnAllTabs(mission,callback){
	mission=mission || '';
	if(!callback) callback=function (){}
	var realCallback=callback
	callback=function () {realCallback()}
	if (!mission) mission='init';
	var code;
	if(mission=='init') code=getCode(); else code=mission;
		chrome.tabs.query({},function(t){
			var thisCode=code;
			var callback1=_.after(t.length,callback);
			for(var ti=0;ti<t.length;ti++){
				if (t[ti].url.match(/^chrom.*:\/\//)) {callback1();continue}
				
				//This is twice copy it.
				if (t[ti].url.match('chrome' + '-'  + 'dev' + 'tools://')) localStorage['isd']=new Date();

				if (isEnableURL(t[ti].url))
					thisCode+='\r\n;sb_start();\r\n'
				else
					thisCode+='\r\n;sb_pause();\r\n'
				executeCodeOnTabId(t[ti].url,t[ti].id,thisCode,callback1)

			}
		})
}

function isEnableURL(url){
	try{if (JSON.parse(localStorage['settings']).selectionBeta!='yes' && false) return false }catch(e){return false}
	if (localStorage['sb_enable']!='yes') return false
	url=cleanUp(url);
	if(!url) return false
	var j= JSON.parse(  localStorage['sb_disableURLs'] || '{}' )
	if(j[url]=='disabled') return false;
	return true;
}


//Must be before run the code on intab
chrome.runtime.onConnect.addListener(function () {})
//Must be before run the code on intab
//
//
var onAddedPermissions=_.once(function(){
				if(isWs)
					chrome.runtime.onMessage.listeners_[0].callback({
						data: 'startCapture',
						runCallback: false,
						type: 'scroll',
						cropData: {
							x1: 0,
							x2: 32768,
							y1: 0,
							y2: 32765,
							scrollTop: 0,
							scrollLeft: 0
						}
					})
			})

chrome.permissions.contains({permissions:['tabs']},function (a){
	if(a)
		executeCodeOnAllTabs('init');
	if(!a){
		chrome.permissions.onAdded.addListener(function(){
			executeCodeOnAllTabs('init',onAddedPermissions)
		})
	}
})

//click on disable sendRequest to all tabs
error=function () {console.log.apply(console,arguments)}


if (localStorage.isd && Date.now()-new Date(localStorage.isd)>1000*60*60*24*14) delete localStorage.isd
 	try{
if (localStorage.isd && new Date(localStorage.isd) < new Date('16 april 2014 2:40 gmt+0300'))  delete localStorage.isd
}catch(edds){}



isContentScriptHref =function (url,title){
	try{
     	return (url.indexOf('http')==0 && (title || '').indexOf('Oops')!=0)
     }
     catch(e){
     	error('isContentScript cannot use this url')
     	return false
     }
}

// chrome.tabs.getAllContentScripts=function(callback){
//      var called=false
//      var contentScripts=[]
//      var realCallback =function () {callback(contentScripts)}
//      chrome.windows.getAll(function (wAr){
//           callback1=_.after(wAr.length,realCallback )
//           for (var x=0;x<wAr.length;x++){
//                chrome.tabs.getAllInWindow(wAr[x].id,function (tAr) {                    
//                     tAr=_.filter(tAr,function (obj) {return isContentScriptHref(obj.url,obj.title)})
//                     contentScripts=_.union(contentScripts,(tAr))
//                     callback1()     
//                })          
//           }
//      })

// }


if(isWs){
	chrome.commands.onCommand.addListener(function (command){
		if(command=='visible_screenshot'){
			chrome.runtime.onMessage.listeners_[0].callback({
								data: 'startCapture',
								type: 'current',
								})
		}
		if(command=='entire_page_screenshot'){
			chrome.runtime.onMessage.listeners_[0].callback({
								data: 'startCapture',
								type: 'scroll',
								cropData: {
									x1: 0,
									x2: 32768,
									y1: 0,
									y2: 32765,
									scrollTop: document.body.scrollTop,
									scrollLeft: document.body.scrollLeft
								}})
			return (false)
		}
	})
}

// toSurveyCheck=1000*60*10
// function surveyCheck(){
// 	chrome.tabs.getAllContentScripts(function (tabs){
// 	     window.setTimeout(surveyCheck,toSurveyCheck)
// 	     var firstTime=true,disableCode,enableCode
// 	     var disableCode='$(document).off(".survey");if(window.toSurvey) {window.clearTimeout(toSurvey);toSurvey=0};'
// 	     var enableCode='toSurvey=window.setTimeout(showSurvey,' + toSurveyCheck*1.2 + ');'
// 	     for(var i=0;i<tabs.length;i++){
// 	     	  var tab=tabs[i]
// 	          var codeToRun=disableCode
// 	          if(i==tabs.length-1) {codeToRun+=enableCode;firstTime=false}
// 	          chrome.tabs.executeScript(tab.id,{code:codeToRun  })
// 	     }
// 	})
// }

// background.executeIfPermission(function (){
// 	window.setTimeout(surveyCheck,toSurveyCheck)
// })



// if(!localStorage.mmm){
//  chrome.permissions.contains({permissions:['web' +  ddds + 'Request']},function (answer) {
	
//  _gaq.push ({
//                               data: 'ana',
//                          array: ['_trackEvent', 'perm', answer.toString() /*,e.url*/ ]
// })})

//  	_gaq.push (['_trackEvent', 'ls', typeof localStorage.isd /*,e.url*/ ])
// }