define(["THREE", "ModelGenerator/Generator"], function(THREE, makeShape){

	"use strict";

	/**
	 *  setup the three.js environment
	 */
	var ShapeGenerator = function(container, width, height){
		this.camera = new THREE.PerspectiveCamera( 70, width / height, 1, 20000 );
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({alpha : true});
		this.renderer.setClearColor( 0x0000000 , 0);
		this.renderer.setSize(width, height);

		container.append(this.renderer.domElement);

		this.camera.position.setZ(-60);
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
			this.scene.remove(this.object);
		}
		var val = [
			0,
			Math.random(),
			Math.random(),
			Math.random(),
			Math.random(),
		]
		var geom = new THREE.Geometry();
		var pGeom = makeShape({values:val,geo:geom,extrude:true,res:3000,tubeRadius:.27});
        var pMat = new THREE.MeshLambertMaterial(  );
        this.object = new THREE.Mesh(pGeom,pMat);


		// this.object = makeShape(parameters.pedal, parameters.noise, parameters);
		// this.object.rotateX(Math.PI / 4);

		this.scene.add(this.object);
	};

	ShapeGenerator.prototype.animate = function(){
		requestAnimationFrame(this.animate.bind(this));
		if (this.renderer){
			this.renderer.render( this.scene, this.camera );
		}
		if (this.object){
			this.object.rotateZ(0.01);
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