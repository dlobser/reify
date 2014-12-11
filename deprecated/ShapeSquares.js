define(["THREE", "ModelGenerator/Generator", "ModelGenerator/FileUtils", "OrbitControls", "ModelGenerator/Interface", "ModelGenerator/PerlinNoise"], function(THREE, Flower, FileUtils, OrbitControls, Interface, noise){

	// "use strict";

	/**
	 *  setup the three.js environment
	 */
	
	varW = varE = varR = varT = varY = var1 = var2 = var3 = var4 = var5 = false;

	var rData = {};

	var c = document.getElementById("myCanvas");

	var ShapeGenerator = function(container, width, height){

		// var imgData = 

		


		this.camera = new THREE.PerspectiveCamera( 30, width / height, 1, 20000 );
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({alpha : true});
		this.renderer.setClearColor( 0xffffff , 1);
		this.renderer.setSize(width, height);

		rData = {

            nothing:0,

            baseCenterScale:0,

            numBalls:.68,
            bpSize:0,
            bpLength:0,
            bpNoisePos:0,
            bpNoiseAnim:0,
            bpNoiseOffset:.5,//a.tower*towerMult,
            bpNoiseScale:0,
            bpNSFreq:.1,
            baseTwist:0,
            bpScaleUp:0,
            bpTopScale:0,
            bpBulge:0,
            
            tpPetals:.3,
            tpMult:0,
            tpLoop:0,
            tpTwist:0,
            tpNoiseMult:0,
            tpNoiseFreq:0,
            tpFlipFlop:1,

        };

        // rData.imgData = drawSpectrum("myCanvas",[]);

        


        Interface.rebuildGui({values:rData,sliders:7});

        rData.bpTopScale = 1;
        rData.numBalls = .68;

		container.append(this.renderer.domElement);

		this.camera.position.setZ(160);
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement);

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

		// drawSpectrum("myCanvas",{})
		//remove the old shape
		if (this.object){
			this.scene.remove(this.object.prnt);
		}

		// var imgData = drawSpectrum(ctx,[]);
		
        this.object = new Flower({
            data : data,
            layers:200,
            curveDetail:600,
            resampleDetail:600,
            scale:75,
            gridDetail:90,
            counterStep:100,
            makeSpiral:false,
            layerHeight:.1,
            // imgData:imgData,
            canvas:c
        });

		

        this.object.init();
        this.object.makeToolPath();
        // this.object.turtle();
        this.object.counterStep = 10;
        this.object.makeToolPath();
        // this.object.turtle();

        // this.object.cells.showFaces();

        this.scene.add(this.object.prnt);

        var t = this.object.balls.tree;

        this.scene.add(t);
        console.log(this.object);

	};

	ShapeGenerator.prototype.animate = function(){

		requestAnimationFrame(this.animate.bind(this));
		this.controls.update(10);


		if(varW){
			this.object.counterStep = 0;
			// this.object.gridDetail = 100;
	        this.object.makeToolPath();
	        // this.object.turtle();
			FileUtils.saveGCode([this.object.prnt.children[0].geometry.vertices],this.object.scale)
			varW=false;
		}
		if(var4){
			// this.object.counterStep = 0;
			// this.object.gridDetail = 100;
	        this.object.makeToolPath();
	        // this.object.turtle();
			FileUtils.saveGCode([this.object.contours],this.object.scale,this.object.layerHeight)
			var4=false;
		}
		if(varE){
			this.object.counterStep = 0;
			// this.object.gridDetail = 100;
	        this.object.makeToolPath();
	        // this.object.turtle();
			FileUtils.saveGCodeMakerbot([this.object.prnt.children[0].geometry.vertices],this.object.scale)
			varE=false;
		}
		if(varR){
			// this.object.counterStep = 0;
			// this.object.gridDetail = 100;
	        this.object.makeToolPath();
	        console.log(this.object);
	        // this.object.turtle();
	        varR=false;
		}
        if(varT){
        	this.object.drawCanvas(data.var5);

            // console.log(data.var5)
            this.object.animateBalls();
        }
        if(varY){
            // console.log(count);
            this.object.turtle();
        }
        if(var1){
        	this.object.counterStep = 0;
        	console.log(this.object.counterStep)

        	var1=false;
        }
        if(var2){
        	this.object.counterStep = 10;
        	console.log(this.object.counterStep)
        	var2=false;
        }
        if(var3){
        	var st = "";
        	for(k in data){st+="data."+k+"="+data[k]+";\n"}
        	console.log(st);
        	var3=false;
        }

		if (this.renderer){
			this.renderer.render( this.scene, this.camera );
		}
		if (this.object){
			// this.object.counter++;
			// this.object.animateBalls();
			// this.object.prnt.rotateZ(0.01);
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