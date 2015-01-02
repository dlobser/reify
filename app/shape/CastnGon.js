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

        var aData = this.args.data;

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

            // var off = (this.counter/this.args.layers)*Math.PI*6*aData.bulgeFreq+(aData.bulgeOff*1.5*(Math.abs((1+aData.bulgeFreq)*Math.PI*6)));

            var off = ( ( this.counter / this.args.layers ) ) * ( aData.bulgeFreq * 2 );
            off -= (aData.bulgeOff * (aData.bulgeFreq * 2) );
            off += 0.5;

            off *= Math.PI*2;

            if(off<0)
                off=0;
            if(off>Math.PI*2)
                off=Math.PI*2;

            var bulge = (1+Utils.comboCos(off,aData.bulgeSinTri))/2;
            bulge*=-1;
            bulge+=1;

            var sc = (1+this.args.data.bpSize)+bulge*aData.bulgeAmount;

            this.castObject.scale = new THREE.Vector3(sc,sc,sc);

            this.castObject.rotation.x=1*this.counter*0.01*((this.args.data.cbTwist)*2);
            this.castObject.rotation.y=1*this.counter*0.01*((this.args.data.cbTwist)*2);
            this.castObject.rotation.z=1*this.counter*0.01*((this.args.data.cbTwist)*2);

            this.castObject.position.z=Math.sin(this.counter*this.args.data.cbWobbleFreq*0.1)*8*this.args.data.cbWobbleMult;

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

                        var offset = Utils.comboWave(((i*aData.xtraXWaveFreq*Math.PI*2)+this.counter*aData.xtraZWaveFreq*.2),aData.xtraSinTri*0.3331);
                        var offset2 = Utils.comboWave(.3*this.counter*aData.xtraBulgeFreq,aData.xtraSinTri*0.3331);


                        pVert.multiplyScalar(1+(aData.xtraWaveMult*.5)*offset+(offset2*aData.xtraBulgeAmount));

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