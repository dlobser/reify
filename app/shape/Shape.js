define(["THREE", "ModelGenerator/utils/File", "OrbitControls", 
	"ModelGenerator/utils/PerlinNoise", "ModelGenerator/shape/Phalanx", "ModelGenerator/shape/nGon", 
	"ModelGenerator/data/Songs", "ModelGenerator/utils/Utils", "ModelGenerator/utils/SaveImg", "jquery"], 
function(THREE, FileUtils, OrbitControls, noise, Phalanx, nGon, Songs, Utils, SaveImg, $){

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

		var stacked = true;

		this.width=width;
		this.height=height;
		// this.needsUpdate = true;

		this.camera = new THREE.PerspectiveCamera( 60, width / height, 1, 20000 );

		this.animCamera = new THREE.PerspectiveCamera( 60,1, 1, 20000 );
		this.animCamera.position.z = 60;
		this.animCamera.position.y = 50;
		this.animCamera.lookAt(new THREE.Vector3 (0.0, 25.0, 0.0));

		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({alpha : true,antialias:true});
		this.renderer.setClearColor( 0x000000, 0);
		this.renderer.setSize(width, height);

		container.append(this.renderer.domElement);

		this.camera.position.z = 340;
		this.camera.position.y = 0;
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement);

		this.ruler = Utils.ruler(16,16);
		this.size = {width:width,height:height};

		//add light
		this.lightGroup = new THREE.Object3D();
		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		var light = new THREE.DirectionalLight( 0x999999 ); light.position = new THREE.Vector3(0,-.2,1); this.lightGroup.add( light );
		var light = new THREE.DirectionalLight( 0xaaaaaa ); light.position = new THREE.Vector3(0,1,.5); this.lightGroup.add( light );
		var light = new THREE.DirectionalLight( 0x666666 ); light.position = new THREE.Vector3(0,1,0); this.lightGroup.add( light );
		var light = new THREE.DirectionalLight( 0xdddddd ); light.position = new THREE.Vector3(1,0,-.5); this.lightGroup.add( light );
		var light = new THREE.DirectionalLight( 0xdddddd ); light.position = new THREE.Vector3(-1,0,-.5); this.lightGroup.add( light );
		this.scene.add(this.lightGroup);

		this.phalanx = new Phalanx({stacked:stacked});
		this.scene.add(this.phalanx.Curve);

		this.phalanx.Curve.rotation.x = -Math.PI/2;

		if(stacked)
			this.phalanx.Curve.position.y = -335;
		else
			this.phalanx.Curve.position.y = -35;

		this.ruler.position.y = -35;

		this.counter = 0;
		this.c = 0;

		this.useAnimCam = false;
		this.captureFrames = false;

		this.tubeShader = tubeShader();

		this.ctx = this.renderer.domElement;
		// this.gif = new GIF({workers:4,quality:10});
		// this.gif.on('finished', function(blob) {
		// 	window.open(URL.createObjectURL(blob));
		// 	this.renderer.setSize(this.width, this.height);

		// });


		// this.gif.on('progress',function(){
			
		// }.bind(this));

		this.animate();

	};

	/**
	 *  animation loop
	 */
	ShapeGenerator.prototype.animate = function(){

		// this.light.position.copy( this.camera.position );
		this.lightGroup.lookAt(this.camera.position);
		this.tubeShader.uniforms['camPos'].value = this.camera.position;
		this.camera.updateMatrixWorld();
		this.tubeShader.uniforms['camMat'].value = this.camera.matrixWorld;

		requestAnimationFrame(this.animate.bind(this));
		this.controls.update(10);
		
		if(this.useAnimCam && this.captureFrames){
			this.makeGif();
			
		}
		else
			this.renderer.render( this.scene, this.camera );

		if(this.phalanx.needsUpdate){
			this.object = this.phalanx.draw();
			// this.needsUpdate = true;
		}

		// else
		// 	this.needsUpdate = false;

	};

	ShapeGenerator.prototype.extrudeGeo = function(){

		var that = this;

		this.object.children.sort(function(a,b){
			// console.log(a.geometry.vertices[0].z);
			return a.geometry.vertices[0].z-b.geometry.vertices[0].z;
		});
		// for(var i = 0 ; i < this.object.children.length ; i++){
		// 	console.log(this.object.children[i].geometry.vertices[0].z);
		// }

		// this.onFinished(function(u,v){

		var nGeo = new THREE.ParametricGeometry(function(u,v){

			// console.log(u,v);
			var vec = that.object.children[Math.floor(((u))*(that.object.children.length-1))].geometry.vertices[Math.floor(v*(that.object.children[0].geometry.vertices.length-1))];
			// console.log(vec);
			// vec.x*=100;
			// vec.y*=100;
			// vec.z = Math.random()*100;
			return(vec);

		},that.object.children.length,that.object.children[0].geometry.vertices.length);

		this.geoTube = new THREE.Mesh(nGeo,this.tubeShader);
		// console.log(geoTube);
		// console.log(this.scene);
		this.geoTube.rotation.x = -Math.PI/2;
		this.geoTube.position.y = -35;
		this.scene.remove(this.object);
		this.scene.add(this.geoTube);
		// this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(1),new THREE.MeshLambertMaterial()));
			
		// });

	};

	ShapeGenerator.prototype.saveGeo = function(){

		saver(this.scene);
		// var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
		// saveAs(blob, name);

	};

	ShapeGenerator.prototype.extrudeTubeGeo = function(){

		var that = this;
		var curves = [];
		var g = new THREE.Object3D();

		this.object.children.sort(function(a,b){
			return a.geometry.vertices[0].z-b.geometry.vertices[0].z;
		});
		
		for(var i = 0 ; i < this.object.children.length ; i++){
			var curve = new THREE.ClosedSplineCurve3(this.object.children[i].geometry.vertices);
			var geo = new THREE.Mesh(new THREE.TubeGeometry(curve,200,.5),new THREE.MeshPhongMaterial({color:0x999999,specular:0x050505,shininess:30}));
			g.add(geo);
		}

		this.geoTube = g;//new THREE.Mesh(nGeo,this.tubeShader);
		// console.log(geoTube);
		// console.log(this.scene);
		this.geoTube.rotation.x = -Math.PI/2;
		this.geoTube.position.y = -35;
		this.scene.remove(this.object);
		this.scene.add(this.geoTube);
		// this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(1),new THREE.MeshLambertMaterial()));
			
		// });

	};

	ShapeGenerator.prototype.unExtrudeGeo = function(){
		this.scene.remove(this.geoTube);
		this.scene.add(this.object);
		this.geoTube.geometry.dispose();
	};

	ShapeGenerator.prototype.makeGif = function(dataObject,func){

		if(dataObject){
			this.useAnimCam = !generator.useAnimCam ;
			this.captureFrames = true;
			this.phalanx.setData(dataObject);
			while(this.phalanx.needsUpdate){
				this.object = this.phalanx.draw();
			}
		}

		if(this.c==0){
			this.gif = new GIF({workers:4,quality:10});
			this.gif.on('finished', function(blob) {
				this.gifURL = URL.createObjectURL(blob);
				if(typeof func !== 'undefined') {
					func(this.gifURL);
				} else {
					window.open(this.gifURL);
				}
				// this.renderer.setSize(this.width, this.height);
			});
			makeShader();
		}

		this.c++;

		materialScreen.uniforms["time"].value = this.c*.023;
		
		this.animCamera.position.x = Math.sin(this.c/5)*160;
		this.animCamera.position.z = Math.cos(this.c/5)*160;
		this.animCamera.lookAt(new THREE.Vector3 (0.0, 15.0, 0.0));
		this.lightGroup.lookAt(this.animCamera.position);
		this.tubeShader.uniforms['camPos'].value = this.animCamera.position;
		this.tubeShader.uniforms['camMat'].value = this.animCamera.matrixWorld;
		this.renderer.setSize(200, 200);
		this.renderer.render( this.scene, this.animCamera, fatTexture, true );
		this.renderer.render(rScene,rCam);


		if(this.c<32){
			console.log(this.c);
			this.gif.addFrame(this.ctx, {copy:true, delay: 10});
		}
		else{
			console.log('done');
			this.c=0;
			this.gif.render();
			this.captureFrames = false;
			this.useAnimCam = false;
			this.renderer.setSize(this.width, this.height);

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

	// ShapeGenerator.prototype.extrudeGeo = function(name) {
	// 	this.object = this.phalanx.extrudeGeo();
	// };

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



noiser = "\
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }\
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }\
float noise(vec3 P) {\
	vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));\
	vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);\
	vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);\
	vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;\
	vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);\
	vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\
	vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\
	gx0 = fract(gx0); gx1 = fract(gx1);\
	vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));\
	vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));\
	gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);\
	gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);\
	vec3 g0 = vec3(gx0.x,gy0.x,gz0.x), g1 = vec3(gx0.y,gy0.y,gz0.y),\
		 g2 = vec3(gx0.z,gy0.z,gz0.z), g3 = vec3(gx0.w,gy0.w,gz0.w),\
		 g4 = vec3(gx1.x,gy1.x,gz1.x), g5 = vec3(gx1.y,gy1.y,gz1.y),\
		 g6 = vec3(gx1.z,gy1.z,gz1.z), g7 = vec3(gx1.w,gy1.w,gz1.w);\
	vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));\
	vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));\
	g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;\
	g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;\
vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),\
				   dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),\
			  vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),\
				   dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);\
	return 2.2 * mix(mix(nz.x,nz.z,f.y), mix(nz.y,nz.w,f.y), f.x);\
}\
float noise(vec2 P) { return noise(vec3(P, 0.0)); }\
float turbulence(vec3 P) {\
	float f = 0., s = 1.;\
for (int i = 0 ; i < 9 ; i++) {\
   f += abs(noise(s * P)) / s;\
   s *= 2.;\
   P = vec3(.866 * P.x + .5 * P.z, P.y, -.5 * P.x + .866 * P.z);\
}\
	return f;\
}\
";


function tubeShader(){

	var vertRT = "\
		varying vec2 vUv;\
		uniform float time;\
		varying vec3 vNormal;\
		varying vec3 wNormal;\
		void main() {\
			wNormal = mat3(modelMatrix[0].xyz,modelMatrix[1].xyz,modelMatrix[2].xyz)*normal;\
			wNormal = normalize(wNormal);\
			vNormal = normal;\
			vUv = uv;\
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
		}\
	";

	var fragRT="\
		varying vec2 vUv;\
		uniform float time;\
		varying vec3 vNormal;\
		varying vec3 wNormal;\
		uniform vec3 directionalLightColor[MAX_DIR_LIGHTS];\
		uniform vec3 directionalLightDirection[MAX_DIR_LIGHTS];\
		uniform vec3 camPos;\
		uniform mat4 camMat;\
		void main() {\
			float ribs = .5+(sin(vUv.x*490.)/2.);\
			float ribs2 = .5+(sin((vUv.x+.002)*490.)/2.);\
			vec3 nNormal = normalize(wNormal-vec3(0.,ribs-ribs2,0.));\
			vec3 spec = vec3(0.);\
			vec4 lgts = vec4(vec3(0.0),1.0);\
			vec4 camNorm = vec4(vec3(wNormal),0.) * camMat;\
			float icm = (camNorm.z*-1.)+1.;\
			icm *= camNorm.y * .5;\
			float trans = pow(ribs,.1)*1.4;\
			for(int i = 0 ; i < MAX_DIR_LIGHTS ; i++){\
				vec3 dir = directionalLightDirection[i];\
				lgts.rgb += pow(clamp(dot(dir,nNormal),0.,1.),2.) * directionalLightColor[i];\
				vec3 halfVec = normalize(directionalLightDirection[i]+normalize(nNormal+camPos));\
				spec += pow(dot(halfVec,nNormal),22.9)*directionalLightColor[i]*.3;\
			}\
			gl_FragColor = vec4(pow(camNorm.z,24.)*.4+max(icm,0.)+lgts.rgb+spec,1.);\
		}\
	";

	var nPlus = noiser+fragRT;


	var tubeShader = new THREE.ShaderMaterial({
		uniforms: THREE.UniformsUtils.merge([
			THREE.UniformsLib['lights'],
			{	
				camMat: {type: 'm4', value:new THREE.Matrix4()},
				camPos: {type: 'v3', value:new THREE.Vector3(0,0,0)},
				color: {type: 'v3', value:new THREE.Vector3(1,1,1)},
			}
		]),
		vertexShader: vertRT,
		fragmentShader: nPlus,
		side: THREE.DoubleSide,
		transparent:true,
		lights: true
	});

	// tubeShader = new THREE.ShaderMaterial( {
	// 	uniforms: {
	// 		uniforms: THREE.UniformsUtils.merge([
	// 				THREE.UniformsLib['lights'],
	// 				{	
	// 					camMat: {type: 'm4', value:new THREE.Matrix4()},
	// 					camPos: {type: 'v3', value:new THREE.Vector3(0,0,0)},
	// 					color: {type: 'v3', value:new THREE.Vector3(1,1,1)},
	// 				}
	// 			]),
	// 		time:{type:"f",value:0} },
	// 		vertexShader: vertRT,
	// 		fragmentShader: nPlus,
	// 		side: THREE.DoubleSide,
	// 		lights: true

	// });

	return tubeShader;

};

function makeShader(){


		fatTexture = new THREE.WebGLRenderTarget( 2048,2048, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat } );

		var vertRT = "\
			varying vec2 vUv;\
			uniform float time;\
			void main() {\
				vUv = uv;\
				gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(position.x,position.y,position.z), 1.0 );\
			}\
		";

		var fragRT="\
			varying vec2 vUv;\
			uniform float time;\
			uniform sampler2D fatTexture;\
			void main() {\
				vec2 nUv = vec2(vUv.x+noise((vUv*100.)),vUv.y*((vUv*120.)));\
				float n = turbulence(vec3(15.*noise(nUv*10.*time)+nUv*220.+nUv.y,time*30.))*.3;\
				float vig = sqrt((vUv.x-.5)*(vUv.x-.5)+(vUv.y-.5)*(vUv.y-.5));\
				vec4 fat = texture2D(fatTexture, vUv);\
				vec4 fat2 = texture2D(fatTexture, vec2(vUv.x+(sin(n*3.1415*2.)*.001),vUv.y+(cos(n*3.1415*2.)*.001)));\
				gl_FragColor = fat2+(n*n)*.3+(vig*vig*1.+.02*noise(vec2(time*30.)));\
			}\
		";

		var nPlus = noiser+fragRT;

		materialScreen = new THREE.ShaderMaterial( {
			uniforms: {
				fatTexture: { type: "t", value: fatTexture },
				time:{type:"f",value:0} },
				vertexShader: vertRT,
				fragmentShader: nPlus,
				depthWrite: false
		});

		var geo = new THREE.PlaneGeometry(100,100,10,10);	
		pln = new THREE.Mesh(geo,materialScreen);
		rScene = new THREE.Scene();
		rScene.add(pln);
		rCam = new THREE.OrthographicCamera( -50, 50, 50, -50, 1, 100 );
		rCam.position.z = 100;


}