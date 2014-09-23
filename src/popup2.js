/*! This file minified to make it smaller as I can.
 *  If interesting you something about this extension, you are welcome to contact me,
 *  at: extensions@bubbles.co.il
 */

localStorage['autosave']=false;

try{
background=chrome.extension.getBackgroundPage().background;
}
catch(e){}

var popup=
	{
	changeWindow : function (name)
		{
		$('.window').hide();
		$('.window[tag=' + name + ']').show();
		},
	window:window,
	cancel:false
	}
function abc(){
function loadMessages()
	{
	$('.msg').each(function () {$(this).html(chrome.i18n.getMessage($(this).attr('tag'))); });
	}

function acceptLanguages() {
	var did=',en,he,pl,de,ja,zh-CN,pt,ml,it,zh-TW,es,nl,cz,hu,ar,sl,sl-SL,ca,ko,ru,no,nb,id,vi,tr,el,sv,da,';
  chrome.i18n.getAcceptLanguages(function(lang) {
	var ht='';
	for (var i=0; i<lang.length;i++)
		{
		if (did.indexOf(',' + lang[i].substring(0,2) + ',')>=0) continue;
		ht+='<a href="javascript:chrome.tabs.create({url:\'http://spreadsheets.google.com/viewform?cfg=true&formkey=dGluSllVMUdBdkVCVUdRemZObDhOcnc6MA&entry_0=' + lang[i] + '\'})" style=display:block;text-decoration:underline;color:blue;cursor:pointer> Translate Into My Language (' + lang[i] + ')</a>';
		}
	$('#transarea').html(ht);
  });
}


$(function()
	{

	$('#installedby').off('click').on('click','a',function (e) {chrome.tabs.create({url:this.href}) } )

	$('.button').hover(function(){
		$(this).toggleClass('hover')
		})
	$('.resizer').click(function (){

		$('.resizers').toggle()
	})

$('.justsave').unbind('click').click(function (e) {$('input#autosave').attr('checked',function (index,value) {return !value}).triggerHandler('change') } )

	if (localStorage['resizeOption']!=0 && localStorage['resizeOption']){
		$('.resizers').show();
	}

	if(localStorage['autosave']=='true')	{$('#autosave')[0].checked=true	}
	$('#autosave').change(function () {localStorage['autosave']=$('#autosave')[0].checked ? 'true' : 'false' })

	disableScroll=function()
		{
		$('#noall').show();
		$('.startWhole').hide();
		$('.editcontent').hide();
		};
	loadMessages();
	if (localStorage['installText'])
	$('#installedby').html(localStorage['installText'])
	else
		{
		if (!localStorage['webmaster'])	{
			$('#installedby').html('Are you a webmaster?<br><span style=color:blue;text-decoration:underline id=webyes>Yes</span> | <span style=color:blue;text-decoration:underline id=webno> No </span>')
			$('#webno').click(function(){

				localStorage['webmaster']='no';
				$('#installedby').hide();
			})
			$('#webyes').click(function(){
				localStorage['webmaster']='yes'
				chrome.tabs.create({url:'http://www.webpagescreenshot.info/?t=Are%20you%20a%20webmaster'})
				})
		}


		}

	chrome.permissions.contains({origins:['http://*/*']},
		function (a) {
			if(a)
			{
		background.tryGetUrl(function (url)
			{
			if (url.indexOf('chrome://')>=0 || url.indexOf('chrome-extension:')>=0 || url.indexOf('https://chrome.google.com')>=0)
				disableScroll();
			if (url.indexOf('file:')==0)
				{
				wNoExternal=window.setTimeout(
						function () {
							$('#nolocal').show();
							$('.startWhole').hide();
						},500);
				chrome.extension.sendRequest(background.externalId,{type:'checkExist'},
						function()
						{
						window.clearTimeout(wNoExternal)
						});
				}
			});

			cb=function (a)
			{
			$('#asd').attr('src',a).attr('width','200').click(function (){
			localStorage['fast']=a;
			chrome.tabs.create({url:chrome.extension.getURL('fast.html'),selected:true});
			})
			};
			chrome.tabs.captureVisibleTab(null,{format:'jpeg'},cb);
			}
		})

	$('.startVisible').click(function ()
		{
		resizeWindow(background.startWithoutScroll());
	})
	$('.startWhole').click(function() {
		resizeWindow(background.startWithScroll);
	})
	$('.editcontent').click(background.editcontent);

	$('#justresize').click(resizeWindow);


	$('.mhtml').click(background.mhtml);
	$('.webcam').click(background.webcamfn);
	$('.cancel').click(function () {popup.cancel=true;window.close() } )
	$('[name=width]').val(localStorage['width']);
	$('[name=height]').val(localStorage['height']);
	$('[name=resize][value=' + localStorage['resizeOption'] + ']').attr('checked',true);
	$('[name=width]').add('[name=height]').click(function () {$('[name=resize][value=3]').attr('checked,true');});

	if(navigator.platform.toLowerCase().indexOf('win')>=0)
		$('.windows').show()
	});
function resizeWindow(callback)
{
//	callback();
//	return;
if (!$.isFunction(callback)) callback=function (){}
chrome.tabs.getSelected(null,function (w) {url=w.url;});
background.resizeBack=false
resValue=$('[name=resize]:checked')[0].value;
if (resValue==0)
	{callback();localStorage['resizeOption']=0;return;}
else if (resValue==1)
	{width=800;height=600;localStorage['resizeOption']=1;}
else if (resValue==2)
	{width=1024;height=768;localStorage['resizeOption']=2;}
else if (resValue==3)
	{width=parseFloat($('[name=width]')[0].value);height=parseF($('[name=height]')[0].value);localStorage['resizeOption']=3;}
localStorage['width']=width;
localStorage['height']=height;

chrome.windows.getCurrent(function (wnd) {
	background.resizeBack=true;
	background.currentWidth=wnd.width;
	background.currentHeight=wnd.height;
	background.currentWindow=wnd.id;
	console.log('h');
	console.log(wnd.id,{width:width,height:height},callback)  ;
	console.log('h2');
	chrome.windows.update(wnd.id,{width:width,height:height},callback) ;
	});
}

function changeWindow(inwindow)
	{
	$('.window').hide();
	$('.window[tag=' + inwindow +']').show();
	}
}
abc();
