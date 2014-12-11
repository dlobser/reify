define(["THREE"],function(THREE){

	var linearCurve = function(vecs,closed){
			
			//points to return
			this.points = [];

			var close = closed ? true:false;

			//one dimensional array of vectors
			this.vecs = cloneArray(vecs) || [];

			if(close)
				this.vecs.push(this.vecs[0].clone());

			//total length
			this.lineLength = 0;
			
			for(var i = 0 ; i < this.vecs.length ; i++){
				if(i>0){
					this.vecs[i-1].dist = this.vecs[i-1].distanceTo(this.vecs[i]);
				}
			}
			
			this.getLength = function(){
				for(var i = 0 ; i < this.vecs.length-1 ; i++){
				   this.lineLength+=this.vecs[i].dist;
				}
				return this.lineLength;
			};
			
			this.lineLength = this.getLength();

			this.getSpacedPoints = function(amt){

				this.points = [];

				var len = this.lineLength;
						
				for(var i = 0 ; i < this.vecs.length-1 ; i++){
					for(var j = 0 ; j < (this.vecs[i].dist/len)*amt ; j++){
						var v = this.vecs[i].clone();
						v.lerp(this.vecs[i+1],j/((this.vecs[i].dist/len)*amt));
						this.points.push(v);
					}
				}
				return this.points;
			};
			
			this.getEvenPoints = function(amt){

				this.points = [];
				
				var len = this.lineLength;
				
				console.log(this.vecs[0].dist/len);
				
				for(var i = 0 ; i < this.vecs.length-1 ; i++){
					for(var j = 0 ; j < amt ; j++){
						var v = this.vecs[i].clone();
						v.lerp(this.vecs[i+1],j/amt);
						this.points.push(v);
					}
				}
				return this.points;
			};
			
			//points are spaced evenly across the entire curve
			this.getPointAt = function(t){

				if(t>1)
					t=1;
				if(t<0)
					t=0;

				var total = 0;
				for(var i = 0 ; i < this.vecs.length-1 ;){
					if(total+this.vecs[i].dist<t*this.lineLength){ total+=this.vecs[i].dist;i++;}
					else{
						thisT2 = THREE.Math.mapLinear(t*this.lineLength,total,total+this.vecs[i].dist,0,1);
						var v = this.vecs[i].clone();
						v.lerp(this.vecs[i+1],thisT2);
						v.cPos = total+(thisT2*vecs[i].dist);
						return v;
					   
					}
				}
			};

			//points are spaced equally between vertices
			this.getEvenPointAt = function(t){

				if(t>1)
					t=1;
				if(t<0)
					t=0;

				var t2=t*(this.vecs.length-1);
				
				var total = 0;
				for(var i = 1 ; i < this.vecs.length ;){
					if(total+1<t2){total+=1;i++;}
					else{
						thisT2 = THREE.Math.mapLinear(t2,total,total+1,0,1);
						var v = this.vecs[i-1].clone();
						v.lerp(this.vecs[i],thisT2);
						v.cPos = total+thisT2;
						return v;
					   
					}
				}
				
			};
		};

	var cloneArray = function(arr){
		var r = [];

		for(var i = 0 ; i < arr.length ; i++){
			r.push(arr[i]);
		}

		return r;
	}


	return {

		linearCurve:linearCurve,

		lerp:function(a,b,t){
			return a + ((b-a)*t);
		},

	    arrayToVecs:function(arr){

	    	var r = [];

	    	for(var i = 0 ; i < arr.length ; i++){
	    		r.push(new THREE.Vector3(i,arr[i],0));
	    	}
	        
	        return r;
	    },

	    JSONSongToCurves:function(obj){
	    	this.songCurves = [];
	    },

		Wave:function(){

			this.cosPoints = [
				new THREE.Vector3(0,-1,0),
				new THREE.Vector3(Math.PI,1,0),
				new THREE.Vector3(Math.PI*2,-1,0),
			];
			this.sinPoints = [
				new THREE.Vector3(0,0,0),
				new THREE.Vector3(Math.PI/2,1,0),
				new THREE.Vector3(Math.PI,0,0),
				new THREE.Vector3((3/2)*Math.PI,-1,0),
				new THREE.Vector3(Math.PI*2,0,0),
			];
			this.squarePoints = [
				new THREE.Vector3(0,-1,0),
				new THREE.Vector3(0,1,0),
				new THREE.Vector3(Math.PI,1,0),
				new THREE.Vector3(Math.PI,-1,0),
				new THREE.Vector3(Math.PI*2,-1,0),
			];

			this.cosCurve = new linearCurve(this.cosPoints);
			this.sinCurve = new linearCurve(this.sinPoints);
			this.squareCurve = new linearCurve(this.squarePoints);

			this.TriCos = function(t){

				return this.cosCurve.getPointAt((t%(Math.PI*2))/(Math.PI*2)).y;

			};

			this.TriSin = function(t){

				return this.sinCurve.getPointAt((t%(Math.PI*2))/(Math.PI*2)).y;

			};

			this.Square = function(t){

				return this.squareCurve.getPointAt((t%(Math.PI*2))/(Math.PI*2)).y;

			}
		},

		extend:function(child, parent){
			function TmpConst(){}
			TmpConst.prototype = parent.prototype;
			child.prototype = new TmpConst();
			child.prototype.constructor = child;
		},

		arraysEqual:function(a, b) {
			if (a === b) return true;
			if (a == null || b == null) return false;
			if (a.length != b.length) return false;
			for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
			}
			return true;
		},

		map:THREE.Math.mapLinear,

		remap:function(val){
			return (val*2)-1;//THREE.Math.mapLinear(val,-1,1,0,1);
		},

		makeNurbs:function(points,det,returnGeom,spaced){

			var extrude = extrude || false;
			var detail = det || 100;
			var returnGeo = returnGeom ? true : false;
			var sp = spaced ? true : false;

			var vertices = [];
			var nurbsCurve = [];

			// var points = [];
			console.log(sp);

			for(var k = 0 ; k < points.length; k++){

				if(points[k].length>3){

					var nurbsControlPoints = [];
					var nurbsKnots = [];
					var nurbsDegree = 3;

					for ( var i = 0; i <= nurbsDegree; i ++ ) {
						nurbsKnots.push( 0 );
					}


					for ( var i = 0, j = points[k].length; i < j ; i ++ ) {
						var vec = new THREE.Vector4(
								points[k][i].x,
								points[k][i].y,
								points[k][i].z,
								1 // weight of control point: higher means stronger attraction
							);

						// if(extrude)
						//     vec.z+=this.off;

						nurbsControlPoints.push(vec);

						var knot = ( i + 1 ) / ( j - nurbsDegree );
						nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );

					}

					nurbsCurve = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);
					if(sp)
						vertices = nurbsCurve.getSpacedPoints(detail);
					else
						vertices = nurbsCurve.getPoints(detail);

				}
			}

			// console.log(nurbsCurve);

			if(returnGeo)
				return vertices;
			else
				return nurbsCurve;
		},

		saveGCode:function(arr,scalar) {

			var minX = 0;
			var minY = 0;
			var minZ = 0;

			console.log(arr);

			for(var i = 0 ; i < arr.length ; i++){
				for(j = 0 ; j < arr[i].length ; j++){
					if(minX>arr[i][j].x)
						minX = arr[i][j].x;
					if(minY>arr[i][j].y)
						minY = arr[i][j].y;
					if(minZ>arr[i][j].z)
						minZ = arr[i][j].z;
				}
			}

			MinX = minX;
			MinY = minY;


			MinX*=scalar;
			MinY*=scalar;

			// var output = " \nM73 P0 (enable build progress)\nG21 (set units to mm)\nG90 (set positioning to absolute)\nG10 P1 X-16.5 Y0 Z0 (Designate T0 Offset)\nG55 (Recall offset cooridinate system)\n(**** begin homing ****)\nG162 X Y F2500 (home XY axes maximum)\nG161 Z F1100 (home Z axis minimum)\nG92 Z-5 (set Z to -5)\nG1 Z0.0 (move Z to ÔøΩ0?)\nG161 Z F100 (home Z axis minimum)\nM132 X Y Z A B (Recall stored home offsets for XYZAB axis)\n(**** end homing ****)\nG1 X112 Y-73 Z155 F3300.0 (move to waiting position)\nG130 X0 Y0 A0 B0 (Lower stepper Vrefs while heating)\nM6 T0 (wait for toolhead, and HBP to reach temperature)\nM104 S230 T0 (set extruder temperature)\nM6 T0 (wait for toolhead, and HBP to reach temperature)\nG130 X127 Y127 A127 B127 (Set Stepper motor Vref to defaults)\nM108 R3.0 T0\nG0 X112 Y-73 (Position Nozzle)\nG0 Z0.2 (Position Height)\nM108 R4.0 (Set Extruder Speed)\nM101 (Start Extruder)\nG4 P1500 (Create Anchor)\n";

			var output = ";FLAVOR:UltiGCode\n;TIME:1081      \n;MATERIAL:1177      \n;MATERIAL2:0         \n\n;Layer count: 170\n;LAYER:0\nM107\nG1 F5000 X20.360 Y20.859 Z0.300 E-2.0\n;TYPE:WALL-OUTER\n";

			console.log(MinX);
			console.log(MinY);
			console.log(minZ);

			// if(spiralDiameter<0)
			//     spiralDiameter = minX*-2;

			var E = 2.0;

			for(var i = 0 ; i < arr.length ; i++){

				for(j = 0 ; j < arr[i].length ; j++){

					var zed =  arr[i][j].z * scalar;
					if(zed<0)
						zed=0;
					zed+=.3;

					var X = arr[i][j].x * scalar;
					var Y = arr[i][j].y * scalar;


					// X-=MinX;
					// Y-=MinY;
					

					// var off = 110+MinX;//getOffset();
					var eValue = 0;

					var squirt = 1;

					if(arr[i][j].z<1){
						squirt=THREE.Math.mapLinear(arr[i][j].z,0,1,.6,1);
					}

					squirt=1;

					if(j>0){

						var pX = arr[i][j-1].x * scalar;
						var pY = arr[i][j-1].y * scalar;

						// pX-=MinX;
						// pY-=MinY;


						var one = X - pX;
						var two = Y - pY;
						var dist = Math.sqrt(one*one + two*two);
						eValue = .4 * dist * .27;

					}

					E+=eValue;

					// var x = arr[i][j].x - MinX*scalar;
					// var y = arr[i][j].y - MinY*scalar;

					// x*=scalar;
					// y*=scalar;

					X+=110;
					Y+=110;
						
					output+="G1 X" + X;
					output+=" Y"  + Y;
					output+=" Z"  + zed;
					output+=" E"  + E;
					output+='\n';

				   
				}
				  
			}
			console.log("saved");
			var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
			saveAs(blob, name);
		},

		saveGCodeMakerbot:function(arr,scalar) {

			// var minX = 0;
			// var minY = 0;
			// var minZ = 0;

			// console.log(arr);

			// for(var i = 0 ; i < arr.length ; i++){
			//     for(j = 0 ; j < arr[i].length ; j++){
			//         if(minX>arr[i][j].x)
			//             minX = arr[i][j].x;
			//         if(minY>arr[i][j].y)
			//             minY = arr[i][j].y;
			//         if(minZ>arr[i][j].z)
			//             minZ = arr[i][j].z;
			//     }
			// }

			// MinX = minX;
			// MinY = minY;

			var output = " \nM73 P0 (enable build progress)\nG21 (set units to mm)\nG90 (set positioning to absolute)\nG10 P1 X-16.5 Y0 Z0 (Designate T0 Offset)\nG55 (Recall offset cooridinate system)\n(**** begin homing ****)\nG162 X Y F2500 (home XY axes maximum)\nG161 Z F1100 (home Z axis minimum)\nG92 Z-5 (set Z to -5)\nG1 Z0.0 (move Z to ÔøΩ0?)\nG161 Z F100 (home Z axis minimum)\nM132 X Y Z A B (Recall stored home offsets for XYZAB axis)\n(**** end homing ****)\nG1 X112 Y-73 Z155 F3300.0 (move to waiting position)\nG130 X0 Y0 A0 B0 (Lower stepper Vrefs while heating)\nM6 T0 (wait for toolhead, and HBP to reach temperature)\nM104 S230 T0 (set extruder temperature)\nM6 T0 (wait for toolhead, and HBP to reach temperature)\nG130 X127 Y127 A127 B127 (Set Stepper motor Vref to defaults)\nM108 R3.0 T0\nG0 X112 Y-73 (Position Nozzle)\nG0 Z0.2 (Position Height)\nM108 R4.0 (Set Extruder Speed)\nM101 (Start Extruder)\nG4 P1500 (Create Anchor)\n";

			// var output = ";FLAVOR:UltiGCode\n;TIME:1081      \n;MATERIAL:1177      \n;MATERIAL2:0         \n\n;Layer count: 170\n;LAYER:0\nM107\nG1 F9000 X20.360 Y20.859 Z0.300 E-2.0\n;TYPE:WALL-OUTER\n";

			// console.log(MinX);
			// console.log(MinY);
			// console.log(minZ);

			// if(spiralDiameter<0)
			//     spiralDiameter = minX*-2;

			// var E = 2.0;

			for(var i = 0 ; i < arr.length ; i++){

				for(j = 0 ; j < arr[i].length ; j++){

					var zed =  arr[i][j].z * scalar;
					if(zed<0)
						zed=0;
					zed+=.3;

					var X = arr[i][j].x * scalar;
					var Y = arr[i][j].y * scalar;
					

					// var off = 110+MinX;//getOffset();
					// var eValue = 0;

					// var squirt = 1;

					// if(arr[i][j].z<1){
					//     squirt=THREE.Math.mapLinear(arr[i][j].z,0,1,.6,1);
					// }

					// squirt=1;

					// if(j>0){

					//     var pX = arr[i][j-1].x * scalar;
					//     var pY = arr[i][j-1].y * scalar;

					//     var one = X - pX;
					//     var two = Y - pY;
					//     var dist = Math.sqrt(one*one + two*two);
					//     eValue = .4 * dist * .27;

					// }

					// E+=eValue;

					// var x = arr[i][j].x;
					// var y = arr[i][j].y;

					// x*=scalar;
					// y*=scalar;

					// x+=110;
					// y+=110;
						
					output+="G1 X" + X;
					output+=" Y"  + Y;
					output+=" Z"  + zed;
					output+=" F2000";
					output+='\n';

				   
				}
				  
			}
			console.log("saved");
			var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
			saveAs(blob, name);
		},

		makeFrame:function(size){

			var center = new THREE.Object3D();
			var line = new THREE.Mesh(new THREE.CylinderGeometry( 1,1),new THREE.MeshLambertMaterial(  ));
			line.position.x = -size;
			line.scale.y = 100;
			center.add(line);
			var c1 = center.clone();
			c1.rotation.z=pi;
			scene.add(c1);
			var c2 = center.clone();
			c2.rotation.z=pi*2;
			scene.add(c2);
			var c3 = center.clone();
			c3.rotation.z=pi*3;
			scene.add(c3);
			scene.add(center);
		},

		purgeObject:function(o){

			if(o.parent)
				o.parent.remove(o);

			o.traverse(function(obj){
				if(obj instanceof THREE.Line || obj instanceof THREE.Mesh){
					obj.geometry.dispose();
					obj.material.dispose();
					// obj.geometry.vertices = [];
				}
				});
			o = null;
		},

		compareObj:function(a,b){

			var returner = true;

			for(var k in a){
				if(b[k]!=a[k])
					returner = false;
			}

			return returner;
		},

		duplicateObject:function(a){

			var b = {};

			for(var k in a){
				b[k] = a[k];
			}

			return b;
		},
		
		isUndef : function(thing){
			return thing === void 0;
		}
	};
});
