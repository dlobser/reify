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
		"ModelGenerator" : "../app"
	},
	shim : {
		"THREE" : {
			exports : "THREE"
		},
		"TREE" : {
			exports : "TREE"
		},
		"TWEEN" : {
			exports : "TWEEN"
		}
	}
});

require(["domReady!", "jquery", "ModelGenerator/Shape"], function(ready, $, ShapeGenerator){

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
