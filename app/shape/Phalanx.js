define(["jquery", "THREE", "ModelGenerator/utils/PerlinNoise", "ModelGenerator/utils/Utils", 
    "ModelGenerator/shape/nGon", "ModelGenerator/shape/CastnGon" , "ModelGenerator/data/Phalanx",  "ModelGenerator/data/ShapeDescription"], 
function($, THREE, noise, Utils, nGon, CastnGon, phalanxData, shapeData){

    function Phalanx(params){

        var args = params || {};
        this.args = args;

        this.passData = $.extend({}, phalanxData);

        this.nGons = [];
        this.ctrls = [];
        this.connectors = [];
        this.drawFinishedCallbacks = [];


        this.amount = phalanxData.amount || 1;
        this.layers = phalanxData.layers || 1;

        this.layerHeight = phalanxData.layerHeight || 0.27;

        // this.data = args.data || {var1:0,var2:0,var3:0,var4:0,var5:0,var6:0,var7:0};

        this.coreData = shapeData.cores;

        // this.counter = args.counter || 0;
        this.passData.counter = 0;

        // this.args.layers = this.layers;

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

        // this.CTRL.add(this.Line);

    }


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
                    for(k in cores[0]){
                        var num = ((shapeData.cores[0][k]+shapeData.cores[1][k]));
                        passData.data[k] = num;
                    }
                }
                else{
                    passData.data = shapeData.cores[0];
                }

                passData.counter = j;

                passData.lerpCtrlAmount = Math.floor(1+(info.var1*10));
                passData.layers = phalanxData.layers;

                var NG = new CastnGon(passData);

                // this.ctrls[i].add(NG.CTRL);
                // if(typeof this.nGons[i+j*this.amount] !== 'undefined')
                if(!Utils.isUndef(this.nGons[i+j*this.amount])){
                    if(!Utils.isUndef(this.nGons[i+j*this.amount].Curve)){
                        this.nGons[i+j*this.amount].dispose();
                    }
                }

                this.nGons[i+j*this.amount] = NG;

                NG.CTRL.rotation.z += shapeData.base.twist * j * 0.01;
                // NG.CTRL2.rotation.z += Utils.remap(this.data[0]["twist"+i]) * j * 0.01;
                NG.CTRL2.position.y = (j*j*info.var6*.001)+(shapeData.base.offset)*50;
                NG.CTRL.position.z = j*this.layerHeight;

                NG.init(passData);
                this.Curve.add(NG.Curve);
                theseCurves.push(NG.Curve);
                
            }


            // if(!Utils.isUndef(this.connectors[j])){
            //     Utils.purgeObject(this.connectors[j]);
            //     // this.connectors[j]=null;
            // }

            // var geo = new THREE.Geometry();

            // for(var k = 0 ; k < theseCurves[0].geometry.vertices.length ; k+=10){
            //     for(var i = 0 ; i < theseCurves.length ; i++){
            //         geo.vertices.push(theseCurves[i].geometry.vertices[k]);
            //         k+=10;
            //     }
            // }
            // geo.vertices.unshift(geo.vertices[geo.vertices.length-1].clone());

            // var connectorCurve = new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xaabbcc}));
            // this.connectors.splice(j,1,connectorCurve);

            // this.Curve.add(connectorCurve);

            j++;
        }

        this._currentLayer += this._layerStep;

        if(this._currentLayer+this._layerStep > phalanxData.layers){
            this._currentLayer = 0;
            this.args.counter = 0;
            this.drawFinished = true;
            this.callDrawFinished();
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