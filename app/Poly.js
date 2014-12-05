define(["THREE", "ModelGenerator/PerlinNoise", "ModelGenerator/Utils"], function(THREE, noise, Utils){

        
    function Poly(params){

        var args = params || {};

        this.ctrlPoints = args.ctrlPoints || [];
        this.closed = args.closed ? true:false;
        //curve vertices
        this.cVerts = [];
        this.path = null;
        this.curveType = args.curveType || "linear";

        this.CTRL = new THREE.Object3D();
        this.CTRL.add(this.Curve);

        this.geo = new THREE.Geometry();
        this.mat = args.material || new THREE.LineBasicMaterial( );
        this.Curve = new THREE.Line(this.geo,this.mat);

        this.counter = args.counter || 0;


    }

    Poly.prototype.makeCurve = function(){

        if(this.curveType == "linear")
            this._makeLinearCurve();
        else
            this._makeSplineCurve();

    };

    Poly.prototype._makeLinearCurve = function(){
        this.path = new Utils.linearCurve(this.cVerts,this.closed);
    };

    Poly.prototype._makeSplineCurve = function(){
        if(this.closed)
            this.path = new THREE.ClosedSplineCurve3(this.cVerts);
        else
            this.path = new THREE.SplineCurve3(this.cVerts);
    };

    //combine vertices and material into a geometry and parent it to this
    Poly.prototype.makeObject = function(func,args){
        if(this.closed && this.geo.vertices.length>0)
            this.geo.vertices.push(this.geo.vertices[0].clone());
        this.Curve.geometry = this.geo.clone();// = new THREE.Line(this.geo,this.mat);
        this.Curve.material = this.mat.clone();
        // this.add(this.Line);
    };

    Poly.prototype.dispose = function(){
        this.cVerts = null;
        this.geo.dispose();
        this.geo = null;
        this.mat.dispose();
        this.mat = null;
        this.Curve.parent.remove(this.Curve);
        this.Curve.geometry.dispose();
        this.Curve.material.dispose();
        this.Curve.geometry = null;
        this.Curve.material = null;
        this.Curve = null;
        this.path = null;

    };

    return Poly;
});