define(["THREE"], function(THREE){

	"use strict";

	/**
	 *  setup the three.js environment
	 */
	var ShapeGenerator = function(container, width, height){
		this.camera = new THREE.PerspectiveCamera( 70, width / height, 1, 20000 );
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor( 0x0000000 );
		this.renderer.setSize(width, height);

		container.append(this.renderer.domElement);

		this.camera.position.setZ(-60);
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));

		//add light
		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		this.light = new THREE.PointLight( 0xffffff );
		this.light.position.copy( this.camera.position );
		this.scene.add( this.light );
		
		this.animate();
	};

	ShapeGenerator.prototype.makeShape = function(parameters) {
		//remove the old shape
		if (this.object){
			this.scene.remove(this.object);
		}

		this.object = makeShape(Math.random(),Math.random());
		this.scene.add(this.object);
	};

	ShapeGenerator.prototype.animate = function(){
		requestAnimationFrame(this.animate.bind(this));
		this.renderer.render( this.scene, this.camera );
		if (this.object){
			this.object.rotateZ(0.01);
			this.object.rotateX(0.005);
		}
	};

	/**
	 *  any teardown that needs to happen to remove
	 *  this object and any objects which it created from memory. 
	 */
	ShapeGenerator.prototype.dispose = function(){
		this.animate = function(){};
		this.scene.remove(this.object);
		this.object.geometry.dispose();
		this.object.material.dispose();
		this.object = null;
		this.renderer = null;
	};


	return ShapeGenerator;
});

var pi = Math.PI/2;

function setData(arr,objects) {
    var newData = [];
    var dataPoint = {};
    for(var i in objects){
        
        for (var k in objects[i]) {
            if (objects[i].hasOwnProperty(k)) {
                if(dataPoint[k]==undefined){
                    dataPoint[k]=0;
                }
               dataPoint[k] += (objects[i][k]*arr[i]);
            }
        }
        newData.push(dataPoint);
    }
    return dataPoint;
}


function updateData(newData,oldData) {
        
    for (var k in newData) {
        if (newData.hasOwnProperty(k)) {
           oldData[k] = newData[k];
        }
    }

    return oldData;
}


function wAverage(a,b){

    var lr = dist(1,0,a,b);
    var ul = dist(0,1,a,b);
    var ur = dist(1,1,a,b);
    var ll = dist(0,0,a,b);

    var wlr = Math.max((1-(lr)/1),0);
    var wul = Math.max((1-(ul)/1),0);
    var wur = Math.max((1-(ur)/1),0);
    var wll = Math.max((1-(ll)/1),0);

    var td = wlr+wur+wul+wll;

    return [wur/td,wul/td,wlr/td,wll/td];
}

function dist(a,b,c,d){
    return Math.sqrt((a-c)*(a-c) + (b-d)*(b-d));
}


var objs = [

//low frequency noise - high petal count

obj1={
loopDetail: 0,
noiseAmount: 0.539034716342083,
noiseDetail: 0.1055038103302286,
noiseLoops: 0,
noiseOffset: 0,
noiseSymmetry: 0.7124470787468247,
nothing: 0,
petalAmount: 0.14885690093141402,
petalLoop: 0,
petals: 3,
spread: 0,
ar1: 0,
zWaveFreq: 0,
zWaveMult1: 0,
zWaveMult2: 0,
},


//low frequency noise - noise loops - no petals

obj3={
loopDetail: 0,
noiseAmount: 0.45232853513971216,
noiseDetail: 0.04047417442845047,
noiseLoops: 0.1055038103302286,
noiseOffset: 0.6690939881456393,
noiseSymmetry: 0.018797629127857762,
nothing: 0,
petalAmount: 0,
petalLoop: 0,
petals: 0,
spread: 0.539034716342083,
var1: 0,
zWaveFreq: 0,
zWaveMult1: 0,
zWaveMult2: 0,
},

//high frequency noise - high petal count

obj2={
loopDetail: 0,
noiseAmount: 0.45232853513971216,
noiseDetail: 0.5607112616426757,
noiseLoops: 0,
noiseOffset: -0.17629127857747673,
noiseSymmetry: 0.25723962743437756,
nothing: 0,
petalAmount: 0.300592718035563,
petalLoop: 0.04047417442845047,
petals: 3,
spread: 0.3222692633361559,
var1: 0,
zWaveFreq: 0,
zWaveMult1: 0,
zWaveMult2: 0,
},

//high frequency noise - noise loops - no petals

obj4={
loopDetail: 0,
noiseAmount: 0.300592718035563,
noiseDetail: 0.3439458086367486,
noiseLoops: 0.1055038103302286,
noiseOffset: 0.5607112616426757,
noiseSymmetry: 1,
nothing: 0,
petalAmount: 0,
petalLoop: 0,
petals: 0,
spread: 0.8208298052497882,
var1: 0,
zWaveFreq: 0,
zWaveMult1: 0,
zWaveMult2: 0,
}
];


