define(["THREE", "ModelGenerator/Generator", "ModelGenerator/FileUtils", "OrbitControls", "ModelGenerator/Interface", "ModelGenerator/PerlinNoise", "ModelGenerator/Phalanx", "ModelGenerator/nGon", "ModelGenerator/Songs", "ModelGenerator/UI"], function(THREE, Flower, FileUtils, OrbitControls, Interface, noise, Phalanx, nGon, Songs, UI){

	// require(["ModelGenerator/UI"]);
	// "use strict";
	// console.log(Interface.UI);
	var c = [];
	var q=-1;
	for(var i = 0 ; i < 6 ; i++){
		c[++q] = 75;
		c[++q] = (i/5)*150;
		c[++q] = 0;


	}
	// var ui = new Interface.UI({res:150,setCtrl:c});
	// ui.init();
	// ui.background();
	// ui.animate();
	// ui.drawVectors();

	/**
	 *  setup the three.js environment
	 */
	
	varR = true;
	var4 = var3 = varW = varE = varT = false;

	var ShapeGenerator = function(container, width, height){

		var amt = 1;

		rData = {

            nothing:0,

            // bpScale:0,

            bpSides:.68,
            bpSize:0,
            // bpLength:0,
            // bpNoisePos:0,
            // bpNoiseAnim:0,
            // bpNoiseOffset:.5,//a.tower*towerMult,
            // bpNoiseScale:0,
            // bpNSFreq:.1,
            bpTwist:0,

            // bpScaleUp:0,
            // bpTopScale:0,
            // bpBulge:0,

            cbTwist:0,
            cbTwistX:0,
            cbTwistY:0,
            cbTwistZ:0,
            
            tpPetals:.3,
            tpMult:0,
            tpLoop:0,
            tpTwist:0,
            tpCornerMult:0,
            songMult:0,
            // tpNoiseMult:0,
            // tpNoiseFreq:0,
            // tpFlipFlop:1,

        };

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
                twist:0.5,
                offset:0.5,
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
        buildObject.folders[1].values.bpSize=0.5;
        buildObject.folders[1].values.bpTwist=0.5;
        buildObject.folders[1].values.cbTwist=0.75;
        buildObject.folders[1].values.cbTwistX=0.5;
        buildObject.folders[1].values.cbTwistY=0.5;
        buildObject.folders[1].values.cbTwistZ=0.5;
        buildObject.folders[1].values.cbWobbleMult=0.0;
        buildObject.folders[1].values.cbWobbleFreq=0.0;
        buildObject.folders[1].values.tpPetals=0.3;
        buildObject.folders[1].values.sinTri=0.0;
        buildObject.folders[1].values.tpMult=0.5;
        buildObject.folders[1].values.tpLoop=0.5;
        buildObject.folders[1].values.tpTwist=0.5;
        buildObject.folders[1].values.tpTwist2=0.5;
        buildObject.folders[1].values.tpCornerMult=0.5;
        buildObject.folders[1].values.songMult=0.0;
        // Interface.rebuildGui({values:rData,sliders:7});


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
		this.counter = 0;

		this.objects = [];

		var passInfo = [];

		var i = 0 ;
		for(var k in info){
			passInfo[i] = info[k];
			i++;
		}
		// passInfo[1].arrayData = ui.getVecs();

		// passInfo[0] = info.core0;
		// passInfo[1] = info.core1;

		// console.log(passInfo);

		// var sp = new THREE.Mesh(new THREE.SphereGeometry(1),new THREE.MeshLambertMaterial(  ));
		// this.scene.add(sp);
		// this.makeShape();
		// 
		this.p = new Phalanx({data:passInfo,amount:amt,curveType:"spline",layers:200,polySize:20,detail:500, song:Songs.song});
		this.animate();
		this.counter = 0;

		
	};

	ShapeGenerator.prototype.makeShape = function(parameters) {


		this.counter++;

        this.object = this.p.init();
        this.scene.add(this.object);
	};

	ShapeGenerator.prototype.animate = function(){

		requestAnimationFrame(this.animate.bind(this));
		this.controls.update(10);
		this.renderer.render( this.scene, this.camera );

		if(varR){
			this.makeShape();
		}

		if(varW){
			if(this.p.drawFinished){
				varR=false;
				varW=false;
			}
		}

		if(varE){
			// console.log(JSON.stringify(this.p.data));
			var st = "info2 = " + JSON.stringify(info) + ";varT=true;";
			console.log(st);
			eval(st);
			varE=false;
		}

		if(varT){
			for (var key in info2) {
                if (info2.hasOwnProperty(key)){
                    for (var hey in info2[key]) {
                        if(typeof info2[key][hey] == "number")
                            info[key][hey] = info2[key][hey];
                    }
                }
            }
            varT = false;
		}

		if(var3){
        	var st = "";
        	for(k in data){st+="data."+k+"="+data[k]+";\n"}
        	console.log(st);
        	var3=false;
        }

		if(var4){

			if(this.p.drawFinished){
				varW=false;
			
				var verts = [];

				for(var i = 0 ; i < this.object.children.length ; i++){
					verts = verts.concat(this.object.children[i].geometry.vertices);
				}



				// this.Curve.geometry.vertices = this.Curve.geometry.vertices.concat(NG.geo.vertices);
		        // this.object.makeToolPath();
		        // this.object.turtle();
				FileUtils.saveGCode([verts],1,this.object.layerHeight)
				var4=false;
			}
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