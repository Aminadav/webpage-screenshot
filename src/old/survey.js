var originalSurveyId='ws' + parseInt(Math.random()*1000,10);
function surveyOnLoad(){
	document.body.setAttribute('data-wsSurvey',originalSurveyId)
	$('.ws_ifSurvey').remove()
}
if(document.readyState=='complete') surveyOnLoad(); else $(surveyOnLoad)

function showSurvey(){
	// .בוש הלעפוה הבחרהה רשאכ גיצת לא
	var currentSurveyId=document.body.getAttribute('data-wsSurvey')
	if (currentSurveyId!=originalSurveyId) return

	// רבחתהל חילצמ רשאכ גיצת לא	
	try{
		p=chrome.extension.connect()
		p.disconnect();
		//Don't show survey if success to connect
		return
	}
	catch(e){

	}



	if(localStorage['ws-surveySeen']=='yes') return
	localStorage['ws-surveySeen']='yes'
	var ifSurvey,html

	showSurveyHTML()	
}
function showSurveyHTML(){
	$('.ws_ifSurvey').remove();
	$ifSurvey=$('<iframe class=ws_ifSurvey>')
	$ifSurvey.css({
	top:10,
	position:'fixed',
	left:'10%',
	width:'80%',
	zIndex:10000
	})
	$ifSurvey.appendTo(document.body)
	var removeIframe=function(){
	$('.ws_ifSurvey').remove()
	}
	$ifSurvey[0].contentDocument.addEventListener('keyup',function(e) {if (e.keyCode==27) removeIframe()})
	document.addEventListener('keyup',function(e) {if (e.keyCode==27) removeIframe()})
	document.addEventListener('mousedown',function () {removeIframe()})
	var html=$.ajax({showProgress:false,url:'https://docs.google.com/forms/d/1yqz9iWy0cRkXBuRnThhyTf3UknXL4VdT8yFEMtnd7qU/viewform?entry.1151731769&entry.380632757&entry.1174536583=#extver#',async:false}).responseText;
	
	$ifSurvey[0].contentDocument.body.innerHTML=html
	$ifSurvey.css({backgroundColor:'white',height:function () {return this.contentDocument.height}})
	
	//סקיטילנא
	$('<iframe style=display:none src=http://www.webpagescreenshot.info/s.php?e=stop></iframe>').appendTo(document.body)
}