function vecs(x,y,z){
    return new THREE.Vector3(x,y,z);
}

function makeShape(x,y,args){

    if(!args) args = {};
    var verts = args.res || 5000;
    var tubeRadius = args.tubeRadius || .3;

    var oData={
        loopDetail: 0,
        noiseAmount: 0,
        noiseDetail: 0,
        noiseLoops: 0,
        noiseOffset: 0,
        noiseSymmetry: 0,
        nothing: 0,
        petalAmount: 0,
        petalLoop: 0,
        petals: 0,
        spread: 0.0,
        var1: 0,
        zWaveFreq: 0,
        zWaveMult1: 0,
        zWaveMult2: 0,
    }

    var root = new THREE.Matrix4();
    var mats = [];
    var mats1 = [];
    var mats2 = [];

    for (var i = 0; i < 5; i++) {
        var m = new THREE.Matrix4();
        m.setPosition(new THREE.Vector3(0,5,0))
        mats1.push(m);
    };
    for (var i = 0; i < 5; i++) {
        var m = new THREE.Matrix4();
        mats2.push(m);
    };

    mats = mats1.concat(mats2);

    var geo = new THREE.Geometry();

    var scalar = 5/verts;

    var arr = wAverage(x,y);

    var newData = setData(arr,objs);
    var tData = updateData(newData,oData);

    for (var i = 0; i < verts; i++) {

        root.identity();
        //overall rotation
        mats1[0].makeRotationZ(.001*i*pi*4);
        //Z offset controls
        mats1[1].setPosition(vecs(0,0,
            (i*.001*tData.zWaveMult1)*
            tData.zWaveMult2*
            Math.sin(tData.zWaveFreq*i*.051*pi*4)+
            .27*i*scalar*10)
        );

        //spread out/scale up
        mats1[4].setPosition(vecs(0,i*tData.spread*.001,0));
        //petals control
        mats2[2].setPosition(vecs(0,Math.sin(i*.001*pi*4*Math.floor(tData.petals*30))*tData.petalAmount*(i*scalar),0));
        //loop petals
        mats2[0].makeRotationZ(i*tData.petalLoop*.0001);

        //noise position offset
        mats2[3].setPosition(vecs(
                noise(tData.noiseOffset+2+(Math.sin(.001*i*pi*4)*tData.noiseDetail*30)/2)*tData.noiseAmount*10*(i*scalar)*tData.noiseOffset,
                noise(tData.noiseOffset+1+(Math.cos(.001*i*pi*4)*tData.noiseDetail*30)/2)*tData.noiseAmount*10*(i*scalar),
                0
            ));

        //noise loop
        mats2[1].makeRotationZ(noise(tData.noiseOffset+1+(Math.sin(.001*i*pi*4)*tData.noiseDetail*10)/2)*tData.noiseLoops*200);

        for(var k = 0 ; k < mats.length ; k++){

            root.multiply(mats[k]);
            var tMat = new THREE.Matrix4();
            tMat.identity();
            for(var j = 0 ; j < k ; j++){
                tMat.multiply(mats[j]);
            }
        }

        var vec = vecs(0,0,0);
        vec.setFromMatrixPosition(root);

        geo.vertices.push(vec);
    };

    var pl = [];
    pl.push(geo.vertices);
    var curve = new THREE.SplineCurve3(pl[0]);
    var p= new THREE.Mesh(new THREE.TubeGeometry(curve,pl[0].length,tubeRadius),new THREE.MeshLambertMaterial());

    return p;

}


 var noise = function(ix, iy, iz) {

 		var x = ix || 0;
 		var y = iy || 0;
 		var z = iz || 0;
      var X = Math.floor(x)&255, Y = Math.floor(y)&255, Z = Math.floor(z)&255;
      x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
      var u = fade(x), v = fade(y), w = fade(z);
      var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
          B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,
      return lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
                                     grad(p[BA  ], x-1, y  , z   )), // BLENDED
                             lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
                                     grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
                     lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
                                     grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
                             lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                                     grad(p[BB+1], x-1, y-1, z-1 ))));
   };
   function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); };
   function lerp(t, a, b) { return a + t * (b - a); };
   function grad(hash, x, y, z) {
      var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
      var u = h<8 ? x : y,                    // INTO 12 GRADIENT DIRECTIONS.
          v = h<4 ? y : h==12||h==14 ? x : z;
      return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
   };
   var p = [ 151,160,137,91,90,15,
   131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
   190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
   88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
   77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
   102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
   135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
   5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
   223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
   129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
   251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
   49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
   138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180 ];
   for (var i=0; i < 256 ; i++) p.push(p[i]);