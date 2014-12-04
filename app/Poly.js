define(["THREE", "ModelGenerator/PerlinNoise", "ModelGenerator/Utils"], function(THREE, noise, Utils){

        
    function Poly(params){

        var args = params || {};

        this.ctrlPoints = args.ctrlPoints || [];
        this.closed = args.closed ? true:false;
        //curve vertices
        this.cVerts = [];
        this.linearCurve = null;
        this.splineCurve = null;

        this.CTRL = new THREE.Object3D();
        this.CTRL.add(this.Curve);

        this.geo = new THREE.Geometry();
        this.mat = args.material || new THREE.LineBasicMaterial( );
        this.Curve = new THREE.Line(this.geo,this.mat);

        this.counter = args.counter || 0;


    }

    Poly.prototype = {
        testVariable : "test"
    }

    Poly.prototype.makeLinearCurve = function(){
        this.linearCurve = new Utils.linearCurve(this.cVerts,this.closed);
    };

    Poly.prototype.makeSplineCurve = function(){
        if(this.closed)
            this.splineCurve = new THREE.ClosedSplineCurve3(this.cVerts);
        else
            this.splineCurve = new THREE.SplineCurve3(this.cVerts);
    };

    //combine vertices and material into a geometry and parent it to this
    Poly.prototype.makeObject = function(func,args){
        if(this.closed && this.geo.vertices.length>0)
            this.geo.vertices.push(this.geo.vertices[0].clone());
        this.Curve.geometry = this.geo;// = new THREE.Line(this.geo,this.mat);
        this.Curve.material = this.mat;
        // this.add(this.Line);
    };

    Poly.prototype.dispose = function(){
        this.cVerts = null;
        this.geo.dispose();
        this.geo = null;
        this.mat.dispose();
        this.mat = null;
        this.Curve = null;
        this.linearCurve = null;
        this.splineCurve = null;

    };

    return Poly;
});