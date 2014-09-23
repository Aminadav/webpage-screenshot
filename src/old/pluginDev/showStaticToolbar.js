var staticPlugin=new Toolbar({
	'plugins':defaultPlugins,
	'element': document.getElementById('toolbarContainer'),
	'namespace':'demo1',
	'position':'static',
	page_title:'mytitle',
	lines:2,
	'type':'image',
	requestImage:function (callback){
		callback( $('#justImage'));
	},
	requestText:function (callback){
		alert('you asked to get the text');
		callback();
	}
	})