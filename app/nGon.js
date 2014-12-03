define(["THREE", "ModelGenerator/PerlinNoise", "ModelGenerator/Utils", "ModelGenerator/Poly"], function(THREE, noise, Utils, Poly){

    function nGon(params){

        Poly.call(this);
        var args = params || {};
        this.args = params || {};
        this.closed = true;
        this.args.data = args.data || {var1:0,var2:0,var3:0,var4:0,var5:0,var6:0,var7:0};
        this.sides = 3 + Math.floor(this.args.data.var5*10);
        this.detail = args.detail || 1000;
        this.polySize = args.polySize || 1;

        //poly
        this.sides = args.sides || 3;
    }

    Utils.extend(nGon, Poly);

    nGon.prototype.init = function(params){

        this.makeSimplePoly();
        this.makeLinearCurve();
        // this.turtle();
        this.makeObject();

        // this.add(new THREE.Mesh(new THREE.SphereGeometry(1),new THREE.MeshLambertMaterial()));
    };

    nGon.prototype.turtle = function(){

        // var base = new THREE.Object3D();
        // var kid = new THREE.Object3D();
        // base.add(kid);
        // this.add(base);

        // for(var i = 0 ; i < this.detail ; i++){

        //     var io = i/(this.detail-1);
        //     var pos = this.linearCurve.getEvenPointAt(io);
        //     var aim = this.linearCurve.getEvenPointAt(io+0.0001);
        //     base.position = pos;

        //     base.lookAt(aim);
        //     base.up = new THREE.Vector3(0,0,1);

        //     kid.position.x = Math.sin(pos.cPos*Math.PI*this.args.data.var4*30)*((Math.cos(Math.PI+pos.cPos*Math.PI*2)+1)/2)*this.args.data.var2*5;
        //     kid.position.z = Math.cos(pos.cPos*Math.PI*this.args.data.var4*30)*((Math.cos(Math.PI+pos.cPos*Math.PI*2)+1)/2)*this.args.data.var3*5;

        //     var vec = new THREE.Vector3();
        //     this.updateMatrixWorld();
        //     base.updateMatrixWorld();
        //     vec.setFromMatrixPosition(kid.matrixWorld);
        //     vec.t = pos.cPos;

        //     if(i===0){
        //         this.verts[pos.cPos].id = i;
        //     }
        //     if(pos.cPos/Math.floor(pos.cPos)==1){
        //         this.verts[pos.cPos].id = i;
        //     }

        //     this.geo.vertices.push(vec);

        // }

        // this.remove(base);

    };


    nGon.prototype.makeSimplePoly = function(){

        for(var i = 0 ; i < this.sides ; i++){
            var vec = new THREE.Vector3(
                    Math.sin(i/this.sides*Math.PI*2)*this.polySize,
                    this.polySize-Math.cos(i/this.sides*Math.PI*2)*this.polySize,
                    0);
            this.verts.push(vec);
        }
    };

    nGon.prototype.dispose = function(obj,scene){
        // if(this.children){
        //     var that = this;
        //     this.traverse(function(obj){

        //         if(obj instanceof THREE.Line || obj instanceof THREE.Mesh){
        //             obj.geometry.dispose();
        //             obj.material.dispose();
        //         }
        //         that.remove(obj);
        //         obj = null;
        //     });
        // // }
        // scene.remove(obj);
        // if(obj.geometry)
        //         this.Line.geometry.dispose();
        // // if(obj.material)
        //         this.Line.material.dispose();

    };

    return nGon;
});