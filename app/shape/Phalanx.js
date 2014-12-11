define(["THREE", "ModelGenerator/utils/PerlinNoise", "ModelGenerator/utils/Utils", 
    "ModelGenerator/shape/nGon", "ModelGenerator/shape/CastnGon" ], 
function(THREE, noise, Utils, nGon, CastnGon){

    function Phalanx(params){

        var args = params || {};
        this.args = args;

        this.nGons = [];
        this.amount = args.amount || 1;
        this.layers = args.layers || 1;
        this.layerHeight = args.layerHeight || 0.27;
        this.data = args.data || {var1:0,var2:0,var3:0,var4:0,var5:0,var6:0,var7:0};

        this.song = args.song || [];
        this.songCurve = new Utils.linearCurve(Utils.arrayToVecs(this.song));

        this.args.songCurve = this.songCurve;

        this.CTRL = new THREE.Object3D();

        this.ctrls = [];

        this.geo = new THREE.Geometry();
        this.mat = new THREE.LineBasicMaterial();

        this.Curve = new THREE.Line(this.geo,this.mat);

        this.counter = args.counter || 0;
        this.args.counter = 0;

        this.updateFrequency = 5;

        this._currentLayer = 0;
        this._layerStep = 10;
        this.nGons = [];

        this.drawFinished = false;
        // this.CTRL.add(this.Line);
        this.drawFinishedCallbacks = [];
    }


    Phalanx.prototype.draw = function(){

        var j = this._currentLayer;

        while(j < this._currentLayer + this._layerStep){

            this.args.counter++;

            for(var i = 0 ; i < this.amount ; i++){

                // if(typeof this.ctrls[i]=='undefined')
                //     this.ctrls[i] = new THREE.Object3D();

                this.args.id = i+1;
                // this.args.offset = j;
                this.args.layers = this.layers;
                this.args.data = this.data[i+1];

                var NG = new CastnGon(this.args);

                // this.ctrls[i].add(NG.CTRL);
                // if(typeof this.nGons[i+j*this.amount] !== 'undefined')
                if(!Utils.isUndef(this.nGons[i+j*this.amount])){
                    if(!Utils.isUndef(this.nGons[i+j*this.amount].Curve)){
                        this.nGons[i+j*this.amount].dispose();
                    }
                }

                this.nGons[i+j*this.amount] = (NG);

                // console.log(NG.testVariable);
                // var NG = this.CastnGons[this.nGons.length-1];
                NG.CTRL.rotation.z = (i/this.amount)*Math.PI*2;

                NG.CTRL.rotation.z += Utils.remap(this.data[0].twist) * j * 0.01;
                NG.CTRL2.rotation.z += Utils.remap(this.data[0]["twist"+i]) * j * 0.01;

                NG.CTRL2.position.y = Utils.remap((this.data[0].offset))*50;

                NG.CTRL.position.z = j*this.layerHeight;
                NG.init(this.args);
                this.Curve.add(NG.Curve);
            }
            j++;
        }

        this._currentLayer += this._layerStep;

        if(this._currentLayer+this._layerStep > this.layers){
            this._currentLayer = 0;
            this.args.counter = 0;
            this.drawFinished = true;
        } else {
            this.drawFinished = false;
            this.callDrawFinished();
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
    	for (var i = 0; i < this.drawFinishedCallbacks.length; i++){
    		this.drawFinishedCallbacks[i](this);
    	}
    	this.drawFinishedCallbacks = [];
    };

    Phalanx.prototype.dispose = function(){

        this.nGons.forEach(function(o){obj.dispose();});
        this.nGons = null;

    }


    return Phalanx;
});