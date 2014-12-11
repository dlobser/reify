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

        this.wave = new Utils.Wave();

    }

    Utils.extend(CastnGon, Poly);

    CastnGon.prototype.init = function(params){

        this.makeSimplePoly();
        this.makeCurve();
        this.turtle();
        this.makeObject();

        return this.Curve;
    };

    CastnGon.prototype.turtle = function(){

        var base = new THREE.Object3D();
        var kid = new THREE.Object3D();
        base.add(kid);
        this.CTRL2.add(base);

        var aData = this.args.data;

        var verts = [];

        for(var i = 0 ; i < this.detail ; i++){

            var io = i/(this.detail);

            var pos,aim;

            var off = 0.0001;

            // if(io+off>1)
            //     off=0;

            pos = this.getPointAt(io,aData.linearSpline);
            aim = this.getPointAt(io+off,aData.linearSpline);

            if(typeof pos.cPos == 'undefined')
                pos.cPos = io*this.cVerts.length;

            base.position = pos;

            base.lookAt(aim);
            base.up = new THREE.Vector3(0,0,1);

            var sinMult = (aData.songMult * this.args.songCurve.getPointAt(this.counter/this.args.layers).y);

            var arrayMult = 1;//aData.arrayData.getPointAt(this.args.offset/this.args.layers).x;

            var twist2 = this.counter*Utils.remap(aData.tpTwist2);
            var twist = this.counter*Utils.remap(aData.tpTwist);
            var petals = Math.floor(aData.tpPetals*15);
            var petalMult = (Utils.remap(aData.tpMult) + sinMult);
            var petalLoop = Utils.remap(aData.tpLoop);
            var cornerMult = Utils.remap(aData.tpCornerMult)/2;
            var cornerCos = ((Math.cos(Math.PI+pos.cPos*Math.PI*2)+1)/2);

            var veca = arrayMult*
                Math.sin(
                        (twist2*0.5+twist*3)+
                        pos.cPos*Math.PI*2*
                        (petals))*
                    petalMult*5*
                    Math.max(
                        (0.5+cornerMult),
                        cornerCos
                    );

             // var veca = arrayMult*Math.sin((this.counter*Utils.remap(aData.tpTwist2)*0.5+
             //    this.counter*Utils.remap(aData.tpTwist)*3)+
             //    pos.cPos*Math.PI*2*(Math.floor(aData.tpPetals*15)))*
             //    (Utils.remap(aData.tpMult) + sinMult)*5*
             //    Math.max((0.5+Utils.remap(aData.tpCornerMult)/2),
             //    ((Math.cos(Math.PI+pos.cPos*Math.PI*2)+1)/2));
              var vecb = arrayMult*
                this.wave.TriSin(
                        (twist2*0.5+twist*3)+
                        pos.cPos*Math.PI*2
                        *(petals))*
                    petalMult*5*
                    Math.max(
                        (0.5+cornerMult),
                        cornerCos
                    );
            // var vecb = arrayMult*
            //     this.wave.TriSin(
            //         (this.counter*Utils.remap(aData.tpTwist2)*0.5+
            //     this.counter*Utils.remap(aData.tpTwist)*3)+
            //     pos.cPos*Math.PI*2*(Math.floor(aData.tpPetals*15)))*
            //     (Utils.remap(aData.tpMult) + sinMult)*5*
            //     Math.max((0.5+Utils.remap(aData.tpCornerMult)/2),
            //     ((Math.cos(Math.PI+pos.cPos*Math.PI*2)+1)/2));

            kid.position.x  = Utils.lerp(veca,vecb,aData.sinTri);

            kid.position.z = arrayMult*
                Math.cos(
                        (twist2*0.5+twist*3)+
                        pos.cPos*Math.PI*2
                        *(petals))*
                    petalLoop*5*
                    Math.max(
                        (0.5+cornerMult),
                        cornerCos
                    );

                // kid.position.z = arrayMult*Math.cos((this.counter*Utils.remap(aData.tpTwist2)*0.5+
                // this.counter*Utils.remap(aData.tpTwist)*3)+
                // pos.cPos*Math.PI*2*(Math.floor(aData.tpPetals*15)))*
                // (petalLoop )*5*
                // Math.max((0.5+Utils.remap(aData.tpCornerMult)/2),
                // ((Math.cos(Math.PI+pos.cPos*Math.PI*2)+1)/2));

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

            vec.z=this.CTRL.position.z;

            //this is a problem
            if(i>0)
                verts.push(vec);

        }

        this.geo.vertices = verts;

        this.CTRL.remove(base);
    };


    CastnGon.prototype.makeSimplePoly = function(){


        // this.counter++;

        for(var i = 0 ; i < this.sides ; i++){

            var c = Utils.remap(this.args.data.bpTwist)*this.counter*0.01;// this.counter*.01;

            var vec = new THREE.Vector3(
                    Math.sin(c+(i/this.sides*Math.PI*2))*1e6,
                    Math.cos(c+(i/this.sides*Math.PI*2))*1e6,
                    0);
            var dir = new THREE.Vector3(
                    Math.sin(c+Math.PI+(i/this.sides*Math.PI*2))*1,
                    Math.cos(c+Math.PI+(i/this.sides*Math.PI*2))*1,
                    0);

            var sc = Utils.remap(1+this.args.data.bpSize);

            this.castObject.scale = new THREE.Vector3(sc,sc,sc);

            this.castObject.rotation.x=Utils.remap(this.args.data.cbTwistX)*this.counter*0.02*(Utils.remap(this.args.data.cbTwist)*3);
            this.castObject.rotation.y=Utils.remap(this.args.data.cbTwistY)*this.counter*0.02*(Utils.remap(this.args.data.cbTwist)*3);
            this.castObject.rotation.z=Utils.remap(this.args.data.cbTwistZ)*this.counter*0.02*(Utils.remap(this.args.data.cbTwist)*3);

            this.castObject.position.z=Math.sin(this.counter*this.args.data.cbWobbleFreq*0.5)*5*this.args.data.cbWobbleMult;

            this.castObject.updateMatrixWorld();

            this.caster.set(vec,dir);
            var pPos = this.caster.intersectObject(this.castObject);

            var r = vec.multiplyScalar(0.000001);

            if(typeof pPos[0]!=='undefined'){
                if ( typeof pPos[0].point !== 'undefined') {
                    r = pPos[0].point;
                }
            }

            this.cVerts.push(r);
        }

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
    };

    return CastnGon;
});