define(["jquery", "THREE", "ModelGenerator/utils/PerlinNoise", "ModelGenerator/utils/Utils", 
	"ModelGenerator/shape/nGon", "ModelGenerator/shape/CastnGon" , "ModelGenerator/data/Phalanx",  "ModelGenerator/data/ShapeDescription", "ModelGenerator/utils/File"], 
function($, THREE, noise, Utils, nGon, CastnGon, phalanxData, shapeData, FileUtils){

	function Phalanx(params){

		var args = params || {};
		this.args = args;

		this.passData = $.extend({}, phalanxData);

		this.nGons = [];
		this.ctrls = [];
		this.connectors = [];
		this.drawFinishedCallbacks = [];

		this.pause = false;
		this.needsUpdate = true;

		this.amount = phalanxData.amount || 1;
		this.layers = phalanxData.layers || 1;

		this.layerHeight = phalanxData.layerHeight || 0.27;

		this.shapeData = shapeData;
		this.coreData = shapeData.data;

		this.passData.counter = 0;

		this.song = args.song || [];
		this.songCurve = new Utils.linearCurve(Utils.arrayToVecs(this.song));
		this.passData.songCurve = this.songCurve;

		this.CTRL = new THREE.Object3D();

		this.geo = new THREE.Geometry();
		this.mat = new THREE.LineBasicMaterial();
		this.Curve = new THREE.Line(this.geo,this.mat);

		// this.updateFrequency = 5;
		this._currentLayer = 0;
		this._layerStep = 30;
		this._fillStep = 0;
		this._layerFill = 0;
		this._layerSkip = 10;
		this.drawFinished = false;

	};

	Phalanx.prototype.draw = function(){

		var j = this._currentLayer;

		while(j < phalanxData.layers){

			this.passData.counter++;

			var theseCurves = [];

			for(var i = 0 ; i < 1 ; i++){

				var passData = $.extend({}, this.passData);
				var cores = $.extend({}, shapeData.cores);

				if(i==1){
					passData.data = {};
					for(var k in cores[0]){
						var num = ((shapeData.cores[0][k]+shapeData.cores[1][k]));
						passData.data[k] = num;
					}
				}
				else{
					passData.data = shapeData.data;
				}

				passData.counter = j;


				passData.lerpCtrlAmount = Math.floor((shapeData.data.xtraControls*10));
				passData.layers = phalanxData.layers;
				passData.detail = phalanxData.detail;

				var NG = new CastnGon(passData);

				if(!Utils.isUndef(this.nGons[i+j*this.amount])){
					if(!Utils.isUndef(this.nGons[i+j*this.amount].Curve)){
						this.nGons[i+j*this.amount].dispose();
					}
				}

				this.nGons[i+j*this.amount] = NG;

				NG.CTRL2.position.y = (j*j*(shapeData.data.lean/this.layers)*.1);
				NG.CTRL.position.z = j*this.layerHeight;
				var twister = shapeData.data.baseTwist - Math.abs(shapeData.data.bpTwist/2);
				NG.CTRL.rotation.z = j*twister*0.005;

				NG.init(passData);
				this.Curve.add(NG.Curve);
				theseCurves.push(NG.Curve);
				
			}
			this._layerFill++;
			j+=this._layerStep;
		}


		// this._currentLayer += this._layerStep;

		if(this._layerFill >= phalanxData.layers/this._layerStep){
			if(this._fillStep>=this._layerStep){
				this._currentLayer = 0;
				this._layerFill = 0;
				this._fillStep=0;
				this.args.counter = 0;
				this.drawFinished = true;
				this.callDrawFinished();
				this.needsUpdate = false;
			}
			else
			{
				this._fillStep+=this._layerSkip;
				this._currentLayer=this._fillStep;
			}
		} else {
			this.drawFinished = false;
		}

		return this.Curve;
	};

	Phalanx.prototype.extrudeGeo = function(){

		var that = this;

		this.onFinished(function(u,v){

			var nGeo = new THREE.ParametricGeometry(function(){

				return(that.Curve.children[Math.floor(u)][Math.floor(v)]);

			},phalanxData.layers,phalanxData.detail);

			return new THREE.Mesh(nGeo,new THREE.MeshLambertMaterial());
			
		});

	};


	/**
	 *  get the object. it'll wait until the object is
	 *  done drawing before returning it. 
	 */
	Phalanx.prototype.onFinished = function(callback){
		this.drawFinishedCallbacks.push(callback);
	};

	/**
	 *  invoke all of the callbacks which were expected at the end of the draw
	 */
	Phalanx.prototype.callDrawFinished = function(){
		for(var i = 0; i < this.drawFinishedCallbacks.length; i++){
			this.drawFinishedCallbacks[i](this);
		}
		this.drawFinishedCallbacks = [];
	};

	Phalanx.prototype.dispose = function(){

		this.nGons.forEach(function(o){o.dispose();});
		this.nGons = [];

	};

	Phalanx.prototype.exportGCode = function(t){
		
		// var self = this;

		var type = t || "none";

		this._layerSkip = 1;
		this._layerStep = phalanxData.layers;

		var that = this;

		// for(var i = 0 ; i < that.Curve.children.length ; i++){
		// 	console.log(that.Curve.children[i].geometry.vertices[0].z);
		// }

		// console.log('break');

		// this.onFinished(function(){
		// 	that.Curve.children.sort(function(a,b){
		// 		a.geometry.vertices[0].z-b.geometry.vertices[0].z;
		// 	});

		// 	for(var i = 0 ; i < that.Curve.children.length ; i++){
		// 		console.log(that.Curve.children[i].geometry.vertices[0].z);
		// 	}		
		// });

		this.onFinished(function(){

			var verts = [];
			
			var children = that.Curve.children;

			for(var i = 0 ; i < children.length ; i++){
				verts = verts.concat(children[i].geometry.vertices);
			}

			var vertStack = [];
			var q = 0;
			var up = 0;

			for(var i = 0 ; i < verts.length ; i++){

				// console.log(verts.length);

				if(q==0)
					vertStack.push([]);

				var vert = verts[i].clone();
				vert.z-=up*phalanxData.stack*phalanxData.layerHeight;

				vertStack[vertStack.length-1].push(vert);

				q++;
				if(q>phalanxData.stack*phalanxData.detail){
					console.log(q);
					q=0;
					up++;
				}
			}
			
			console.log(vertStack.length);

			var ID = (.5+(Math.sin(Date.now()*.00001)*.5)).toFixed(4)*10000;

			// Utils.checkLength([verts]);

			for(var i = 0 ; i < vertStack.length ; i++){

				console.log(vertStack[i]);
				if(type == "makerBot"){
					FileUtils.saveGCodeMakerbot([vertStack[i]], "real_"+ID+"_"+i);
				}
				else if(type == "ultiMaker"){
					FileUtils.saveGCodeUltimaker([vertStack[i]], "ulti");
				}
			}

			that._layerSkip = 3;
			that._layerStep = 18;
			that.dispose();
			that._layerFill=0;that._fillStep=0;that._currentLayer=0;that.drawFinished=false;console.log(that)
			while(that._currentLayer<that._layerStep)
				that.draw();
		});
		// this.onFinished(function(){that.dispose();});
		// this.onFinished(function(){that.pause=false;that.needsUpdate=true;that._fillStep=0;that._currentLayer=0;that.drawFinished=false;console.log(that)});

		this._currentLayer = 0;
		this.pause = true;
		this.pauseAnimation();

	};

	Phalanx.prototype.saveData = function(){
		var r = JSON.stringify(shapeData.data);
		console.log(r);
		return r;
	};

	Phalanx.prototype.setData = function(data){
		this.shapeData.set(data);
		this.needsUpdate = true;
	};

	/**
	 *  pauses the animation. wait until the phalanx is generated before pausing
	 */
	Phalanx.prototype.pauseAnimation = function(){

		this.pause = !this.pause;

		var self = this;

		if (this.pause){

			this._currentLayer = 0;

			this.onFinished(function(){
				self.needsUpdate = false;
			});
		}
		else
			this.needsUpdate = true;

	};


	return Phalanx;
});