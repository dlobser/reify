define(["THREE", "ModelGenerator/Generator", "ModelGenerator/FileUtils", "OrbitControls", "ModelGenerator/Interface", "ModelGenerator/PerlinNoise", "ModelGenerator/Phalanx", "ModelGenerator/nGon"], function(THREE, Flower, FileUtils, OrbitControls, Interface, noise, Phalanx, nGon){

	// "use strict";

	/**
	 *  setup the three.js environment
	 */
	
	varR = true;
	var4 = false;

	var ShapeGenerator = function(container, width, height){


		this.camera = new THREE.PerspectiveCamera( 30, width / height, 1, 20000 );
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({alpha : true});
		this.renderer.setClearColor( 0x999999, 1);
		this.renderer.setSize(width, height);


		container.append(this.renderer.domElement);

		this.camera.position.z = -300;
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement);

		//add light
		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		this.light = new THREE.PointLight( 0xffffff );
		this.light.position.copy( this.camera.position );
		this.scene.add( this.light );
		this.counter = 0;

		// var sp = new THREE.Mesh(new THREE.SphereGeometry(1),new THREE.MeshLambertMaterial(  ));
		// this.scene.add(sp);
				// this.makeShape();

		this.animate();
		this.count = 0;
	};

	ShapeGenerator.prototype.makeShape = function(parameters) {
		if(typeof this.object !== 'undefined'){
			// this.object.dispose();
			this.object.traverse(function(obj){
				if(obj instanceof THREE.Line || obj instanceof THREE.Mesh){
	                obj.geometry.dispose();
	                obj.material.dispose();
	            }
	            if(obj.parent)
	            obj.parent.remove(obj);
	            obj = null;
			})
		}
        this.object = new Phalanx({data:data,amount:2,layers:12,polySize:30,detail:500});
        // this.object = new nGon({data:data});
        this.object.init();
        
        this.scene.add(this.object);
	};

	ShapeGenerator.prototype.animate = function(){

		if(varR){
			requestAnimationFrame(this.animate.bind(this));
			this.controls.update(10);
			this.makeShape();
			this.renderer.render( this.scene, this.camera );
		}

		if(var4){
	        // this.object.makeToolPath();
	        // this.object.turtle();
			FileUtils.saveGCode([this.object.geo.vertices],1,this.object.layerHeight)
			var4=false;
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

	function setScale(o,s){
		o.scale.x = s;
		o.scale.y = s;
		o.scale.z = s;
	}


	window.onkeyup = onKeyUp;

	function onKeyUp(evt) {

		if(evt.keyCode == 87 ){ varW = !varW;}
		if(evt.keyCode == 69 ){ varE = !varE;}
		if(evt.keyCode == 82 ){ varR = !varR;}
		if(evt.keyCode == 84 ){ varT = !varT;}
		if(evt.keyCode == 89 ){ varY = !varY;}

		if(evt.keyCode == 49 ){ var1 = !var1;}
		if(evt.keyCode == 50 ){ var2 = !var2;}
		if(evt.keyCode == 51 ){ var3 = !var3;}
		if(evt.keyCode == 52 ){ var4 = !var4;}
		if(evt.keyCode == 53 ){ var5 = !var5;}

	}




	return ShapeGenerator;
});