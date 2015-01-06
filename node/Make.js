var requirejs = require("requirejs");

requirejs.config({
	nodeRequire : require,
	baseUrl : "../app",
	paths : {
		"text" : "../deps/text",
		"THREE" : "../deps/three",
		"TREE" : "../deps/TREE",
		"TERP" : "https://rawgit.com/tambien/TERP/master/TERP",
		"TWEEN" : "../deps/tween.min",
		"ModelGenerator" : "../app",
		"OrbitControls" : "../deps/OrbitControls",
		"NURBS" : "../deps/NURBS",
		"dat" : "../deps/dat.gui",
		"ModelGenerator/interface/ShapeSliders" : "./interface/ShapeSlidersServer"
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

requirejs(["shape/Phalanx"], function(Phalanx){

	console.log("gCode exporter v0");

	
});