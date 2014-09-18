      var renderTabs = function(tabs) {
        var _tabs = $("#tabs");
        var renderTab = function(tab) {
          if(tab.url.substr(8) == "chrome://") return;

          var el = $("<li><a><img /><span></span></a></li>")[0];
          var li = el.children[0].children[1];
          li.href = tab.url;
          li.innerText = tab.title || tab.url;
          li.parentElement.dataset["tabId"] = tab.id;
          li.parentElement.dataset["windowId"] = tab.windowId;
          li.parentElement.dataset["index"] = tab.index;
          var img = el.children[0].children[0];
          img.src = tab.favIconUrl;

          _tabs.append(el);
        };

        tabs.forEach(renderTab);
      };

      var readHTMLFromMHTML = function(blob, callback) {
        callback = callback || function() {};
      };

      $(document).ready(function() {
        chrome.tabs.query({}, renderTabs);
      });

		$('img').live('click',function (e)
		{
			$(this.parentElement).trigger('click');
		})
      $("a").live('click', function(e) {
        var intent = window.intent || window.webkitIntent;
        var type;
        
        if(intent.type === "image/jpeg") {
          type = "jpeg";
        }
        else {
          type = "png"
        }

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
        
        chrome.windows.create({tabId: tabId}, function(win) {
          chrome.tabs.captureVisibleTab(win.id, { format: type }, function(data) { 
            chrome.tabs.move([tabId], { windowId: windowId, index: index }, function() {
              intent.postResult(data);
            });
          });
        });
         
        return false;
      });