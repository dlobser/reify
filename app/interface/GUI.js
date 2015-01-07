define(["domReady!", "dat", "jquery", "ModelGenerator/data/ShapeDescription"], function(ready, dat, $, ShapeData){

	var GUI = function(container){
		this.gui = new dat.GUI({
			width: 300,
			autoPlace : false
		});
		container.append(this.gui.domElement);
		this._makeSliders();
	};

	GUI.prototype._makeSliders = function(){
		//make a slider for the shape data
		for (var attr in ShapeData.data){
			//get the range and name
			if (ShapeData.Description.hasOwnProperty(attr)){
				var desc = ShapeData.Description[attr];
				var val = ShapeData.data[attr];
				var min = 0;
				var max = 1;
				var step = 0.01;
				if (desc.range === "negativeOne"){
					min = -1;
				}
				ShapeData.data[attr] = 0.01; 
				var controller = this.gui.add(ShapeData.data, attr, min, max).name(desc.name).listen();
				controller.setValue(val);
				controller.onChange(this._onchange.bind(this));
			}
		}
	};

	GUI.prototype._onchange = function(){
		this.onchange();
	};

	GUI.prototype.onchange = function(){};

	return GUI;
});