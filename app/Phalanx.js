define(["THREE", "ModelGenerator/PerlinNoise", "ModelGenerator/Utils", "ModelGenerator/nGon", "ModelGenerator/CastnGon" ], function(THREE, noise, Utils, nGon, CastnGon){

    function Phalanx(params){

        var args = params || {};
        this.args = args;

        this.nGons = [];
        this.amount = args.amount || 1;
        this.layers = args.layers || 1;
        this.layerHeight = args.layerHeight || .27;
        this.data = args.data || {var1:0,var2:0,var3:0,var4:0,var5:0,var6:0,var7:0};

        this.CTRL = new THREE.Object3D();

        this.geo = new THREE.Geometry();
        this.mat = new THREE.LineBasicMaterial();

        this.Curve = new THREE.Line(this.geo,this.mat);

        this.counter = args.counter || 0;
        this.args.counter = 0;
        // this.CTRL.add(this.Line);

    }


    Phalanx.prototype.init = function(){

        this.nGons = [];
        for(var j = 0 ; j < this.layers ; j++){
            for(var i = 0 ; i < this.amount ; i++){
                this.args.counter++;
                var NG = new CastnGon(this.args);
                this.nGons.push(NG);
                // console.log(NG.testVariable);
                // var NG = this.CastnGons[this.nGons.length-1];
                // if(i==0)
                // NG.CTRL.rotation.z = i/this.amount * Math.PI*2 +j*.02+i;
                // else
                // NG.CTRL.rotation.z = i/this.amount * Math.PI*2 +j*.02+-i;

                NG.CTRL.position.z = j*this.layerHeight;
                NG.init(this.args);
                // this.Curve.geometry.vertices = this.Curve.geometry.vertices.concat(NG.geo.vertices);
                this.Curve.add(NG.Curve);
                // NG.dispose(NG,this);

            }
        }
        return this.Curve;
    };

    // Phalanx.prototype.dispose = function(){
        
    //     var that = this;
    //     this.traverse(function(obj){
    //         if(obj instanceof THREE.Line || obj instanceof THREE.Mesh){
    //             obj.geometry.dispose();
    //             obj.material.dispose();
    //         }
    //         // that.remove(obj);
    //         obj = null;
    //     });
    //     if(this.Line.geometry)
    //             this.Line.geometry.dispose();
    //     if(this.Line.material)
    //             this.Line.material.dispose();

    //     this.Line=null;

    //     for(var i in this.nGons){
    //         this.nGons[i].dispose(this.nGons[i],this);
    //         this.nGons[i] = null;
    //     }
    // }


    return Phalanx;
});