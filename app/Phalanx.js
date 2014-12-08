define(["THREE", "ModelGenerator/PerlinNoise", "ModelGenerator/Utils", "ModelGenerator/nGon", "ModelGenerator/CastnGon" ], function(THREE, noise, Utils, nGon, CastnGon){

    function Phalanx(params){

        var args = params || {};
        this.args = args;

        this.nGons = [];
        this.amount = args.amount || 1;
        this.layers = args.layers || 1;
        this.layerHeight = args.layerHeight || .27;
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

    }


    Phalanx.prototype.init = function(){

        var j = this._currentLayer;

        while(j < this._currentLayer + this._layerStep){
            this.args.counter++;
            for(var i = 0 ; i < this.amount ; i++){

                // if(typeof this.ctrls[i]=='undefined')
                //     this.ctrls[i] = new THREE.Object3D();

                this.args.id = i+1;
                this.args.data = this.data[i+1];

                var NG = new CastnGon(this.args);

                // this.ctrls[i].add(NG.CTRL);

                if(typeof this.nGons[i+j*this.amount] !== 'undefined')
                    if(typeof this.nGons[i+j*this.amount].Curve !== 'undefined')
                        this.nGons[i+j*this.amount].dispose();

                this.nGons[i+j*this.amount] = (NG);

                // console.log(NG.testVariable);
                // var NG = this.CastnGons[this.nGons.length-1];
                if(i==0)
                    NG.CTRL.rotation.z = 0;
                else
                    NG.CTRL.rotation.z = Math.PI;

                NG.CTRL.rotation.z += this.data[0].twist * j *.01;

                NG.CTRL2.position.y = 1+(this.data[0].offset*100);

                NG.CTRL.position.z = j*this.layerHeight;
                NG.init(this.args);
                // this.Curve.geometry.vertices = this.Curve.geometry.vertices.concat(NG.geo.vertices);
                this.Curve.add(NG.Curve);
                // NG.dispose(NG,this);

            }
            j++;
        }

        // console.log(this._currentLayer);
        this._currentLayer += this._layerStep;

        if(this._currentLayer+this._layerStep > this.layers){
            this._currentLayer = 0;
            this.args.counter = 0;
            this.drawFinished = true;
        }
        else
            this.drawFinished = false;


        // processLargeArray(this.nGons,this.Curve);

        return this.Curve;
    };

    // Phalanx.prototype.update = function

    // function processLargeArray(array,parent) {
    //     // set this to whatever number of items you can process at once
    //     var chunk = 5;
    //     var index = 0;

    //     function doChunk() {

    //         var cnt = chunk;

    //         while (cnt-- && index < array.length) {
    //             // process array[index] here
    //             parent.add(array[index].init());
    //             ++index;
    //         }
    //         if (index < array.length) {
    //             // set Timeout for async iteration
    //             setTimeout(doChunk, 1);
    //         }
    //     }

    //     doChunk();    
    // }

   

    Phalanx.prototype.dispose = function(){

        this.nGons.forEach(function(o){obj.dispose();});
        this.nGons = null;

        
        // var that = this;
        // this.traverse(function(obj){
        //     if(obj instanceof THREE.Line || obj instanceof THREE.Mesh){
        //         obj.geometry.dispose();
        //         obj.material.dispose();
        //     }
        //     // that.remove(obj);
        //     obj = null;
        // });
        // if(this.Line.geometry)
        //         this.Line.geometry.dispose();
        // if(this.Line.material)
        //         this.Line.material.dispose();

        // this.Line=null;

        // for(var i in this.nGons){
        //     this.nGons[i].dispose(this.nGons[i],this);
        //     this.nGons[i] = null;
        // }
    }


    return Phalanx;
});