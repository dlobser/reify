define(["THREE", "ModelGenerator/PerlinNoise", "ModelGenerator/Presets"], function(THREE, noise, presets){
	
	var pi = Math.PI/2;

	function setData(arr,objects) {
		var newData = [];
		var dataPoint = {};
		for(var i in objects){
			
			for (var k in objects[i]) {
				if (objects[i].hasOwnProperty(k)) {
					if(dataPoint[k]===undefined){
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

	function vecs(x,y,z){
		return new THREE.Vector3(x,y,z);
	}

	function makeShape(x,y,args){

		if(!args) args = {};
		var verts = args.res || 5000;
		var tubeRadius = args.tubeRadius || 0.3;

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
		};

		var root = new THREE.Matrix4();
		var mats = [];
		var mats1 = [];
		var mats2 = [];

		for (var i = 0; i < 5; i++) {
			var m = new THREE.Matrix4();
			m.setPosition(new THREE.Vector3(0,5,0));
			mats1.push(m);
		}
		
		for (var j = 0; j < 5; j++) {
			var m4 = new THREE.Matrix4();
			mats2.push(m4);
		}

		mats = mats1.concat(mats2);

		var geo = new THREE.Geometry();

		var scalar = 5/verts;

		var arr = wAverage(x,y);

		var newData = setData(arr,presets);
		var tData = updateData(newData,oData);

		for (var i = 0; i < verts; i++) {

			root.identity();
			//overall rotation
			mats1[0].makeRotationZ(.001*i*pi*4);
			//Z offset controls
			mats1[1].setPosition(vecs(0,0,
				(i * 0.001 * tData.zWaveMult1) *
				tData.zWaveMult2 *
				Math.sin(tData.zWaveFreq*i*0.051*pi*4)+0.27*i*scalar*10)
			);

			//spread out/scale up
			mats1[4].setPosition(vecs(0,i*tData.spread*0.001,0));
			//petals control
			mats2[2].setPosition(vecs(0,Math.sin(i*0.001*pi*4*Math.floor(tData.petals*30))*tData.petalAmount*(i*scalar),0));
			//loop petals
			mats2[0].makeRotationZ(i*tData.petalLoop*0.0001);

			//noise position offset
			mats2[3].setPosition(vecs(
					noise(tData.noiseOffset+2+(Math.sin(0.001*i*pi*4) * tData.noiseDetail * 30)/2)*tData.noiseAmount*10*(i*scalar)*tData.noiseOffset,
					noise(tData.noiseOffset+1+(Math.cos(0.001*i*pi*4) * tData.noiseDetail * 30)/2)*tData.noiseAmount*10*(i*scalar),
					0
				));

			//noise loop
			mats2[1].makeRotationZ(noise(tData.noiseOffset+1+(Math.sin(0.001*i*pi*4)*tData.noiseDetail*10)/2)*tData.noiseLoops*200);

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
		}

		var pl = [];
		pl.push(geo.vertices);
		var curve = new THREE.SplineCurve3(pl[0]);
		var p= new THREE.Mesh(new THREE.TubeGeometry(curve,pl[0].length,tubeRadius),new THREE.MeshLambertMaterial());

		return p;

	}

	return makeShape;
});