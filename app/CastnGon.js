define(["THREE", "ModelGenerator/PerlinNoise", "ModelGenerator/Utils", "ModelGenerator/Poly"], function(THREE, noise, Utils, Poly){

    function CastnGon(params){

        Poly.call(this,params);
        var args = params || {};
        this.args = params || {};
        this.closed = true;
        this.args.data = args.data || {var1:0,var2:0,var3:0,var4:0,var5:0,var6:0,var7:0};
        this.sides = Math.max(3,3 + Math.floor(this.args.data.bpSides*15));
        this.detail = args.detail || 1000;
        this.polySize = args.polySize || 1;

        this.castObject = args.castObject || new THREE.Mesh(new THREE.BoxGeometry(this.polySize,this.polySize,this.polySize),new THREE.MeshLambertMaterial(  ));

        this.caster = new THREE.Raycaster();
        // this.counter = args.counter || 0;
        // console.log(this.args);

    }

    Utils.extend(CastnGon, Poly);

    CastnGon.prototype.init = function(params){

        this.makeSimplePoly();
        this.makeCurve();
        this.turtle();
        this.makeObject();

        return this.Curve;
        // this.add(new THREE.Mesh(new THREE.SphereGeometry(1),new THREE.MeshLambertMaterial()));
    };

    CastnGon.prototype.turtle = function(){

        var base = new THREE.Object3D();
        var kid = new THREE.Object3D();
        base.add(kid);
        this.CTRL2.add(base);

        var verts = [];

        for(var i = 0 ; i < this.detail ; i++){

            var io = i/(this.detail-1);

            var pos,aim;

            if(this.curveType == "linear"){
                pos = this.path.getEvenPointAt(io);
                aim = this.path.getEvenPointAt(io+0.000000001);
            }
            else{
                pos = this.path.getPointAt(io);
                offPos = io+0.000000001;
                if(offPos>1)
                    offPos=0;
                aim = this.path.getPointAt(offPos);
            }
            // console.log(io);

            if(typeof pos.cPos == 'undefined')
                pos.cPos = io*this.cVerts.length;

            base.position = pos;

            base.lookAt(aim);
            base.up = new THREE.Vector3(0,0,1);

            var sinMult = (this.args.data.songMult * this.args.songCurve.getPointAt(this.counter/this.args.layers).y);

            var arrayMult = this.args.data.arrayData.getPointAt(this.args.offset/this.args.layers).x;


            kid.position.x = arrayMult*Math.sin((this.counter*this.args.data.tpTwist)+
                pos.cPos*Math.PI*2*(Math.floor(this.args.data.tpPetals*30)))*
                (this.args.data.tpMult + sinMult)*5*
                Math.max((1+this.args.data.tpCornerMult),
                ((Math.cos(Math.PI+pos.cPos*Math.PI*2)+1)/2));

            kid.position.z = arrayMult*Math.cos((this.counter*this.args.data.tpTwist)+
                pos.cPos*Math.PI*2*(Math.floor(this.args.data.tpPetals*30)))*
                (this.args.data.tpLoop )*5*
                Math.max((1+this.args.data.tpCornerMult),
                ((Math.cos(Math.PI+pos.cPos*Math.PI*2)+1)/2));

            var vec = new THREE.Vector3();
            this.CTRL.updateMatrixWorld();
            base.updateMatrixWorld();
            vec.setFromMatrixPosition(kid.matrixWorld);
            vec.t = pos.cPos;

            if(i===0){
                verts["id"+pos.cPos] = i;
            }
            if(pos.cPos/Math.floor(pos.cPos)==1){
                verts["id"+pos.cPos] = i;
            }

            verts.push(vec);

        }
        this.geo.vertices = verts;


        this.CTRL.remove(base);
    };


    CastnGon.prototype.makeSimplePoly = function(){


        this.counter++;

        for(var i = 0 ; i < this.sides ; i++){

            var c = this.args.data.bpTwist*this.counter*.01;// this.counter*.01;

            var vec = new THREE.Vector3(
                    Math.sin(c+(i/this.sides*Math.PI*2))*1e6,
                    Math.cos(c+(i/this.sides*Math.PI*2))*1e6,
                    0);
            var dir = new THREE.Vector3(
                    Math.sin(c+Math.PI+(i/this.sides*Math.PI*2))*1,
                    Math.cos(c+Math.PI+(i/this.sides*Math.PI*2))*1,
                    0);


            this.castObject.rotation.x=this.args.data.cbTwistX*this.counter*.1;
            this.castObject.rotation.y=this.args.data.cbTwistY*this.counter*.1;
            this.castObject.rotation.z=this.args.data.cbTwistZ*this.counter*.1;
            this.castObject.position.z=Math.sin(this.counter*this.args.data.bpSize)*20*this.args.data.cbTwist;

            this.castObject.updateMatrixWorld();

            // console.log(this.castObject.rotation);

            this.caster.set(vec,dir);//.pickingRay( new THREE.Vector3(0,0,10), new THREE.Vector3(0,0,-10) );
            var pPos = this.caster.intersectObject(this.castObject);

            // var intersect = ray.intersectObject( this.castObject ); 

            var r = vec.multiplyScalar(.000001);//new THREE.Vector3(0,0,0);

            if(typeof pPos[0]!=='undefined'){
                if ( typeof pPos[0].point !== 'undefined') { 
                    r = pPos[0].point;//new THREE.Vector3(intersect[0].point.x,intersect[0].point.y,intersect[0].point.z);
                    
                }
            }

            this.cVerts.push(r);
        };

       
    };

    CastnGon.prototype.dispose = function(obj,scene){

        Poly.prototype.dispose.call(this);
        this.args = null;
        this.castObject.geometry.dispose();
        this.castObject.geometry = null;
        this.castObject.material.dispose();
        this.castObject.material = null;
        this.castObject = null;
        this.caster = null;

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

    return CastnGon;
});