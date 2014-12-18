define(["THREE", "ModelGenerator/utils/PerlinNoise", "ModelGenerator/utils/Utils", "ModelGenerator/shape/Poly"], 
    function(THREE, noise, Utils, Poly){

    function CastnGon(params){

        Poly.call(this,params);
        var args = params || {};
        this.args = params || {};
        this.closed = true;
        this.args.data = args.data || {var1:0,var2:0,var3:0,var4:0,var5:0,var6:0,var7:0};
        this.sides = Math.max(3,3 + Math.floor(this.args.data.bpSides*15));
        this.detail = args.detail || 1000;
        this.polySize = args.polySize || 1;

        this.lerpCtrlAmount = args.lerpCtrlAmount || 0;
        this.lerpCVerts = [];

        this.castObjectSides = args.castObjectSides || 4;

        this.castObject = this.makeCastGeo(this.castObjectSides);
        this.caster = new THREE.Raycaster();

        this.wave = new Utils.Wave();

    }

    Utils.extend(CastnGon, Poly);

    CastnGon.prototype.init = function(params){

        this.makeSimplePoly();
        this.makeCurve();
        this.turtle();
        this.makeObject();

        // this.Curve.add(this.castObject);

        return this.Curve;
    };

    CastnGon.prototype.makeCastGeo = function(sides){

        var sphereGeo = new THREE.SphereGeometry(this.polySize,sides,sides+1);
        var mat = new THREE.Matrix4();
        mat.makeRotationX(Math.PI/2);
       
        for(var i = 0 ; i < sphereGeo.vertices.length ; i++){
            sphereGeo.vertices[i].applyMatrix4(mat);
            sphereGeo.verticesNeedUpdate = true;
        }
        mat.makeRotationZ(Math.PI/4);

        for(var i = 0 ; i < sphereGeo.vertices.length ; i++){
            sphereGeo.vertices[i].applyMatrix4(mat);
            sphereGeo.verticesNeedUpdate = true;
        }
        sphereGeo.mergeVertices();

        return new THREE.Mesh(sphereGeo,new THREE.MeshLambertMaterial(  ));

    };


    CastnGon.prototype.makeSimplePoly = function(){

        for(var i = 0 ; i < this.sides ; i++){

            var c = (this.args.data.bpTwist)*this.counter*0.01;// this.counter*.01;

            var vec = new THREE.Vector3(
                    Math.sin(c+(i/this.sides*Math.PI*2))*1e6,
                    Math.cos(c+(i/this.sides*Math.PI*2))*1e6,
                    0);
            var dir = new THREE.Vector3(
                    Math.sin(c+Math.PI+(i/this.sides*Math.PI*2))*1,
                    Math.cos(c+Math.PI+(i/this.sides*Math.PI*2))*1,
                    0);

            var off = (this.counter/this.args.layers)*Math.PI*2*info.var7+(info.var8*(1+Math.abs(info.var7*Math.PI)));

            if(off<0)
                off=0;
            if(off>Math.PI*2)
                off=Math.PI*2;

            var bulge = (1+Utils.comboCos(off,info.var10))/2;
            bulge*=-1;
            bulge+=1;

            var sc = (1+this.args.data.bpSize)+bulge*info.var9*-1;

            this.castObject.scale = new THREE.Vector3(sc,sc,sc);

            this.castObject.rotation.x=(this.args.data.cbTwistX)*this.counter*0.02*((this.args.data.cbTwist)*3);
            this.castObject.rotation.y=(this.args.data.cbTwistY)*this.counter*0.02*((this.args.data.cbTwist)*3);
            this.castObject.rotation.z=(this.args.data.cbTwistZ)*this.counter*0.02*((this.args.data.cbTwist)*3);

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

        if(this.lerpCtrlAmount>0){

            if(typeof this.originalCVerts == 'undefined'){
                this.originalCVerts = [];
                for(var i = 0 ; i < this.cVerts.length ; i++){
                    this.originalCVerts.push(this.cVerts[i].clone());
                }
                this.originalLinearCurve = new Utils.linearCurve(this.originalCVerts,this.closed);
            }

            var newCVerts = [];

            for(var j = 0 ; j < this.cVerts.length+1 ; j++){

                if(j>0){
                    for(var i = 1 ; i < this.lerpCtrlAmount+1 ; i++){

                        if(j<this.cVerts.length)
                            var tVert = this.cVerts[j].clone();
                        else
                            var tVert = this.cVerts[0].clone();

                        var pVert = this.cVerts[j-1].clone();
                        pVert.lerp(tVert,i/(this.lerpCtrlAmount+1));

                        //move the points around

                        var offset = Utils.comboWave(((i*info.var4)+this.counter*info.var3),info.var5/3);
                        var offset2 = Utils.comboWave(this.counter*info.var4b,info.var5/3);


                        pVert.multiplyScalar(1+info.var2*offset+(offset2*info.var4c));

                        this.lerpCVerts.push(pVert);
                        newCVerts.push(pVert);
                    }
                }

                if(j<this.cVerts.length)
                    newCVerts.push(this.cVerts[j].clone());
                // else
                //     newCVerts.push(this.cVerts[0].clone());

            }

            this.cVerts = newCVerts;
        }

        // console.log(this.cVerts);

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