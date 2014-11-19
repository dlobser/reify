define(["THREE", "ModelGenerator/Generator"], function(THREE, Flower){

	"use strict";

	/**
	 *  setup the three.js environment
	 */
	var ShapeGenerator = function(container, width, height){
		this.camera = new THREE.PerspectiveCamera( 70, width / height, 1, 20000 );
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({alpha : true});
		this.renderer.setClearColor( 0xffffff , 1);
		this.renderer.setSize(width, height);

		container.append(this.renderer.domElement);

		this.camera.position.setZ(-2);
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));

		//add light
		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		this.light = new THREE.PointLight( 0xffffff );
		this.light.position.copy( this.camera.position );
		this.scene.add( this.light );
		
		this.animate();
	};

	ShapeGenerator.prototype.makeShape = function(parameters) {
		//remove the old shape
		if (this.object){
			this.scene.remove(this.object.prnt);
		}
		// var val = [
		// 	0,
		// 	Math.random(),
		// 	Math.random(),
		// 	Math.random(),
		// 	Math.random(),
		// ]
		// var geom = new THREE.Geometry();
		// var pGeom = makeShape({values:val,geo:geom,extrude:true,res:3000,tubeRadius:.27});
  //       var pMat = new THREE.MeshLambertMaterial(  );
  //       this.object = new THREE.Mesh(pGeom,pMat);

        var rData = {
            squiggle:.5,
            rope:.5,
            tower:.5,
            KB:.5,
            zig:.5,
            squares:.5,
            sprinkles:.5,
            petals:.5,
        }

        // this.layerHeight = mm in height - .27 is default
        // this.layers = number of slices to lay down;
        // this.gridDetail = number of cells in marching squares (30 is default)
        // this.scale = scale of bounding box in mm
        // this.curveDetail =    amounts to resample nurbs curves by - default is 600 - for now make them the same #
        // this.resampleDetail = amounts to resample nurbs curves by - default is 600 - for now make them the same #
        // this.data = data to use 
        // this.counterStep = how many gaps to leave between layers (for faster previes)

        this.object = new Flower({
            data:rData,
            layers:200,
            curveDetail:600,
            resampleDetail:600,
            scale:75,
            gridDetail:30,
            counterStep:10
        });

		

        this.object.init();
        this.object.makeToolPath();
        this.object.turtle();

		// this.object.prnt.scale.x = 1000;
		// this.object.prnt.scale.y = 1000;
		// this.object.prnt.scale.z = 1000;

        this.scene.add(this.object.prnt);


		// this.object = makeShape(parameters.pedal, parameters.noise, parameters);
		// this.object.rotateX(Math.PI / 4);

		// this.scene.add(this.object);
	};

	ShapeGenerator.prototype.animate = function(){
		requestAnimationFrame(this.animate.bind(this));
		if (this.renderer){
			this.renderer.render( this.scene, this.camera );
		}
		if (this.object){
			this.object.prnt.rotateZ(0.01);
		}
	};

	/**
	 *  any teardown that needs to happen to remove
	 *  this object and any objects which it created from memory. 
	 */
	ShapeGenerator.prototype.dispose = function(){
		this.animate = function(){};
		this.scene.remove(this.object);
		this.object.geometry.dispose();
		this.object.material.dispose();
		this.object = null;
		this.renderer = null;
	};

	return ShapeGenerator;
});