      var renderTabs = function(tabs) {
        var _tabs = $("#tabs");
        var renderTab = function(tab) {
          if(tab.url.substr(8) == "chrome://") return;

          var div = $("<li class=moshe><img />&nbsp;<span /></li>")[0];
          div.dataset["tabId"] = tab.id;
          div.dataset["windowId"] = tab.windowId;
          div.dataset["index"] = tab.index;
          $('img', div)[0].src = tab.favIconUrl;
		  $('span',div).html(tab.title || tab.url)

          _tabs.append(div);
        };

        tabs.forEach(renderTab);
      };

      var readHTMLFromMHTML = function(blob, callback) {
        callback = callback || function() {};
      };

$(document).ready(function() {
        chrome.tabs.query({}, renderTabs);
		$(document.body).on('click','.moshe span',function (e)
		{
			$(this.parentElement).trigger('click');
		})
		$(document.body).on("click",".moshe img",function (e)
		{
			$(this.parentElement).trigger('click');
		})
      $(document.body).on('click',".moshe", function(e) {


        var tabId = parseInt(e.target.dataset["tabId"]);
        var windowId = parseInt(e.target.dataset["windowId"]);
        var index = parseInt(e.target.dataset["index"]);

        /*
          The process is slightly convoluted.
          1. Find the tab, get the window and position in window
          2. Detach tab from window
          3. Capture image
          4. Attach back to where it was.
        */
        chrome.tabs.getCurrent(function (currentTab){
			if(!tabId) return
			chrome.tabs.update(parseInt(tabId), {active:true},function() {
				window.setTimeout(function(){
							background=chrome.extension.getBackgroundPage().background;
							console.log('here');
							background.startWithScroll();
//							chrome.tabs.remove(currentTab.id);
				},100)
			});
		});
        return false;
        });
});