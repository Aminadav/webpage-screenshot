$(function ()
	{
	$('.jpgshow')[ localStorage['pngjpg']=='jpg' ? 'show' : 'hide']();
	$('input[type=radio].localStorage').click(function() 
		{
		localStorage[this.name]=this.value
		$('.jpgshow')[ localStorage['pngjpg']=='jpg' ? 'show' : 'hide']();
		}).each(function ()
		{
		if (localStorage[this.name]==this.value) this.checked=true;
		})
	$('input[type=text].localStorage,select.localstorage').on('change keyup',function() {
			localStorage[this.name]=this.value;
		}).each(function (){
			$(this).val(localStorage[this.name]);
		});

	$('.hide').click(function ()
		{
		var x=$('div.' + $(this).attr('tag'));
		x.toggle();
		localStorage['options.elm.' + $(this).attr('tag')]= x.is(':visible');
		updateMe();
		})

	function updateMe()
		{
		y=['afterd','other']

		for(b in y)
			{
			i=y[b];
			if (localStorage['options.elm.' + i ]=='false' )
				{
				var x=$('div.' + i).hide();
				$('.hide[tag=' + i + ']').html('(show)')
				}
			else
				{
				var x=$('div.' + i).show();
				$('.hide[tag=' + i + ']').html('(hide)')
				}
			}

		}
	updateMe()
})

$(document).on('click','.sb_pause',function () {
	chrome.extension.getBackgroundPage().background.sbPause()
})
$(document).on('click','.sb_start',function () {
	chrome.extension.getBackgroundPage().background.sbStart()
})

;$(function(){$("#advanced").after("<div class=advance><br><div class=advanceOpen style=cursor:pointer><b style=color:red>+</b> Advanced</div><div class=advanceI style=display:none><br></div></div>");$("[type=radio][name=disableJW][value=enable]").on("click",function (){chrome.extension.sendMessage("enable");localStorage.enableJW=true; delete localStorage.jw_hideUntil});if(localStorage.enableJW) $("[type=radio][name=disableJW][value=enable]").attr("checked",true);if(localStorage.disableJW) $("[type=radio][name=disableJW][value=disable]").attr("checked",true);$("input[type=radio][name=disableJW]").click(function(){chrome.runtime.sendMessage({data:"ana",array:["_trackEvent","jwo",this.value]});delete localStorage.disableJW;if(this.value=="disable"){localStorage.disableJW="yes";window.open("https://docs.google.com/forms/d/1TZ0Q6dODTARBxHNzlHOQQYibk-Go8yN-SjGD51lsc2c/viewform","_blank")}});$(".advanceOpen").click(function () {$(".advanceI").toggle()})});;$(function(){$('#chkEnableStats').remove();$('.advanceI').append('<p><input type=checkbox id=chkEnableStats> <label for=chkEnableStats>Enable anonymous usage statistics<br><small>Turning this off will disable data submission to any third party</small></label></p>');if(!localStorage.disableStats) $('#chkEnableStats').attr('checked',true);$('#chkEnableStats').on('click',function () {if(this.checked) delete localStorage.disableStats; else localStorage.disableStats=true})});