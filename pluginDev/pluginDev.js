function btnTest(){
	var newPlugin=createPluginFromText( editor.getValue() ).plugin
	newPlugin.run()
}

function btnTestText(){
	var newPlugin=createPluginFromText( editor.getValue() ).plugin
	newPlugin.run(  $('#txtText').val() )
}

function btnTestImage(){
	var newPlugin=createPluginFromText( editor.getValue() ).plugin
		newPlugin.run(   $('#imgTest')[0] )
}

function getStatusMessage(text){
	var newPlugin=createPluginFromText(text)
	if(newPlugin.error) return newPlugin.error;  else return "Sytax Ok, ready to launch"
}
function btnDisabled(){
	$('#btnTestText,#btnTestImage').attr('disabled',true);
}
function btnEnabled(text){
	var newPlugin=createPluginFromText(text).plugin
	if (newPlugin.isDataType('text'))
		$('#btnTestText').attr('disabled',null);
	if (newPlugin.isDataType('image'))
		$('#btnTestImage').attr('disabled',null);
}
function textAreaChange(e){
	var text=editor.getValue();
	localStorage['pluginDev_changed']=text
	var statusText=getStatusMessage(text);
	$('#debug').text(statusText)
	btnDisabled()
	if(statusText.indexOf('Ok')>0)
		btnEnabled(text)
}
var editor;
$(document).resize(function (){
	editor.setSize(window.innerWidth-300,window.innerHeight-200);
})
$(function (){
	if(localStorage['pluginDev_changed']) $('textarea').text( localStorage['pluginDev_changed'] );
	editor = CodeMirror.fromTextArea($('textarea')[0], {
	    lineNumbers: true,
	    matchBrackets: true,
	   lineWrapping:true,
	    continueComments: "Enter",
	    extraKeys: {"Ctrl-Q": "toggleComment"}
	  })
	// $('textarea').on('input propertychange',textAreaChange)
	editor.on('change',textAreaChange)
	textAreaChange();
	$('#btnTestText').on('click',btnTestText)
	$('#btnTestImage').on('click',btnTestImage)
	$('#btnTest').on('click',btnTest)
	$(document).trigger('resize');
})


	// googleAuth = new OAuth2('google', {
	//   client_id: '545443912834-j7vdfe6gar81lu14oatf33tgtlcbi5gq.apps.googleusercontent.com',
	//   client_secret: '213pVJTRShuSGESsRO92G1qV',
	//   api_scope: 'https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/urlshortener https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
	// },function (){
	// 	googleAuth.authorize(function() {console.log(0)})
	// });

	facebookAuth=new OAuth2('facebook',{
		client_id:'493124077425296',
		client_secret:'f841244a6b4f902fc50b7f15e97a6e2c',
		api_scope:'email'
	},function (){
		console.log(0)
		facebookAuth.authorize(function (){
			$.ajax( { showProgress:false,url:'https://graph.facebook.com/me?access_token=' + facebookAuth.getAccessToken(), headers: {'Authorization': facebookAuth.getAccessToken()} })
		})
	})