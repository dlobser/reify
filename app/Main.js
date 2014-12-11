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
		"dat" : "../deps/dat.gui.min"
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

require(["domReady!", "jquery", "ModelGenerator/shape/Shape"], function(ready, $, ShapeGenerator){

	console.log("Reify Shape Generator v0");

	var container = $("#Container");

	var generator = new ShapeGenerator(container, container.width(), container.height());

	generator.makeShape({
		squiggle: Math.random(),
		rope: Math.random(),
		tower: Math.random(),
		KB: Math.random(),
		zig: Math.random(),
		squares: Math.random(),
		sprinkles: Math.random(),
		petals: Math.random(),
	});

});
