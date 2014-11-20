define(["THREE", "ModelGenerator/Generator", "ModelGenerator/FileUtils"], function(THREE, Flower, FileUtils){

	// "use strict";

	/**
	 *  setup the three.js environment
	 */
	
	varW = false;

	var ShapeGenerator = function(container, width, height){
		this.camera = new THREE.PerspectiveCamera( 30, width / height, 1, 20000 );
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({alpha : true});
		this.renderer.setClearColor( 0xffffff , 1);
		this.renderer.setSize(width, height);

		container.append(this.renderer.domElement);

		this.camera.position.setZ(-60);
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));

		//add light
		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		this.light = new THREE.PointLight( 0xffffff );
		this.light.position.copy( this.camera.position );
		this.scene.add( this.light );
		this.counter = 0;
		
		this.animate();
		this.count = 0;
	};

	ShapeGenerator.prototype.makeShape = function(parameters) {
		//remove the old shape
		if (this.object){
			this.scene.remove(this.object.prnt);
		}
		
        this.object = new Flower({
            data : parameters,
            layers:200,
            curveDetail:600,
            resampleDetail:600,
            scale:35,
            gridDetail:30,
            counterStep:100
        });

		

        this.object.init();
        this.object.makeToolPath();
        this.object.turtle();
        this.object.counterStep = 10;
        this.object.makeToolPath();
        this.object.turtle();

        this.scene.add(this.object.prnt);

        var t = this.object.balls.tree;

        this.scene.add(t);
        console.log(this.object);

	};

	ShapeGenerator.prototype.animate = function(){

		requestAnimationFrame(this.animate.bind(this));

		if(varW){
			this.object.counterStep = 0;
			// this.object.gridDetail = 100;
	        this.object.makeToolPath();
	        this.object.turtle();
			FileUtils.saveGCode([this.object.prnt.children[0].geometry.vertices],this.object.scale)
			varW=false;
		}
		if (this.renderer){
			this.renderer.render( this.scene, this.camera );
		}
		if (this.object){
			// this.object.counter++;
			// this.object.animateBalls();
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

}


	return ShapeGenerator;
});