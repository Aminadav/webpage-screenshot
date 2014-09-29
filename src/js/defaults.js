if (!localStorage['rnd']) localStorage['rnd']=Math.random()
if (!localStorage['options']) localStorage['options']=hex_md5( (new Date).toString()) + hex_md5( Math.random().toString());


if(!localStorage['show_toolbar']) localStorage['show_toolbar']='yes'
if(!localStorage['show_selectionbar']) localStorage['show_selectionbar']='yes'

chrome.i18n.getAcceptLanguages(function () {
	try{
		localStorage['primaryLanguage']=arguments[0][0]
	}
	catch(e){
		localStorage['primaryLanguage']=''
	}
})

if(!localStorage['button_size']) localStorage['button_size']=20
if(!localStorage['sb_opacity']) localStorage['sb_opacity']=0.7