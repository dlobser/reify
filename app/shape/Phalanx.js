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
		this.updateCount = 0;

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

		this.updateFrequency = 5;
		this._currentLayer = 0;
		this._layerStep = 5;
		this.drawFinished = false;

	};

	Phalanx.prototype.draw = function(){

		var j = this._currentLayer;

		while(j < this._currentLayer + this._layerStep){

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

				var NG = new CastnGon(passData);

				if(!Utils.isUndef(this.nGons[i+j*this.amount])){
					if(!Utils.isUndef(this.nGons[i+j*this.amount].Curve)){
						this.nGons[i+j*this.amount].dispose();
					}
				}

				this.nGons[i+j*this.amount] = NG;

				NG.CTRL2.position.y = (j*j*shapeData.data.lean*0.001);
				NG.CTRL.position.z = j*this.layerHeight;
				NG.CTRL.rotation.z = j*shapeData.data.baseTwist*0.005;

				NG.init(passData);
				this.Curve.add(NG.Curve);
				theseCurves.push(NG.Curve);
				
			}

			j++;
		}

		this._currentLayer += this._layerStep;

		if(this._currentLayer+this._layerStep > phalanxData.layers){
			this._currentLayer = 0;
			this.args.counter = 0;
			this.drawFinished = true;
			this.callDrawFinished();
			if(this.updateCount<1){
				this.updateCount++;
			}
			else{
				this.updateCount=0;
				this.needsUpdate = false;
			}
		} else {
			this.drawFinished = false;
		}

		return this.Curve;
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

		this.nGons.forEach(function(o){obj.dispose();});
		this.nGons = null;

	};

	Phalanx.prototype.exportGCode = function(t){
		
		var self = this;

		var type = t || "none";

		this.onFinished(function(){

			var verts = [];
			var children = self.Curve.children;
			for(var i = 0 ; i < children.length ; i++){
				verts = verts.concat(children[i].geometry.vertices);
			}

			Utils.checkLength([verts]);

			if(type == "makerBot"){
				FileUtils.saveGCodeMakerbot([verts], 1);
			}
			else if(type == "ultiMaker"){
				FileUtils.saveGCodeUltimaker([verts], 1);
			}

		});

		this._currentLayer = 0;
		this.pause = true;
		this.pauseAnimation();

	};

	Phalanx.prototype.saveData = function(){

		console.log(JSON.stringify(shapeData));
	};

	Phalanx.prototype.setData = function(data){
		this.shapeData.set(data);
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