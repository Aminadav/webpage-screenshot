var _gaq=_gaq||[]
_gaq.push(['b._setAccount', 'UA-2368233-11']);
_gaq = window._gaq || [];
_gaq.push(["b._set", "page", "/stop.html"]);
_gaq.push(["b._set", "title", "stopTitle"]);
_gaq.push(['b._trackPageview']);
_gaq.push(['b._trackEvent', 'StopEvent', 'stopEventAction']);
(function () {
    var ssl='https:'==document.location.protocol,
        s=document.getElementsByTagName('script')[0],
        ga=document.createElement('script');
    ga.type='text/javascript';
    ga.async=true;
    ga.src=(ssl?'https://ssl':'http://www')+'.google-analytics.com/ga.js';
    s.parentNode.insertBefore(ga,s);
    var sc=document.createElement('script');
    sc.type='text/javascript';
    sc.async=true;
    sc.src=(ssl?'https://secure':'http://edge')+'.quantserve.com/quant.js';
    s.parentNode.insertBefore(sc,s);
})();