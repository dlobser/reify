define(["THREE", "ModelGenerator/utils/File", "OrbitControls", 
	"ModelGenerator/utils/PerlinNoise", "ModelGenerator/shape/Phalanx", "ModelGenerator/shape/nGon", 
	"ModelGenerator/data/Songs", "ModelGenerator/utils/Utils", "ModelGenerator/utils/SaveImg"], 
function(THREE, FileUtils, OrbitControls, noise, Phalanx, nGon, Songs, Utils, SaveImg){

	/**
	 *  setup the three.js environment
	 */
	
	var ShapeGenerator = function(container, width, height){

		// var wave = new Utils.Wave();
		// console.log(wave);

		// var tri = [];
		// var square = [];
		// var saw = [];

		// for(var i = 0 ; i < 1000 ; i++){
		// 	tri.push(wave.TriSin((i/1000)*Math.PI*2));
		// 	saw.push(Utils.comboWave((i/1000)*Math.PI*2,2/3));
		// 	square.push(Utils.comboWave((i/1000)*Math.PI*2,1));
		// }

		// console.log("[["+tri+"],["+square+"],["+saw+"]]"+"");


		this.camera = new THREE.PerspectiveCamera( 60, width / height, 1, 20000 );

		this.animCamera = new THREE.PerspectiveCamera( 60, width / height, 1, 20000 );
		this.animCamera.position.z = 30;
		this.animCamera.position.y = 50;
		this.animCamera.lookAt(new THREE.Vector3 (0.0, 25.0, 0.0));

		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({alpha : true});
		this.renderer.setClearColor( 0x000000, 0);
		this.renderer.setSize(width, height);

		container.append(this.renderer.domElement);

		this.camera.position.z = 140;
		this.camera.position.y = 0;
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement);

		this.ruler = Utils.ruler(16,16);
		this.size = {width:width,height:height};

		//add light
		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		this.light = new THREE.PointLight( 0xffffff );
		this.light.position.copy( this.camera.position );
		this.scene.add( this.light );

		this.phalanx = new Phalanx();
		this.scene.add(this.phalanx.Curve);

		this.phalanx.Curve.rotation.x = -Math.PI/2;
		this.phalanx.Curve.position.y = -35;
		this.ruler.position.y = -35;

		this.counter = 0;
		this.c = 0;

		this.useAnimCam = false;
		this.captureFrames = false;

		this.ctx = this.renderer.domElement;
		this.gif = new GIF({workers:1,quality:2});
		this.gif.on('finished', function(blob) {
			window.open(URL.createObjectURL(blob));
		});


		this.gif.on('progress',function(){
			console.log(++this.counter);
		}.bind(this));

		this.animate();

	};

	/**
	 *  animation loop
	 */
	ShapeGenerator.prototype.animate = function(){

		requestAnimationFrame(this.animate.bind(this));
		this.controls.update(10);
		// this.counter++;

		// if(!this.phalanx.needsUpdate)
		
		if(this.useAnimCam){

			this.renderer.render( this.scene, this.animCamera );
			this.animCamera.position.x = Math.sin(this.counter/5)*160;
			this.animCamera.position.z = Math.cos(this.counter/5)*160;
			this.animCamera.lookAt(new THREE.Vector3 (0.0, 25.0, 0.0));

			if(this.captureFrames){
				this.counter=0;

				// this.renderer.setSize(400, 400);
				this.counter = 0;
			   	// setTimeout(function(){
					for(var i = 0 ; i < 32 ; i++){
						this.gif.addFrame(this.ctx, {delay: 5});
						// this.animCamera.position.x = Math.sin(i/5)*200;
						// this.animCamera.position.z = Math.cos(i/5)*200;
						// this.animCamera.lookAt(new THREE.Vector3 (0.0, 25.0, 0.0));
					}
				// if(this.counter/5>Math.PI*2){
					this.gif.render();
				// }
				// }.bind(this),1000); 

				this.captureFrames = false;

				// 	this.renderer.setSize(this.size.width, this.size.height);


				// if(this.counter/10>Math.PI*2)
				// 	this.captureFrames = false;
			}
		}
		else
			this.renderer.render( this.scene, this.camera );

		if(this.phalanx.needsUpdate){
			this.object = this.phalanx.draw();
		}

	};

	ShapeGenerator.prototype.showRuler = function(){

		if(this.ruler.visible){
			this.scene.remove(this.ruler);
			this.ruler.visible = false;
		}
		else{
			this.scene.add(this.ruler);
			this.ruler.visible = true;
		}

	};

	ShapeGenerator.prototype.needsUpdate = function(){
		this.phalanx.needsUpdate = true;
		this.phalanx._layerFill = 0;
		this.phalanx._fillStep = 0;
		this.phalanx._currentLayer = 0;
	};

	ShapeGenerator.prototype.saveImg = function(name) {
		var n = name || 'pic';
		SaveImg.saveImg(this.renderer,n);
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