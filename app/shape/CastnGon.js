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

        this.castObjectSides = args.castObjectSides || 3;

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

    }

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

            var sc = (1+this.args.data.bpSize);

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