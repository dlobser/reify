define(["THREE", "ModelGenerator/PerlinNoise", "ModelGenerator/Utils"], function(THREE, noise, Utils){

        
    function Poly(params){

        var args = params || {};

        this.ctrlPoints = args.ctrlPoints || [];
        this.closed = args.closed ? true:false;

        //curve vertices
        this.cVerts = [];
        this.path = null;
        this.linearCurve = null;
        this.splineCurve = null;
        this.curveType = args.curveType || "linear";
        this.id = params.id || 0;

        this.CTRL = new THREE.Object3D();
        this.CTRL1 = new THREE.Object3D();
        this.CTRL2 = new THREE.Object3D();

        this.CTRL.add(this.CTRL1);
        this.CTRL1.add(this.CTRL2);
        this.CTRL2.add(this.Curve);

        this.geo = new THREE.Geometry();
        this.mat = args.material || new THREE.LineBasicMaterial( {color:0xffffff,transparent:true,opacity:1,linewidth:2,vertexColors:THREE.VertexColors});
        this.Curve = new THREE.Line(this.geo,this.mat);

        this.counter = args.counter || 0;


    }

    Poly.prototype.makeCurve = function(){

        this._makeSplineCurve();
        this._makeLinearCurve();
            

    };

    Poly.prototype.getPointAt = function(t,v){

        var theta = t || 0;
        var val = v || 0;

        if(val>1)
            val=1;
        if(val<0)
            val=0;

        if(theta>1)
            theta=1;
        if(theta<0)
            theta=0;

        return this.linearCurve.getEvenPointAt(theta).lerp(this.splineCurve.getPointAt(theta),val);

    };

    Poly.prototype._makeLinearCurve = function(){
        this.linearCurve = new Utils.linearCurve(this.cVerts,this.closed);
    };

    Poly.prototype._makeSplineCurve = function(){
        if(this.closed)
            this.splineCurve = new THREE.ClosedSplineCurve3(this.cVerts);
        else
            this.splineCurve = new THREE.SplineCurve3(this.cVerts);
    };

    //combine vertices and material into a geometry and parent it to this
    Poly.prototype.makeObject = function(func,args){

        if(this.closed && this.geo.vertices.length>0)
            this.geo.vertices.push(this.geo.vertices[0].clone());

        for(var i = 0 ; i < this.geo.vertices.length ; i++){
            var c2 = new THREE.Color((2+Math.sin(i*0.1))/5,(2+Math.cos(2+i*0.1))/5,(2+Math.sin(1+i*0.1))/5);
            var v = this.geo.vertices[i];
            var c = .3+noise(v.x*0.3,v.y*0.3,v.z*0.3)/2;
            this.geo.colors[i] = new THREE.Color(c+c2.r,c+c2.g,c+c2.b);
        }

        this.Curve.geometry = this.geo;
        this.Curve.geometry.colors = this.geo.colors;
        this.Curve.material = this.mat;
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