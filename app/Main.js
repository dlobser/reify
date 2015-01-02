require.config({
	baseUrl : "./app",
	paths : {
		"text" : "../deps/text",
		"domReady" : "../deps/domReady",
		"jquery" : "../deps/jquery-2.1.1.min",
		"THREE" : "../deps/three",
		"TREE" : "../deps/TREE",
		"TERP" : "https://rawgit.com/tambien/TERP/master/TERP",
		"TWEEN" : "../deps/tween.min",
		"ModelGenerator" : "../app",
		"OrbitControls" : "../deps/OrbitControls",
		"NURBS" : "../deps/NURBS",
		"dat" : "../deps/dat.gui"
	},
	shim : {
		"THREE" : {
			exports : "THREE"
		},
		"dat" :{
			exports : "dat"
		},
		"OrbitControls" : {
			exports : "THREE.OrbitControls",
			deps : ["THREE"]
		},
		"NURBS" : {
			exports : "THREE.NURBSCurve",
			deps : ["THREE"]
		},
		"TREE" : {
			deps : ["THREE"],
			exports : "TREE"
		},
		"TWEEN" : {
			exports : "TWEEN"
		}
	}
});

require(["domReady!", "jquery", "ModelGenerator/shape/Shape", "ModelGenerator/interface/Keyboard"], 
function(ready, $, ShapeGenerator, Keyboard){

	console.log("Reify Shape Generator v6");

	var container = $("#Container");

	var generator = new ShapeGenerator(container, container.width(), container.height());

	//key bindings
	Keyboard.bindKey("r", function(){
		if (generator.paused){
			generator.pauseAnimation(false);
		} else {
			generator.pauseAnimation(true);
		}
	});

	Keyboard.bindKey("4", function(){
		generator.exportGCode();
	});

	Keyboard.bindKey("e", function(){
		generator.saveData();
	});
	
});
