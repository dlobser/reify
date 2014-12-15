define(["domReady!", "dat", "jquery"], function(ready, dat, $){

	var gui = new dat.GUI();

	gui.open();

	function addFolder(folder, parent){
		if (!parent){
			parent = gui;
		}
		if (parent.__folders[folder]){
			return parent.__folders[folder];
		} else {		
			return parent.addFolder(folder);
		}
	}

	function addSlider(folder, object, name, description){
		var min = 0;
		var max = 1;
		var step = 0.01;
		if (description.range === "negativeOne"){
			min = -1;
		}
		object[name] = 0.01; 
		var controller = folder.add(object, name, min, max).name(description.name);
		controller.setValue(0);
	}

	return {
		addFolder : addFolder,
		addSlider : addSlider,
	};
});