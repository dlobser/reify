define(function(){



	function saveGCode(arr,scalar,height) {

		//this code is available under a creative commons license
		//David Lobser - info@dlobser.com http://www.dlobser.com
		//http://creativecommons.org/licenses/by-sa/4.0/

		var layerHeight = height || 0.27;

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

		var output = ";FLAVOR:UltiGCode\n;TIME:1081      \n;MATERIAL:1177      \n;MATERIAL2:0         \n\n;Layer count: 170\n;LAYER:0\nM107\nG1 F1200 X20.360 Y20.859 Z0.300 E-2.0\n;TYPE:WALL-OUTER\n";

		console.log(MinX);
		console.log(MinY);
		console.log(minZ);

		// if(spiralDiameter<0)
		//     spiralDiameter = minX*-2;

		var E = 2.0;

		for(var i = 0 ; i < arr.length ; i++){

			for(j = 0 ; j < arr[i].length ; j++){

				 var vec = arr[i][j];

				 var extract = false;

				if(typeof vec.e !== 'undefined'){
					if(vec.e==1)
						extract = true;
				}

				var zed =  arr[i][j].z * scalar;
				if(zed<0)
					zed=0;
				zed+=layerHeight;

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
					eValue = .4 * dist * layerHeight;

				}

				E+=eValue;

				// var x = arr[i][j].x - MinX*scalar;
				// var y = arr[i][j].y - MinY*scalar;

				// x*=scalar;
				// y*=scalar;

				X+=110;
				Y+=110;

				if(extract){
					output+="G0 F9000 X" + X;
					output+=" Y"  + Y;
					output+=" Z"  + zed;
					output+='\n';

				}
				else{  
					output+="G1 X" + X;
					output+=" Y"  + Y;
					output+=" Z"  + zed;
					output+=" E"  + E;
					output+='\n';
				}
			}	
			  
		}
		console.log("saved");
		var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
		saveAs(blob, name);
	}

	function saveGCodeUltimaker(arr,scalar,height) {

		//this code is available under a creative commons license
		//David Lobser - info@dlobser.com http://www.dlobser.com
		//http://creativecommons.org/licenses/by-sa/4.0/

		var layerHeight = height || .27;

		var output = ";FLAVOR:UltiGCode\n;TIME:1081      \n;MATERIAL:1177      \n;MATERIAL2:0         \n\n;Layer count: 170\n;LAYER:0\nM107\nG1 F1200 X20.360 Y20.859 Z0.300 E-2.0\n;TYPE:WALL-OUTER\n";

		var E = 2.0;

		console.log(arr);

		for(var i = 0 ; i < arr.length ; i++){

			for(j = 0 ; j < arr[i].length ; j++){

				var vec = arr[i][j];

				var eValue = 0;

				if(j>0){

					var dist = arr[i][j-1].distanceTo(arr[i][j]);
					eValue = .4 * dist * layerHeight;

				}

				E+=eValue;

				var X = arr[i][j].x + 110;
				var Y = arr[i][j].y + 110;
				var Z = arr[i][j].z + layerHeight;

				output+="G1 X" + X;
				output+=" Y"  +  Y;
				output+=" Z"  +  Z;
				output+=" E"  + E;
				output+='\n';
				
			}	
			  
		}
		console.log("saved");
		var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
		saveAs(blob, name);
	}

	function saveGCodeMakerbot(arr,name) {

		//this code is available under a creative commons license
		//David Lobser - info@dlobser.com http://www.dlobser.com
		//http://creativecommons.org/licenses/by-sa/4.0/

		var scalar = 1;

		var minX = 1e6;
		var minY = 1e6;
		var minZ = 1e6;

		var maxX=maxY=maxZ=-1e6;

		var X = Y = 0;

		for(var i = 0 ; i < arr.length ; i++){
			for(j = 0 ; j < arr[i].length ; j++){
				if(minX>arr[i][j].x)
					minX = arr[i][j].x;
				if(minY>arr[i][j].y)
					minY = arr[i][j].y;
				// if(minZ>arr[i][j].z)
				// 	minZ = arr[i][j].z;
				if(maxX<arr[i][j].x)
					maxX = arr[i][j].x;
				if(maxY<arr[i][j].y)
					maxY = arr[i][j].y;
				// if(maxZ<arr[i][j].z)
				// 	maxZ = arr[i][j].z;
			}
		}

		var aX = minX+((maxX-minX)/2);
		var aY = minY+((maxY-minY)/2);
		// var aZ = minZ+((maxZ-minZ)/2);

		console.log(minX,maxX,minY,maxY,aX,aY);

		var output = " \nM73 P0 (enable build progress)\nG21 (set units to mm)\nG90 (set positioning to absolute)\nG10 P1 X-16.5 Y0 Z0 (Designate T0 Offset)\nG55 (Recall offset cooridinate system)\n(**** begin homing ****)\nG162 X Y F00 (home XY axes maximum)\nG161 Z F1100 (home Z axis minimum)\nG92 Z-5 (set Z to -5)\nG1 Z0.0 (move Z to ÔøΩ0?)\nG161 Z F100 (home Z axis minimum)\nM132 X Y Z A B (Recall stored home offsets for XYZAB axis)\n(**** end homing ****)\nG1 X112 Y-73 Z155 F3300.0 (move to waiting position)\nG130 X0 Y0 A0 B0 (Lower stepper Vrefs while heating)\nM6 T0 (wait for toolhead, and HBP to reach temperature)\nM104 S230 T0 (set extruder temperature)\nM6 T0 (wait for toolhead, and HBP to reach temperature)\nG130 X127 Y127 A127 B127 (Set Stepper motor Vref to defaults)\nM108 R3.0 T0\nG0 X112 Y-73 (Position Nozzle)\nG0 Z0.2 (Position Height)\nM108 R4.0 (Set Extruder Speed)\nM101 (Start Extruder)\nG4 P1500 (Create Anchor)\n";

		for(var i = 0 ; i < arr.length ; i++){

			for(j = 0 ; j < arr[i].length ; j++){

				var zed =  arr[i][j].z * scalar;
				if(zed<0)
					zed=0;
				zed+=.3;

				X = arr[i][j].x * scalar;
				Y = arr[i][j].y * scalar;

				X-=aX;
				Y-=aY;
					
				output+="G1 X" + X;
				output+=" Y"  + Y;
				output+=" Z"  + zed;
				output+=" F2000";
				output+='\n';
			   
			}
			  
		}

		output+="G1 X" + X;
		output+=" Y"  + Y;
		output+=" Z"  + zed + 15;
		output+=" F2000";
		output+='\n';

		console.log("saved " + name);
		var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
		saveAs(blob, name);

	}

	// function saveImg(r,name) {

	// 	var ctx = r.domElement;

	// 	// ct = ctx;
		
	// 	var imgAsDataURL = ctx.toDataURL("image/png");

	// 	console.log(imgAsDataURL);

	// 	 // var blob = new Blob(["howdy"], {type: "text/plain;charset=ANSI"});
	// 	 // debugger;
	// 	ctx.toBlob(function(blob) {
	// 		saveAs(blob, name);
	// 	});
	// }

	var saveAs = saveAs
	  || (navigator.msSaveBlob && navigator.msSaveBlob.bind(navigator))
	  || (function(view) {
		"use strict";
		var
			  doc = view.document
			  // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
			, get_URL = function() {
				return view.URL || view.webkitURL || view;
			}
			, URL = view.URL || view.webkitURL || view
			, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
			, can_use_save_link = "download" in save_link
			, click = function(node) {
				var event = doc.createEvent("MouseEvents");
				event.initMouseEvent(
					"click", true, false, view, 0, 0, 0, 0, 0
					, false, false, false, false, 0, null
				);
				return node.dispatchEvent(event); // false if event was cancelled
			}
			, webkit_req_fs = view.webkitRequestFileSystem
			, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
			, throw_outside = function (ex) {
				(view.setImmediate || view.setTimeout)(function() {
					throw ex;
				}, 0);
			}
			, force_saveable_type = "application/octet-stream"
			, fs_min_size = 0
			, deletion_queue = []
			, process_deletion_queue = function() {
				var i = deletion_queue.length;
				while (i--) {
					var file = deletion_queue[i];
					if (typeof file === "string") { // file is an object URL
						URL.revokeObjectURL(file);
					} else { // file is a File
						file.remove();
					}
				}
				deletion_queue.length = 0; // clear queue
			}
			, dispatch = function(filesaver, event_types, event) {
				event_types = [].concat(event_types);
				var i = event_types.length;
				while (i--) {
					var listener = filesaver["on" + event_types[i]];
					if (typeof listener === "function") {
						try {
							listener.call(filesaver, event || filesaver);
						} catch (ex) {
							throw_outside(ex);
						}
					}
				}
			}
			, FileSaver = function(blob, name) {
				// First try a.download, then web filesystem, then object URLs
				var
					  filesaver = this
					, type = blob.type
					, blob_changed = false
					, object_url
					, target_view
					, get_object_url = function() {
						var object_url = get_URL().createObjectURL(blob);
						deletion_queue.push(object_url);
						return object_url;
					}
					, dispatch_all = function() {
						dispatch(filesaver, "writestart progress write writeend".split(" "));
					}
					// on any filesys errors revert to saving with object URLs
					, fs_error = function() {
						// don't create more object URLs than needed
						if (blob_changed || !object_url) {
							object_url = get_object_url(blob);
						}
						if (target_view) {
							target_view.location.href = object_url;
						}
						filesaver.readyState = filesaver.DONE;
						dispatch_all();
					}
					, abortable = function(func) {
						return function() {
							if (filesaver.readyState !== filesaver.DONE) {
								return func.apply(this, arguments);
							}
						};
					}
					, create_if_not_found = {create: true, exclusive: false}
					, slice
				;
				filesaver.readyState = filesaver.INIT;
				if (!name) {
					name = "download";
				}
				if (can_use_save_link) {
					object_url = get_object_url(blob);
					save_link.href = object_url;
					save_link.download = name;
					if (click(save_link)) {
						filesaver.readyState = filesaver.DONE;
						dispatch_all();
						return;
					}
				}
				// Object and web filesystem URLs have a problem saving in Google Chrome when
				// viewed in a tab, so I force save with application/octet-stream
				// http://code.google.com/p/chromium/issues/detail?id=91158
				if (view.chrome && type && type !== force_saveable_type) {
					slice = blob.slice || blob.webkitSlice;
					blob = slice.call(blob, 0, blob.size, force_saveable_type);
					blob_changed = true;
				}
				// Since I can't be sure that the guessed media type will trigger a download
				// in WebKit, I append .download to the filename.
				// https://bugs.webkit.org/show_bug.cgi?id=65440
				if (webkit_req_fs && name !== "download") {
					name += ".download";
				}
				if (type === force_saveable_type || webkit_req_fs) {
					target_view = view;
				} else {
					target_view = view.open();
				}
				if (!req_fs) {
					fs_error();
					return;
				}
				fs_min_size += blob.size;
				req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
					fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
						var save = function() {
							dir.getFile(name, create_if_not_found, abortable(function(file) {
								file.createWriter(abortable(function(writer) {
									writer.onwriteend = function(event) {
										target_view.location.href = file.toURL();
										deletion_queue.push(file);
										filesaver.readyState = filesaver.DONE;
										dispatch(filesaver, "writeend", event);
									};
									writer.onerror = function() {
										var error = writer.error;
										if (error.code !== error.ABORT_ERR) {
											fs_error();
										}
									};
									"writestart progress write abort".split(" ").forEach(function(event) {
										writer["on" + event] = filesaver["on" + event];
									});
									writer.write(blob);
									filesaver.abort = function() {
										writer.abort();
										filesaver.readyState = filesaver.DONE;
									};
									filesaver.readyState = filesaver.WRITING;
								}), fs_error);
							}), fs_error);
						};
						dir.getFile(name, {create: false}, abortable(function(file) {
							// delete file if it already exists
							file.remove();
							save();
						}), abortable(function(ex) {
							if (ex.code === ex.NOT_FOUND_ERR) {
								save();
							} else {
								fs_error();
							}
						}));
					}), fs_error);
				}), fs_error);
			}
			, FS_proto = FileSaver.prototype
			, saveAs = function(blob, name) {
				return new FileSaver(blob, name);
			}
		;
		FS_proto.abort = function() {
			var filesaver = this;
			filesaver.readyState = filesaver.DONE;
			dispatch(filesaver, "abort");
		};
		FS_proto.readyState = FS_proto.INIT = 0;
		FS_proto.WRITING = 1;
		FS_proto.DONE = 2;
		
		FS_proto.error =
		FS_proto.onwritestart =
		FS_proto.onprogress =
		FS_proto.onwrite =
		FS_proto.onabort =
		FS_proto.onerror =
		FS_proto.onwriteend =
			null;
		
		view.addEventListener("unload", process_deletion_queue, false);
		return saveAs;
	}(self));

	saveGeoToObj = function (geo,nums,scalar) {

		geo.updateMatrixWorld();

		var num = parseInt(nums);

		var s = '';
		for (i = 0; i < geo.geometry.vertices.length; i++) {

			var vector = new THREE.Vector3( geo.geometry.vertices[i].x, geo.geometry.vertices[i].y, geo.geometry.vertices[i].z );
			
			geo.matrixWorld.multiplyVector3( vector );
			vector.multiplyScalar(scalar);
			//vector.applyProjection( matrix )
			
			s+= 'v '+(vector.x) + ' ' +
			vector.y + ' '+
			vector.z + '\n';
		}

		for (i = 0; i < geo.geometry.faces.length; i++) {

			s+= 'f '+ (geo.geometry.faces[i].a+1+num) + ' ' +
			(geo.geometry.faces[i].b+1+num) + ' '+
			(geo.geometry.faces[i].c+1+num);

			if (geo.geometry.faces[i].d!==undefined) {
				s+= ' '+ (geo.geometry.faces[i].d+1+num);
			}
			s+= '\n';
		}

		return s;
	};


	saver = function(scene) {

		//this code is available under a creative commons license
		//David Lobser - info@dlobser.com http://www.dlobser.com
		//http://creativecommons.org/licenses/by-sa/4.0/

		var scaleOut = 1;//outputScale || 1;

		var name = name || "tree.obj";

		var mshArray = [];

		var returnerArray = [];

		scene.traverse(function(obj){
			if(obj.geometry){
				obj.updateMatrixWorld();
				if(obj.geometry.vertices.length>0){
					returnerArray.push(obj);
				}
			}
		});

		mshArray = returnerArray;

		// alert("saving!");
		var j = 0;
		var output = "";
		console.log(mshArray);
		
		for (var i = 0 ; i < mshArray.length ; i++){
			
			// if(i == mshArray.length-2 || i == mshArray.length-3) i++;
			// else{
				output += saveGeoToObj(mshArray[i],j,(1*scaleOut));
				j += mshArray[i].geometry.vertices.length;
			// }
		}
		
		output.replace("undefined","");
		// document.write(output);
		console.log(output);
		alert("saved!");
		var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
		saveAs(blob, name);
	};

	return {
		saveAs : saveAs,
		saver : saver,
		saveGeoToObj : saveGeoToObj,
		saveGCode : saveGCode,
		saveGCodeMakerbot : saveGCodeMakerbot,
		saveGCodeUltimaker : saveGCodeUltimaker,
		// saveImg : saveImg
	};
});
