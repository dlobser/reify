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


require(["domReady!", "jquery", "ModelGenerator/shape/Shape", 
	"ModelGenerator/interface/Keyboard", "ModelGenerator/interface/GUI"], 
function(ready, $, ShapeGenerator, Keyboard, GUI){

		console.log("Reify Shape Generator v6");

		var container = $("#Container");


		var gui = new GUI(container);

		gui.onchange = function(){
			generator.needsUpdate();
		};

		//key bindings
		Keyboard.bindKey("a", function(){
			generator.phalanx.pauseAnimation();
		});


		var generator = new ShapeGenerator(container, container.width(), container.height());

		//key bindings
		Keyboard.bindKey("a", function(){
			generator.phalanx.pauseAnimation();
		});

		Keyboard.bindKey("4", function(){
			generator.phalanx.exportGCode("makerBot");
		});

		Keyboard.bindKey("5", function(){
			generator.phalanx.exportGCode("ultiMaker");
		});

		Keyboard.bindKey("6", function(){
			generator.phalanx.exportGCode();
		});

		Keyboard.bindKey("s", function(){
			generator.phalanx.saveData();
		});

		Keyboard.bindKey("r", function(){
			generator.phalanx.setData(data);
		});

		Keyboard.bindKey("i", function(){
			generator.saveImg();
		});

		Keyboard.bindKey("h", function(){
			gui.hide();
		});
		
	}
);
