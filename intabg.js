if(location.host=='mail.google.com'){
	myInterval=function(){
		try{
			loadjQuery();
			if ($('[contenteditable]').html().indexOf('http://www.webpagescreenshot.info/img/')>=0) {
				$('[contenteditable]').html($('[contenteditable]').html().replace(/http:\/\/www\.webpagescreenshot\.info\/img\/(.*) Captured by http:\/\/bit\.ly\/cF6sYP/,'<a href="http://www.webpagescreenshot.info/img/$1"><img height=100px src="http://www.webpagescreenshot.info/i3/$1"></a><br>Captured by Free Chrome App - <a href="http://bit.ly/cF6sYP">Webpage Screenshot</a>'));
				window.clearInterval(myInt);
			}
		}
	catch(e){}
	}

	if(document.location.href.indexOf('webpagescreenshot')>=0)
		myInt=window.setInterval(myInterval,50);
}

	if(location.host=='www.blogger.com')
		if (location.hash.slice(0,4)=='#ws='){
			loadjQuery();
			$(function(){
				var image= decodeURIComponent (location.hash.slice(4))
				var url=image.replace('i3','img')
				$('body',$('#postingComposeBox')[0].contentDocument).html('<a href=' +  url + '><img src=' + image +  '></a><br>Taken With <a href=http://www.webpagescreenshot.info>Webpage Screenshot</a><br>')
			})
		}