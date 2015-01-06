define(["THREE", "ModelGenerator/utils/File", "OrbitControls", 
	"ModelGenerator/utils/PerlinNoise", "ModelGenerator/shape/Phalanx", "ModelGenerator/shape/nGon", 
	"ModelGenerator/data/Songs", "ModelGenerator/utils/Utils"], 
function(THREE, FileUtils, OrbitControls, noise, Phalanx, nGon, Songs, Utils){

	/**
	 *  setup the three.js environment
	 */
	
	var ShapeGenerator = function(container, width, height){

		this.camera = new THREE.PerspectiveCamera( 60, width / height, 1, 20000 );
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({alpha : true});
		this.renderer.setClearColor( 0x112233, 1);
		this.renderer.setSize(width, height);

		container.append(this.renderer.domElement);

		this.camera.position.z = 70;
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement);

		//add light
		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		this.light = new THREE.PointLight( 0xffffff );
		this.light.position.copy( this.camera.position );
		this.scene.add( this.light );

		this.phalanx = new Phalanx();
		this.scene.add(this.phalanx.Curve);

		this.phalanx.Curve.rotation.x = -Math.PI/2;
		this.phalanx.Curve.position.y = -25;

		this.animate();

	};

	/**
	 *  animation loop
	 */
	ShapeGenerator.prototype.animate = function(){

		requestAnimationFrame(this.animate.bind(this));
		this.controls.update(10);
		this.renderer.render( this.scene, this.camera );

		if(this.phalanx.needsUpdate){
			this.object = this.phalanx.draw();
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