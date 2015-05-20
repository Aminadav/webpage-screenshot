/**
 *  jQuery Windows Engine Plugin
 *  @requires jQuery v1.2.6 or greater
 *  http://hernan.amiune.com/labs
 *
 *  Copyright(c)  Hernan Amiune (hernan.amiune.com)
 *  Licensed under MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 * 
 *  Version: 1.3
 */
 

var jqWindowsEngineZIndex = 100;

jQuery.extend({

    newWindow: function(options) {

        var lastMouseX = 0;
        var lastMouseY = 0;

        var defaults = {
            id: "",
            title: "",
            width: 300,
            height: 300,
            posx: 50,
            posy: 50,
            content: "",
            onDragBegin: null,
            onDragEnd: null,
            onResizeBegin: null,
            onResizeEnd: null,
            onAjaxContentLoaded: null,
            onWindowClose: null,
            statusBar: true,
            minimizeButton: true,
            maximizeButton: true,
            closeButton: true,
            draggable: true,
            resizeable: true,
            type: "normal"
        };

        var options = $.extend(defaults, options);

        var idAttr = "";
        if (options.id != "") idAttr = 'id="' + options.id + '"';
        if (options.id != "") idAttr = 'id="' + options.id + '"';
        $windowContainer = $('<div ' + idAttr + ' class="window-container"></div>');
        $titleBar = $('<div class="window-titleBar"></div>');
        $titleBar.append('<div class="window-titleBar-leftCorner"></div>');
        $titleBarContent = $('<div class="window-titleBar-content">' + options.title + '</div>');
        $titleBar.append($titleBarContent);
        $titleBar.append('<div class="window-titleBar-rightCorner"></div>');
        $windowMinimizeButton = $('<div class="window-minimizeButton"></div>');
        $windowMaximizeButton = $('<div class="window-maximizeButton"></div>');
        $windowCloseButton = $('<div class="window-closeButton"></div>');
        $windowContent = $('<div class="window-content"></div>');
        $windowStatusBar = $('<div class="window-statusBar"></div>');
        $windowResizeIcon = $('<div class="window-resizeIcon"></div>');

        if (options.minimizeButton) $titleBar.append($windowMinimizeButton);
        if (options.maximizeButton) $titleBar.append($windowMaximizeButton);
        if (options.closeButton) $titleBar.append($windowCloseButton);
        if (options.resizeable) $windowStatusBar.append($windowResizeIcon);
        $windowContainer.append($titleBar);
        $windowContent.append(options.content);
        $windowContainer.append($windowContent);
        if (options.statusBar) $windowContainer.append($windowStatusBar);
        
        if(options.type === "iframe"){
            $windowContent.css("overflow","hidden");
        }
        
        var setFocus = function($obj) {
            $obj.css("z-index", jqWindowsEngineZIndex++);
        };

        var resize = function($obj, width, height) {
        	width = parseInt(width);
            if (width<options.width){width=options.width;};
            height = parseInt(height);
            if (height<options.height){height=options.height;};
            $obj.data("lastWidth", width).data("lastHeight", height);
            $obj.css("width", width + "px").css("height", height + "px");
            if (options.type === "iframe") {
                $obj.find("iframe").css("width", (width-3) + "px").css("height", (height-2) + "px");
            }
        };

        var move = function($obj, x, y) {
            x = parseInt(x);
            y = parseInt(y);
            $obj.data("lastX", x).data("lastY", y);
            if(y<0){y=0};
            x = x + "px";
            y = y + "px";
            $obj.css("left", x).css("top", y);
        }

        var dragging = function(e, $obj) {
            if (options.draggable) {
                e = e ? e : window.event;
                var newx = parseInt($obj.css("left")) + (e.clientX - lastMouseX);
                var newy = parseInt($obj.css("top")) + (e.clientY - lastMouseY);
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;

                move($obj, newx, newy);
            }
        };

        var resizing = function(e, $obj) {
            e = e ? e : window.event;
            var w = parseInt($obj.css("width"));
            var h = parseInt($obj.css("height"));
            w = w < 100 ? 100 : w;
            h = h < 50 ? 50 : h;
            var neww = w + (e.clientX - lastMouseX);
            var newh = h + (e.clientY - lastMouseY);
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;

            resize($obj, neww, newh);
        };

        $titleBarContent.bind('mousedown', function(e) {
            $obj = $(e.target).parent().parent();
            setFocus($obj);

            if ($obj.data("state") != "maximized") {
                e = e ? e : window.event;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;

                $(document).bind('mousemove', function(e) {
                    dragging(e, $obj);
                });


                $(document).bind('mouseup', function(e) {
                    if (options.onDragEnd != null) options.onDragEnd();
                    $(document).unbind('mousemove');
                    $(document).unbind('mouseup');
                });

                if (options.onDragBegin != null) options.onDragBegin();
            }
        });

        $titleBarContent.dblclick(function(e) {
            $obj = $(e.target).parent().parent();
            $obj.find(".window-maximizeButton").click();
        });

        $windowResizeIcon.bind('mousedown', function(e) {
            $obj = $(e.target).parent().parent();
            setFocus($obj);

            if ($obj.data("state") === "normal") {
                e = e ? e : window.event;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;

                $(document).bind('mousemove', function(e) {
                    resizing(e, $obj);
                });

                $(document).bind('mouseup', function(e) {
                    if (options.onResizeEnd != null) options.onResizeEnd();
                    $(document).unbind('mousemove');
                    $(document).unbind('mouseup');
                });

                if (options.onResizeBegin != null) options.onResizeBegin();
            }
        });

        $windowMinimizeButton.bind('click', function(e) {
            $obj = $(e.target).parent().parent();
            setFocus($obj);
            if ($obj.data("state") === "minimized") {
                $obj.data("state", "normal");
                $obj.css("height", $obj.data("lastHeight"));
                $obj.find(".window-content").slideToggle("slow");
            }
            else if ($obj.data("state") === "normal") {
                $obj.data("state", "minimized");
                $obj.find(".window-content").slideToggle("slow", function() { $obj.css("height", 0); });
            }
            else {
                $obj.find(".window-maximizeButton").click();
            }
        });

        $windowMaximizeButton.bind('click', function(e) {
            $obj = $(e.target).parent().parent();
            setFocus($obj);
            if ($obj.data("state") === "minimized") {
                $obj.find(".window-minimizeButton").click();
            }
            else if ($obj.data("state") === "normal") {
                $obj.animate({
                    top: "5px",
                    left: "5px",
                    width: $(window).width() - 15,
                    height: $(window).height() - 45
                }, "slow");
                if (options.type === "iframe") {
                    $obj.find("iframe").animate({
                        top: "5px",
                        left: "5px",
                        width: $(window).width() - 15 - 3,
                        height: $(window).height() - 45 - 2
                    }, "slow");
                }
                $obj.data("state", "maximized")
            }
            else if ($obj.data("state") === "maximized") {
                $obj.animate({
                    top: $obj.data("lastY"),
                    left: $obj.data("lastX"),
                    width: $obj.data("lastWidth"),
                    height: $obj.data("lastHeight")
                }, "slow");
                if (options.type === "iframe") {
                    $obj.find("iframe").animate({
                        top: $obj.data("lastY"),
                        left: $obj.data("lastX"),
                        width: parseInt($obj.data("lastWidth") - 3),
                        height: parseInt($obj.data("lastHeight") - 2)
                    }, "slow");
                }
                $obj.data("state", "normal")
            }

        });

        $windowCloseButton.bind('click', function(e) {
            var $window = $(e.target).parent().parent();
            $window.hide(function() { $window.remove(); });
            if (options.onWindowClose != null) options.onWindowClose();
        });

        $windowContent.click(function(e) {
            setFocus($(e.target).parent());
        });
        $windowStatusBar.click(function(e) {
            setFocus($(e.target).parent());
        });

        $windowContainer.data("state", "normal");

        $windowContainer.css("display", "none");

        $('body').append($windowContainer);

        $window = $windowContainer;
        if (!options.draggable) $window.children(".window-titleBar").css("cursor", "default");
        setFocus($window);

        move($windowContainer, options.posx, options.posy);
        resize($windowContainer, options.width, options.height);

        $window.fadeIn();


    },

    updateWindowContent: function(id, newContent) {
        $("#" + id + " .window-content").html(newContent);
    },

    updateWindowContentWithAjax: function(id, url, cache) {
        cache = cache === undefined ? true : false;
        $.ajax({
            url: url,
            cache: cache,
            dataType: "html",
            success: function(data) {
                $("#" + id + " .window-content").html(data);
                if (options.onAjaxContentLoaded != null) options.onAjaxContentLoaded();
            }
        });
    },

    moveWindow: function(id, x, y) {
        $obj = $("#" + id);
        x = parseInt(x);
        y = parseInt(y);
        $obj.data("lastX", x).data("lastY", y);
        x = x + "px";
        y = y + "px";
        $obj.css("left", x).css("top", y);
    },

    resizeWindow: function(id, width, height) {
        $obj = $("#" + id);
        width = parseInt(width);
        height = parseInt(height);
        $obj.data("lastWidth", width).data("lastHeight", height);
        width = width + "px";
        height = height + "px";
        $obj.css("width", width).css("height", height);
    },

    minimizeWindow: function(id) {
        $("#" + id + " .window-minimizeButton").click();
    },

    maximizeWindow: function(id) {
        $("#" + id + " .window-maximizeButton").click();
    },

    showWindow: function(id) {
        $("#" + id + " .window-closeButton").fadeIn();
    },

    hideWindow: function(id) {
        $("#" + id + " .window-closeButton").fadeOut();
    },

    closeWindow: function(id) {
        $("#" + id + " .window-closeButton").click();
    },

    closeAllWindows: function() {
        $(".window-container .window-closeButton").click();
    }

});
