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

        var aData = this.args.data;

        var verts = [];

        for(var i = 0 ; i < this.detail ; i++){

            var io = i/(this.detail-1);

            var pos,aim;

            var off = .00000001;
            if(io+off>1)
                off=0;

            // if(this.curveType == "linear"){
            pos = this.getPointAt(io,aData.linearSpline);//this.linearCurve.getEvenPointAt(io,aData.nothing).lerp(this.splineCurve.getPointAt(io),aData.nothing);
            aim = this.getPointAt(io+off,aData.linearSpline);//this.linearCurve.getEvenPointAt(io+off,aData.nothing).lerp(this.splineCurve.getPointAt(io+off),aData.nothing);
            // }
            // else{
            //     pos = this.path.getPointAt(io);
            //     offPos = io+0.000000001;
            //     if(offPos>1)
            //         offPos=0;
            //     aim = this.path.getPointAt(offPos);
            // }
            // console.log(io);

            if(typeof pos.cPos == 'undefined')
                pos.cPos = io*this.cVerts.length;

            base.position = pos;

            base.lookAt(aim);
            base.up = new THREE.Vector3(0,0,1);

            var sinMult = (aData.songMult * this.args.songCurve.getPointAt(this.counter/this.args.layers).y);

            var arrayMult = 1;//aData.arrayData.getPointAt(this.args.offset/this.args.layers).x;

            var veca = arrayMult*Math.sin((this.counter*Utils.remap(aData.tpTwist))+
                pos.cPos*Math.PI*2*(Math.floor(aData.tpPetals*15)))*
                (Utils.remap(aData.tpMult) + sinMult)*5*
                Math.max((.5+Utils.remap(aData.tpCornerMult)),
                ((Math.cos(Math.PI+pos.cPos*Math.PI*2)+1)/2));

            var vecb = arrayMult*this.wave.TriSin((this.counter*Utils.remap(aData.tpTwist))+
                pos.cPos*Math.PI*2*(Math.floor(aData.tpPetals*15)))*
                (Utils.remap(aData.tpMult) + sinMult)*5*
                Math.max((.5+Utils.remap(aData.tpCornerMult)),
                ((Math.cos(Math.PI+pos.cPos*Math.PI*2)+1)/2));

            kid.position.x  = Utils.lerp(veca,vecb,aData.sinTri);

            kid.position.z = arrayMult*Math.cos((this.counter*Utils.remap(aData.tpTwist))+
                pos.cPos*Math.PI*2*(Math.floor(aData.tpPetals*15)))*
                (Utils.remap(aData.tpLoop) )*5*
                Math.max((.5+Utils.remap(aData.tpCornerMult)),
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

            vec.z=this.CTRL.position.z;

            //this is a problem
            if(i>0&&i<this.detail-2)
                verts.push(vec);

        }
        this.geo.vertices = verts;


        this.CTRL.remove(base);
    };


    CastnGon.prototype.makeSimplePoly = function(){


        this.counter++;

        for(var i = 0 ; i < this.sides ; i++){

            var c = Utils.remap(this.args.data.bpTwist)*this.counter*.01;// this.counter*.01;

            var vec = new THREE.Vector3(
                    Math.sin(c+(i/this.sides*Math.PI*2))*1e6,
                    Math.cos(c+(i/this.sides*Math.PI*2))*1e6,
                    0);
            var dir = new THREE.Vector3(
                    Math.sin(c+Math.PI+(i/this.sides*Math.PI*2))*1,
                    Math.cos(c+Math.PI+(i/this.sides*Math.PI*2))*1,
                    0);

            this.castObject.scale = new THREE.Vector3(Utils.remap(1+this.args.data.bpSize),1+this.args.data.bpSize,1+this.args.data.bpSize);

            this.castObject.rotation.x=Utils.remap(this.args.data.cbTwistX)*this.counter*.02*(.5+Utils.remap(this.args.data.cbTwist)*3);
            this.castObject.rotation.y=Utils.remap(this.args.data.cbTwistY)*this.counter*.02*(.5+Utils.remap(this.args.data.cbTwist)*3);
            this.castObject.rotation.z=Utils.remap(this.args.data.cbTwistZ)*this.counter*.02*(.5+Utils.remap(this.args.data.cbTwist)*3);

            this.castObject.position.z=Math.sin(this.counter*this.args.data.cbWobbleFreq*.5)*5*this.args.data.cbWobbleMult;

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