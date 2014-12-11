define(["jquery"], function($){

	function bindKey(key, callback){
		var keyCode = key.toUpperCase().charCodeAt(0);
		$(document).keydown(function(e){
			if (e.keyCode === keyCode){
				e.preventDefault();
				callback();
			}
		});
	}
	return {
		bindKey : bindKey
	};
});