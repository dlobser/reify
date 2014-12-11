define(["domReady!", "dat", "jquery"], function(ready, dat, $){

	var gui=new dat.GUI();

	if(typeof args === 'undefined'	) args = {};
	var sliders = 7;

	function initDat(args){
		
		if(!args) var args = {};

		var sliders = args.sliders || 7;
		var values = args.values || {};
		var folders = args.folders || [];

		gui=0;

		data = values;

		info = {};

		for (var i = 1; i <= sliders; i++) {
			data["var"+i]=0.0001
		}

		gui = new dat.GUI();
		GUI = gui;

			Object.keys(data).forEach(function (key) {
				gui.add(data, key, -1.0, 1.0).listen().step(0.001);
			})
			// gui.remember(data);
			for (var i in gui.__controllers) {
				gui.__controllers[i].setValue(0);
			}
			// gui.close();
		
			for(var i = 0 ; i < folders.length ; i++){

				var folder = gui.addFolder(folders[i].name);

				thisData=folders[i].values;

				info[folders[i].name] = thisData;

				Object.keys(thisData).forEach(function (key) {
					folder.add(thisData, key, -1.0, 1.0).listen().step(0.001);
				})
				gui.remember(thisData);
				
			}


		for (var i in gui.__controllers) {
			gui.__controllers[i].setValue(0);
		}

		gui.close();
	}

	function rebuildGui(args) {

		gui.destroy();
		initDat(args);
	}

	initDat(args);

	return {
		addParameter : function(param, value){
			data[param] = value;
			redbuildGui();
		},
		bindKey : function(key, callback){

		},
		rebuildGui: rebuildGui
	}
});