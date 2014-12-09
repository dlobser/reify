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

        // if(this.curveType == "linear")
            this._makeSplineCurve();
            // console.log(this.cVerts)
            this._makeLinearCurve();
        // else
            

    };

    Poly.prototype.getPointAt = function(t,v){

        var thet = t || 0;
        var val = v || 0;

        if(val>1)
            val=1;
        if(val<0)
            val=0;

        if(thet>1)
            thet=1;
        if(thet<0)
            thet=0;

        // var veca = this.linearCurve.getEvenPointAt(t);
        // var vecb = this.splineCurve.getPointAt(t);
        return this.linearCurve.getEvenPointAt(thet).lerp(this.splineCurve.getPointAt(thet),val);
        // aim = this.linearCurve.getEvenPointAt(io+off,aData.nothing).lerp(this.splineCurve.getPointAt(io+off),aData.nothing);
           

        // var r = veca.lerp(vecb,val);
        // r.cPos = vecb;
        // console.log(r);
        // return this.linearCurve.getEvenPointAt(t).lerp(this.splineCurve.getPointAt(t),val);
        // return veca;

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
            this.geo.colors[i] = new THREE.Color((2+Math.sin(i*.1))/3,(2+Math.cos(2+i*.1))/3,(2+Math.sin(1+i*.1))/3);
        }

        this.Curve.geometry = this.geo.clone();// = new THREE.Line(this.geo,this.mat);
        this.Curve.geometry.colors = this.geo.colors;
        this.Curve.material = this.mat.clone();
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