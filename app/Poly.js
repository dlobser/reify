define(["THREE", "ModelGenerator/PerlinNoise", "ModelGenerator/Utils"], function(THREE, noise, Utils){

        
    function Poly(params){

        THREE.Object3D.call(this);

        args = params || {};

        
        this.verts = args.verts || [];
        this.closed = args.closed ? true:false;
        this.geo = args.geometry || new THREE.Geometry();
        this.mat = args.material || new THREE.LineBasicMaterial( );

    }

    Poly.prototype = Object.create(THREE.Object3D.prototype);

    Poly.prototype.makeLinearCurve = function(){
        this.linearCurve = new Utils.linearCurve(this.verts,this.closed);
    };

    Poly.prototype.makeSplineCurve = function(){
        if(this.closed)
            this.splineCurve = new THREE.ClosedSplineCurve3(this.verts);
        else
            this.splineCurve = new THREE.SplineCurve3(this.verts);
    };

    //combine vertices and material into a geometry and parent it to this
    Poly.prototype.makeObject = function(func,args){
        if(this.closed && this.geo.vertices.length>0)
            this.geo.vertices.push(this.geo.vertices[0].clone());
        this.Line = new THREE.Line(this.geo,this.mat);
        // this.add(this.Line);
    };

    return Poly;
});