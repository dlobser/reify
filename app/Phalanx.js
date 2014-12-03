define(["THREE", "ModelGenerator/PerlinNoise", "ModelGenerator/Utils", "ModelGenerator/nGon"], function(THREE, noise, Utils, nGon){

    function Phalanx(params){

        THREE.Object3D.call(this);
        args = params || {};
        this.args = args;

        this.nGons = [];
        this.amount = args.amount || 1;
        this.layers = args.layers || 1;
        this.layerHeight = args.layerHeight || .27;
        this.data = args.data || {var1:0,var2:0,var3:0,var4:0,var5:0,var6:0,var7:0};

        this.geo = new THREE.Geometry();
        this.mat = new THREE.LineBasicMaterial();

        this.Line = new THREE.Line(this.geo,this.mat);
        this.add(this.Line);


    }

    Phalanx.prototype = Object.create(THREE.Object3D.prototype);

    Phalanx.prototype.init = function(){
        this.nGons = [];
        for(var j = 0 ; j < this.layers ; j++){
            for(var i = 0 ; i < this.amount ; i++){
                var n = new nGon(this.args);
                this.nGons.push(n);
                var NG = this.nGons[this.nGons.length-1];
                if(i==0)
                NG.rotation.z = i/this.amount * Math.PI*2 +j*.02+i;
                else
                NG.rotation.z = i/this.amount * Math.PI*2 +j*.02+-i;

                NG.position.z = j*this.layerHeight;
                NG.init(this.args);
                this.Line.geometry.vertices = this.Line.geometry.vertices.concat(NG.geo.vertices);
                this.Line.add(NG.Line);
                // NG.dispose(NG,this);


            }
        }
    };

    Phalanx.prototype.dispose = function(){
        
        var that = this;
        this.traverse(function(obj){
            if(obj instanceof THREE.Line || obj instanceof THREE.Mesh){
                obj.geometry.dispose();
                obj.material.dispose();
            }
            // that.remove(obj);
            obj = null;
        });
        if(this.Line.geometry)
                this.Line.geometry.dispose();
        if(this.Line.material)
                this.Line.material.dispose();

        this.Line=null;

        for(var i in this.nGons){
            this.nGons[i].dispose(this.nGons[i],this);
            this.nGons[i] = null;
        }
    }


    return Phalanx;
});