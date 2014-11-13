

sc1 = {
    
   setup:function(){

        frameRate = 1;

        f = sphere(.5);
        // scene.add(f);

        sph = sphere(.1);
        // scene.add(sph);
        codeName= "mats";

        rebuildGui({values:{customVal1:0,customVal2:0},sliders:15});  

        root = new THREE.Matrix4();
        mats = [];
        mats1 = [];
        mats2 = [];

        for (var i = 0; i < 5; i++) {
            m = new THREE.Matrix4();
            m.setPosition(new THREE.Vector3(0,5,0))
            mats1.push(m);
        };
        for (var i = 0; i < 5; i++) {
            m = new THREE.Matrix4();
            mats2.push(m);
        };
        mats = mats1.concat(mats2);

        spheres = [];

        for (var i = 0; i < mats.length; i++) {
            spheres[i] = new sphere(.1);
            spheres[i].matrixAutoUpdate = false;
            // scene.add(spheres[i]);
        };

        // frameRate = 1000/1000;

        var geo = new THREE.Geometry();
        for (var i = 0; i < 1000; i++) {
            geo.vertices.push(new THREE.Vector3(.5-Math.random()*100,.5-Math.random()*100,0));
        }

        // pMaterial = new THREE.ParticleBasicMaterial({
        //   color: 0xFFFFFF,
        //   size: 3,
        //   map: THREE.ImageUtils.loadTexture(
        //     "assets/textures/particle.png"
        //   ),
        //   blending: THREE.AdditiveBlending,
        //   transparent: true
        // });
        var lnMat = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, color:0x777777} )
        msh = new THREE.Line(geo,lnMat);
        console.log(msh);
        // msh = new THREE.ParticleSystem( geo, pMaterial);
        verts = 50000;

        scene.add(msh);
        for (var i = 0; i < verts; i++) {
            geo.vertices[i] = (new THREE.Vector3((.5-Math.random())*10,(.5-Math.random())*10,(.5-Math.random())*10));
            geo.colors.push( new THREE.Color(Math.sin(i*.1)+1,Math.sin(i*.051)+1,Math.sin(i*.03)+1 ));
            geo.verticesNeedUpdate = true;
        }
        rebuildGui({values:{
            nothing:0.0,
            spread:0.0,
            petals:0.0,
            petalAmount:0.0,
            petalLoop:0.0,
            noiseAmount:0.0,
            noiseDetail:0.0,
            noiseLoops:0.0,
            noiseOffset:0.0,
            noiseSymmetry:0.0,
            zWaveFreq:0.0,
            zWaveMult1:0.0,
            zWaveMult2:0.0,
            loopDetail:0.0,
            highNoisehighPetal:-1.0,
        },sliders:1});  

        q=0;

       
   },
   
   draw:function(){

        var scalar = 5/verts;

        // var arr = wAverage(mouseX,mouseY);

        // newData = setData(arr,objs);
        // updateData();

        if(data.highNoisehighPetal>0)
            data.zWaveFreq = THREE.Math.mapLinear(data.highNoisehighPetal,0,1,.5,1);

        for (var i = q; i < q+1000; i++) {

            root.identity();
            //overall rotation
            mats1[0].makeRotationZ(.001*i*pi*4);
            //Z offset controls
            mats1[1].setPosition(vec(0,0,(i*.001*data.zWaveMult1)*data.zWaveMult2*Math.sin(data.zWaveFreq*i*.051*pi*4)+.27*i*scalar*10));
            //spread out/scale up
            mats1[4].setPosition(new THREE.Vector3(0,i*data.spread*.001,0));
            //petals control
            mats2[2].setPosition(new THREE.Vector3(0,Math.sin(i*.001*pi*4*Math.floor(data.petals*30))*data.petalAmount*(i*scalar),0));
            //loop petals
            mats2[0].makeRotationZ(i*data.petalLoop*.0001);
            //noise position offset
            mats2[3].setPosition(new THREE.Vector3(
                    noise(data.noiseOffset+2+(Math.sin(.001*i*pi*4)*data.noiseDetail*30)/2)*data.noiseAmount*10*(i*scalar)*data.noiseOffset,
                    noise(data.noiseOffset+1+(Math.cos(.001*i*pi*4)*data.noiseDetail*30)/2)*data.noiseAmount*10*(i*scalar),
                    0
                ));
            //noise loop
            mats2[1].makeRotationZ(noise(data.noiseOffset+1+(Math.sin(.001*i*pi*4)*data.noiseDetail*10)/2)*data.noiseLoops*200);

            for(var k = 0 ; k < mats.length ; k++){

                root.multiply(mats[k]);
                var tMat = new THREE.Matrix4();
                tMat.identity();
                for(var j = 0 ; j < k ; j++){
                    tMat.multiply(mats[j]);
                }
                spheres[k].matrixWorld = tMat;
            }
           
            sph.matrixWorld = root;
            sph.matrixAutoUpdate = false;

            msh.geometry.vertices[i].setFromMatrixPosition(root);
            msh.geometry.verticesNeedUpdate = true;
        };

        q+=1000;

        if(q>msh.geometry.vertices.length-1000)
            q=0;

        if(varE){
            
            var b = [];
            b.push(msh.geometry.vertices);
            saveGCode(b,"h");
            varE = false;
        }
        if(varW){
            tree = new TREE();
            var pl = [];
            pl.push(msh.geometry.vertices);
            var p = tree.tubes(pl,{width:.5});
            console.log(p);
            scene.add(p);
            varW=false;
        }

        var i = count+49000;

            root.identity();
            //overall rotation
            mats1[0].makeRotationZ(.001*i*pi*4);
            //Z offset controls
            mats1[1].setPosition(vec(0,0,(i*.001*data.zWaveMult1)*data.zWaveMult2*Math.sin(data.zWaveFreq*i*.051*pi*4)+.27*i*.001));
            //spread out/scale up
            mats1[4].setPosition(new THREE.Vector3(0,i*data.spread*.0001,0));
            //petals control
            mats2[2].setPosition(new THREE.Vector3(0,Math.sin(i*.001*pi*4*Math.floor(data.petals*30))*data.petalAmount*(i*.0001),0));
            //loop petals
            mats2[0].makeRotationZ(i*data.petalLoop*.0001);
            //noise position offset
            mats2[3].setPosition(new THREE.Vector3(
                    noise(data.noiseOffset+2+(Math.sin(.001*i*pi*4)*data.noiseDetail*30)/2)*data.noiseAmount*10*(i*.0001),
                    noise(data.noiseOffset+1+(Math.cos(.001*i*pi*4)*data.noiseDetail*30)/2)*data.noiseAmount*10*(i*.0001),
                    0
                ));
            //noise loop
            mats2[1].makeRotationZ(noise(data.noiseOffset+1+(Math.sin(.001*i*pi*4)*data.noiseDetail*10)/2)*data.noiseLoops*200);

            for(var k = 0 ; k < mats.length ; k++){

                root.multiply(mats[k]);
                var tMat = new THREE.Matrix4();
                tMat.identity();
                for(var j = 0 ; j < k ; j++){
                    tMat.multiply(mats[j]);
                }
                spheres[k].matrixWorld = tMat;
            }
           
            sph.matrixWorld = root;
            sph.matrixAutoUpdate = false;    
       
        }
}


