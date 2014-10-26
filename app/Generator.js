define(["THREE", "ModelGenerator/PerlinNoise", "ModelGenerator/Presets"], function(THREE, noise, presets){
	
pi = Math.PI/2;

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


function updateData(newData) {

    var oldData = identityData();
        
    for (var k in newData) {
        if (newData.hasOwnProperty(k)) {
           oldData[k] = newData[k];
        }
    }

    return oldData;
}

function printData(vData){

    var out = "{";

    for (var k in vData) {
        if (vData.hasOwnProperty(k)) {
            if(vData[k]!=0)
                out += k + ":" + vData[k] + ",\n";
        }
    }
    out+="}";

    console.log(out);
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
    
    //high petals
    obj1={
        petalAmount:0.7774767146486028,
        petals:0.6040643522438611,
        spread:0.5823878069432684,
        var6:1,
    } ,

    //low petals
    obj3={
        petalAmount:0.8425063505503809,
        petals:0.21388653683319214,
        spread:0.300592718035563,
    } ,

     //high noise
    obj2={
        noiseAmount:0.1271803556308213,
        noiseDetail:0.8425063505503809,
        noiseOffset:1,
        noiseSymmetry:1,
        petalAmount:-0.046232006773920364,
        var6:1,
    } ,

    //low noise
    obj4 = {
        noiseAmount:0.43065198983911945,
        noiseDetail:0.08382726502963589,
        noiseOffset:0.21388653683319214,
        spread:-0.0028789161727349466,
    } 
];


function vecs(x,y,z){
    return new THREE.Vector3(x,y,z);
}

function identityData(){

    //return zeroed dataset

    return {
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
        spread: 0,
        var1: 0,
        zWaveFreq: 0,
        zWaveMult1: 0,
        zWaveMult2: 0,
    }
}

function makeShape(args){

    if(!args) args = {};
    var verts = args.res || 5000;
    var tubeRadius = args.tubeRadius || 1;
    var extrude = args.extrude ? true : false;
    var geo = args.geo || new THREE.Geometry();
    var updateFrequency = args.updateFrequency || verts ;

    if(this.countUp==undefined){
        this.countUp = 0;
    }

    var arr = args.values || [data.var2,data.var3,data.var4,data.var5,data.var6];
    var oData = args.zeroData || identityData();

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

    var scalar = 5/verts;

    //data is my default dat.gui sliders object - it will be used if it exists, if not, pass it zero data
    // if(data!==undefined)
    //     objs.unshift(data);
    // else
        objs.unshift(oData);

    if(arr.length<objs.length){
        while(arr.length<objs.length)
            arr.push(0);
    }

    var newData = setData(arr,objs);
    var tData = updateData(newData);




    for (var i = this.countUp; i < this.countUp + updateFrequency ; i++) {
 
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



        // if the vector exists, change it
        // otherwise make it

        if(geo.vertices[i]){
            geo.vertices[i] = vec;
            geo.verticesNeedUpdate = true;

        }
        else
            geo.vertices.push(vec);

    }

    this.countUp+=updateFrequency;

    if(this.countUp+updateFrequency>verts)
        this.countUp=0;

    if(extrude){
        var curve = new THREE.SplineCurve3(geo.vertices);
        var p = new THREE.TubeGeometry(curve,geo.vertices.length,tubeRadius);
        return p;
    }
    else{
        return geo;
    }
}

	return makeShape;
});