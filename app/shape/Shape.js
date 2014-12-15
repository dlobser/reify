define(["THREE", "ModelGenerator/utils/File", "OrbitControls", "ModelGenerator/interface/GUI", 
	"ModelGenerator/utils/PerlinNoise", "ModelGenerator/shape/Phalanx", "ModelGenerator/shape/nGon", 
	"ModelGenerator/data/Songs", "ModelGenerator/utils/Utils", "ModelGenerator/interface/UI"], 
function(THREE, FileUtils, OrbitControls, Interface, noise, Phalanx, nGon, Songs, Utils, UI){

	// "use strict";
	


	/**
	 *  setup the three.js environment
	 */
	
	varR = true;
	var4 = var3 = varW = varE = varT = false;

	var ShapeGenerator = function(container, width, height){

		var amt = 2;
		/**
		 *  if the shape is regenerated every frame
		 *  @type {Boolean}
		 */
		this.paused = false;

        coreValues = function(n){
        	return {name:n,values:{
                linearSpline:0.0,
	            bpSides:0.0,
	            bpSize:0.5,
	            bpTwist:0.5,
	            cbTwist:0.75,
	            cbTwistX:0.5,
	            cbTwistY:0.5,
	            cbTwistZ:0.5,
	            cbWobbleMult:0.0,
	            cbWobbleFreq:0.0,
	            tpPetals:.3,
	            sinTri:0.0,
	            tpMult:0.5,
	            tpLoop:0.5,
	            tpTwist:0.5,
	            tpTwist2:0.5,
	            tpCornerMult:0.5,
	            songMult:0.0,
        	}};
        }

        var buildObject = {
        	sliders:0.1,
        	folders:[],
        };

        buildObject.folders.push({name:"base",values:{
                twist:0.0,
                offset:0.0,
        	}})

        for(var i = 0 ; i < amt ; i++){
        	buildObject.folders[0].values["twist"+i]=0.5;
        	buildObject.folders.push(new coreValues("core"+i))
        }

        buildObject.folders[1].values.linearSpline=0.1;
        buildObject.folders[1].values.bpSides=0.1;
        buildObject.folders[1].values.bpSize=0.5;
        buildObject.folders[1].values.bpTwist=0.5;
        buildObject.folders[1].values.cbTwist=0.75;
        buildObject.folders[1].values.cbTwistX=0.5;
        buildObject.folders[1].values.cbTwistY=0.5;
        buildObject.folders[1].values.cbTwistZ=0.5;
        buildObject.folders[1].values.cbWobbleMult=0.1;
        buildObject.folders[1].values.cbWobbleFreq=0.1;
        buildObject.folders[1].values.tpPetals=0.3;
        buildObject.folders[1].values.sinTri=0.1;
        buildObject.folders[1].values.tpMult=0.5;
        buildObject.folders[1].values.tpLoop=0.5;
        buildObject.folders[1].values.tpTwist=0.5;
        buildObject.folders[1].values.tpTwist2=0.5;
        buildObject.folders[1].values.tpCornerMult=0.5;
        buildObject.folders[1].values.songMult=0.1;

        Interface.rebuildGui(buildObject);


 		buildObject.folders[1].values.linearSpline=0.0;
        buildObject.folders[1].values.bpSides=0.0;
        buildObject.folders[1].values.bpSize=0.0;
        buildObject.folders[1].values.bpTwist=0.0;
        buildObject.folders[1].values.cbTwist=0.0;
        buildObject.folders[1].values.cbTwistX=0.0;
        buildObject.folders[1].values.cbTwistY=0.0;
        buildObject.folders[1].values.cbTwistZ=0.0;
        buildObject.folders[1].values.cbWobbleMult=0.0;
        buildObject.folders[1].values.cbWobbleFreq=0.0;
        buildObject.folders[1].values.tpPetals=0.0;
        buildObject.folders[1].values.sinTri=0.0;
        buildObject.folders[1].values.tpMult=0.0;
        buildObject.folders[1].values.tpLoop=0.0;
        buildObject.folders[1].values.tpTwist=0.0;
        buildObject.folders[1].values.tpTwist2=0.0;
        buildObject.folders[1].values.tpCornerMult=0.0;
        buildObject.folders[1].values.songMult=0.0;

        buildObject.folders[2].values.linearSpline=0.0;
        buildObject.folders[2].values.bpSides=0.0;
        buildObject.folders[2].values.bpSize=-0.1;
        buildObject.folders[2].values.bpTwist=0.0;
        buildObject.folders[2].values.cbTwist=0.0;
        buildObject.folders[2].values.cbTwistX=0.0;
        buildObject.folders[2].values.cbTwistY=0.0;
        buildObject.folders[2].values.cbTwistZ=0.0;
        buildObject.folders[2].values.cbWobbleMult=0.0;
        buildObject.folders[2].values.cbWobbleFreq=0.0;
        buildObject.folders[2].values.tpPetals=0.0;
        buildObject.folders[2].values.sinTri=0.0;
        buildObject.folders[2].values.tpMult=0.0;
        buildObject.folders[2].values.tpLoop=0.0;
        buildObject.folders[2].values.tpTwist=0.0;
        buildObject.folders[2].values.tpTwist2=0.0;
        buildObject.folders[2].values.tpCornerMult=0.0;
        buildObject.folders[2].values.songMult=0.0;
        // Interface.rebuildGui({values:rData,sliders:7});


        var ctrlArray = [];

        var keys = Object.keys(buildObject.folders[1].values);
        console.log(keys);
	
		for(var j in keys){
			var name = keys[j];
			console.log(keys[j]);
			var vecs = [];
			vecs.name = name;
			// var amt = 4+(Math.round(Math.random()*10)) ;
			// console.log(amt);
			var amts=6;
			for(var i = 0 ; i < amts; i++){
				var vec = new THREE.Vector3();
				vec.x = 1;
				vec.y = (i/(amts-1));
				vec.z = 0;
				vecs.push(vec);
			}
			ctrlArray.push(vecs);
		}

		console.log(ctrlArray);

		this.ui = new UI({res:150,ctrlArray:ctrlArray});
		this.ui.background();
		this.ui.animate();
		this.ui.drawVectors();




		this.camera = new THREE.PerspectiveCamera( 30, width / height, 1, 20000 );
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({alpha : true});
		this.renderer.setClearColor( 0x112233, 1);
		this.renderer.setSize(width, height);


		container.append(this.renderer.domElement);

		this.camera.position.z = 300;
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement);

		//add light
		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		this.light = new THREE.PointLight( 0xffffff );
		this.light.position.copy( this.camera.position );
		this.scene.add( this.light );

		this.objects = [];

		var passInfo = [];

		var i = 0 ;
		for(var k in info){
			passInfo[i] = info[k];
			i++;
		}

		passInfo.ctrlArray = ctrlArray;
		// passInfo[1].arrayData = ui.getVecs();

		// passInfo[0] = info.core0;
		// passInfo[1] = info.core1;

		// console.log(passInfo);

		// var sp = new THREE.Mesh(new THREE.SphereGeometry(1),new THREE.MeshLambertMaterial(  ));
		// this.scene.add(sp);
		// this.makeShape();
		// 
		this.phalanx = new Phalanx({data:passInfo,amount:amt,curveType:"spline",layers:200,polySize:20,detail:500, song:Songs.song});
		this.scene.add(this.phalanx.Curve);
		this.animate();
	};

	/**
	 *  animation loop
	 */
	ShapeGenerator.prototype.animate = function(){

		requestAnimationFrame(this.animate.bind(this));
		this.controls.update(10);
		this.renderer.render( this.scene, this.camera );

		this.ui.background();
		this.ui.drawVectors();
		this.ui.applyScale();

		//pause now
		if(!this.paused){
        	this.object = this.phalanx.draw();
		}
	};

	/**
	 *  export the model as gcode
	 */
	ShapeGenerator.prototype.exportGCode = function(){
		// var layerHeight = this.phalanx.layerHeight;
		this.phalanx.onFinished(function(phalnx){
			var verts = [];
			var children = phalnx.Curve.children;
			for(var i = 0 ; i < children.length ; i++){
				verts = verts.concat(children[i].geometry.vertices);
			}
			FileUtils.saveGCodeMakerbot([verts], 1);
		});
	};

	/**
	 *  pauses the animation. wait until the phalanx is generated before pausing
	 */
	ShapeGenerator.prototype.pauseAnimation = function(pause){
		if (!pause){
			this.paused = false;
		} else {
			var self = this;
			this.phalanx.onFinished(function(){
				self.paused = true;
			});
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