function vec(x,y,z){
    return new THREE.Vector3(x,y,z);

}


function saveGCode(arr,name) {


    // var scaleOut = outputScale || 1;

    // var name = name || "tree.obj";

    var minX = 0;
    var minY = 0;
    var minZ = 0;

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

    var output = " \nM73 P0 (enable build progress)\nG21 (set units to mm)\nG90 (set positioning to absolute)\nG10 P1 X-16.5 Y0 Z0 (Designate T0 Offset)\nG55 (Recall offset cooridinate system)\n(**** begin homing ****)\nG162 X Y F2500 (home XY axes maximum)\nG161 Z F1100 (home Z axis minimum)\nG92 Z-5 (set Z to -5)\nG1 Z0.0 (move Z to ÔøΩ0?)\nG161 Z F100 (home Z axis minimum)\nM132 X Y Z A B (Recall stored home offsets for XYZAB axis)\n(**** end homing ****)\nG1 X112 Y-73 Z155 F3300.0 (move to waiting position)\nG130 X0 Y0 A0 B0 (Lower stepper Vrefs while heating)\nM6 T0 (wait for toolhead, and HBP to reach temperature)\nM104 S230 T0 (set extruder temperature)\nM6 T0 (wait for toolhead, and HBP to reach temperature)\nG130 X127 Y127 A127 B127 (Set Stepper motor Vref to defaults)\nM108 R3.0 T0\nG0 X112 Y-73 (Position Nozzle)\nG0 Z0.2 (Position Height)\nM108 R4.0 (Set Extruder Speed)\nM101 (Start Extruder)\nG4 P1500 (Create Anchor)\n";

    var output = ";FLAVOR:UltiGCode\n;TIME:1081      \n;MATERIAL:1177      \n;MATERIAL2:0         \n\n;Layer count: 170\n;LAYER:0\nM107\nG0 F9000 X110.360 Y107.859 Z0.300\n;TYPE:WALL-OUTER\n";

    console.log(MinX);
    console.log(MinY);
    console.log(minZ);

    // if(spiralDiameter<0)
    //     spiralDiameter = minX*-2;

    var E = 2;

    for(var i = 0 ; i < arr.length ; i++){

            // // var offX = arr[i][0].x-MinX;
            // // var offY = arr[i][0].y-MinY;
            //  var offX = (( arr[i][0].x-MinX ) / ( MinX*-2 )) * ( spiralDiameter );
            //  var offY = (( arr[i][0].y-MinY ) / ( MinY*-2 )) * ( spiralDiameter );

            // output+="G1 X"+arr[i][j].x;
            // output+=" Y"  +arr[i][j].y;
            // output+=" Z" + arr[i][j].z;
            // output+=" F5400";
            // output+='\n';

        for(j = 0 ; j < arr[i].length ; j++){

            // var offX = (( arr[i][j].x-MinX ) / ( MinX*-2 )) * ( spiralDiameter );
            // var offY = (( arr[i][j].y-MinY ) / ( MinY*-2 )) * ( spiralDiameter );
            var zed =  arr[i][j].z;
            if(zed<0)
                zed=0;
            zed+=1;

            var off = 110+MinX;//getOffset();

            // console.log(off);
            var eValue = 0;

            var squirt = 1;

            if(arr[i][j].z<1){
                squirt=THREE.Math.mapLinear(arr[i][j].z,0,1,.6,1);
            }

            squirt=1;

            if(j>0){

                var one = arr[i][j].x - arr[i][j-1].x;
                var two = arr[i][j].y - arr[i][j-1].y;
                var dist = Math.sqrt(one*one + two*two);
                eValue = .4 * dist * .27 * squirt * 2;

            }

             E+=eValue;

            var x = off+arr[i][j].x - MinX;
            var y = off+arr[i][j].y - MinY;
                
           output+="G1 X" + x;
            output+=" Y"  + y;
            output+=" Z"  + zed;
            output+=" E"+E;
            output+='\n';

           
        }
            // var end = arr[i].length-1;

            // var offX = (( arr[i][end].x-MinX ) / ( MinX*-2 )) * ( spiralDiameter );
            // var offY = (( arr[i][end].y-MinY ) / ( MinY*-2 )) * ( spiralDiameter );

            // output+="J3,"+offX.toFixed(4);
            // output+=","  +offY.toFixed(4);
            // output+=",.2" ;
            // output+='\n';
    }
    // return output;
    // document.write(output);
    console.log("hio");
    // alert("saved!");
    var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
    saveAs(blob, name);
}
