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

			generator = new ShapeGenerator(container, container.width(), container.height());

		//key bindings
		Keyboard.bindKey("a", function(){
			generator.phalanx.pauseAnimation();
		});

		Keyboard.bindKey("c", function(){
			generator.useAnimCam = !generator.useAnimCam ;
			generator.captureFrames = true;
		});

		// Keyboard.bindKey("p", function(){
		// 	generator.captureFrames = true;
		// 	generator.counter = 0;
		// });

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
			console.log(data);
			generator.phalanx.setData(data);
		});

		Keyboard.bindKey("m", function(){
			generator.showRuler();
		});

		Keyboard.bindKey("i", function(){
			generator.saveImg();
		});

		Keyboard.bindKey("h", function(){
			gui.hide();
		});
		Keyboard.bindKey("0", function(){
			generator.extrudeGeo();
		});
		Keyboard.bindKey("8", function(){
			generator.extrudeTubeGeo();
		});
		Keyboard.bindKey("9", function(){
			generator.unExtrudeGeo();
		});
		Keyboard.bindKey("p", function(){
			generator.saveGeo();
		});


		//for gif output
		Keyboard.bindKey("7", function(){
			
			if(typeof data=='undefined')
				data = {"linearSpline":0,"baseTwist":0,"bpSides":0,"bpSize":0,"bpTwist":0,"cbTwist":0,"tpPetals":0,"sinTri":0,"tpMult":0,"tpLoop":0,"tpTwist":0,"tpTwist2":0,"tpCornerMult":0,"xtraControls":0,"xtraWaveMult":0,"xtraZWaveFreq":0,"xtraXWaveFreq":0,"xtraBulgeAmount":0,"xtraBulgeFreq":0,"xtraSinTri":0,"bulgeAmount":0,"bulgeFreq":0,"bulgeOff":0,"bulgeSinTri":0,"lean":0}
			
			generator.makeGif(data, function(gifUrl){
				var img = $("<img>").attr("src", gifUrl).appendTo($("#images"));
			});
		});
		
		
	}
);
