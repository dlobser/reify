define(["THREE", "ModelGenerator/PerlinNoise", "TREE", "NURBS", "ModelGenerator/Utils"], function(THREE, noise, TREE, NURBS, Utils){

           
    function Flower(params){

        args = params || {};
        this.layerHeight = args.layerHeight || 0.27;
        this.layers = args.layers || 100;
        // this.baseDetail = args.baseDetail || 100;
        this.prnt = args.parent || new THREE.Object3D();
        this.gridDetail = args.gridDetail || 30;
        this.scale = args.scale || 1;
        this.curveDetail = args.curveDetail || 100;
        this.resampleDetail = args.resampleDetail || 100;

        this.balls = args.balls || [];
        this.numBalls = args.balls || 7;

        this.imgData = args.imgData || [];
        this.canvas = args.canvas || null;

        this.canvas.width = this.canvas.height = this.gridDetail;

        this.tumbleData = args.tumbleData ? true : false;

        this.processData = args.data || data;

        //previous data
        this.pUserData = duplicateObject(this.userData);
       

        this.counter = 0;
        this.counterStep = (typeof args.counterStep==='undefined') ? 5 : args.counterStep;

        var spiralize = args.spiralize || true;
        var flowerGeo;


        this.init = function(){


            // scene.add(this.prnt);

            this.cells = new Cells({extrude:true,parent:this.prnt,amount:this.gridDetail});
            this.cells.make();
            // this.cells.makeFaces();
            this.cells.setScale(args.scale);
            // this.prnt.add(this.cells.getParent());
            this.userData = this._setValuesFromData(this.processData) || data;
            this.balls.userData = this.userData;
            this.balls.userData.layers = this.layers;

            // console.log(this.imgData);
            // this.cells.showBoundary();
            if(!args.balls)
                this._makeBalls();
        };

        this._setValuesFromData = function(a){

            if(this.tumbleData){

                var petalsVal1 = THREE.Math.mapLinear(a.petals,0,1,.3,.5);
                var petalsVal2 = THREE.Math.mapLinear(a.petals,0,1,.15,0);
                var petalsVal3 = THREE.Math.mapLinear(a.petals,0,1,.1,0);
                var ropeMap = THREE.Math.mapLinear(a.rope,0,1,.2,0);
                var towerMult = Math.abs(THREE.Math.mapLinear(a.tower,.5,1,0,.5));
                var towerOff = THREE.Math.mapLinear(a.tower,0,1,1,-1);
                var squiggler = THREE.Math.mapLinear(a.squiggle,0,1,0,.0125);
                // var mSprinkle = THREE.Math.mapLinear(a.sprinkles,0,1,0,1);

                return {

                    nothing:0,

                    baseCenterScale:petalsVal1,

                    numBalls:.68,
                    bpSize:petalsVal2*(.5-towerMult),
                    bpLength:petalsVal3,
                    bpNoisePos:a.squares,
                    bpNoiseAnim:a.squares*.3,
                    bpNoiseOffset:.5,//a.tower*towerMult,
                    bpNoiseScale:towerOff*towerMult,
                    bpNSFreq:.1,
                    baseTwist:0,
                    bpScaleUp:towerOff*.3,
                    bpTopScale:0,
                    
                    tpPetals:a.zig*.3,
                    tpMult:ropeMap,
                    tpLoop:THREE.Math.mapLinear(a.KB,0,1,-.1,.1),
                    tpTwist:squiggler,
                    tpNoiseMult:a.sprinkles,
                    tpNoiseFreq:a.sprinkles,
                    tpFlipFlop:1,
                    

                };
            }
            else
                return a;
        };

        //update all cross sections, spiralize and turtle
        this.makeToolPath = function(){

            if(this.spiral){
                purgeObject(this.spiral);
            }
            if(flowerGeo)
                purgeObject(flowerGeo);
            if(this.cells.getLineParent().children.length>0){
                this.cells.shiftLineParent(this.cells.getLineParent().children.length);
            }

            for(var i = 0 ; i < this.layers ; i++){

                this.balls.animate(i);
                // this.cells.updatePoints(this.balls.balls);
                // 
                
                this.cells.updatePointsFromImg(this.drawCanvas(),this.gridDetail);

                // flowerGeo = this.cells.drawNurbs(i);
                // console.log(flowerGeo);
                this.cells.off = i*(.27/this.scale);
                this.cells.drawContour(false);
                this.cells.hideLines();
                // this.cells.drawNurbs();

                console.log(this.layers-i);

                i+=this.counterStep;

            }

            flowerGeo = this.cells.getLineParent();

            if(!spiralize){
                this._setSeam();
                this.prnt.add(flowerGeo);
            }
            else{
                this.spiral = this.spiralize();
                this.turtle();
            }

            // this.animateTurtle();

            console.log(this.prnt);
        };

        this.turtle = function(){

            var obj = new THREE.Object3D();
            var kidA = new THREE.Object3D();
            var kid = new THREE.Object3D();
            var angle = new THREE.Object3D();
            kidA.add(kid);
            kidA.add(angle);
            obj.add(kidA);

            // console.log('hi');

            if(this.turtleDrawing)
                purgeObject(this.turtleDrawing);



            // var spiral = this.spiralize();
            // this.spiral = spiral;

            var geo = new THREE.Geometry();

            var spiral = this.spiral;

            // console.log(spiral.geometry.vertices.length);

            var up = 0;
            var ping = true;
            var pong = false;
            var amt = (1/this.resampleDetail)*330;

            for(var i = 0 ; i < spiral.geometry.vertices.length-1 ; i++){

                if(up<1 && ping){
                    up+=amt;
                }
                else if(ping){
                    ping=false;
                    pong=true;
                }
                if(up>-1 && pong){
                    up-=amt;
                }
                else if(pong){
                    ping=true;
                    pong=false;
                }

                // if(up>1)
                //     up=1;
                // if(up<-1)
                //     up=-1;

                // console.log(up);

                var a = spiral.geometry.vertices[i];
                var b = spiral.geometry.vertices[i+1];
                obj.position = a;
                obj.lookAt(b);
                obj.up = new THREE.Vector3(0,0,1);
                // kid.position.x = noise((i/this.resampleDetail))*.1;
                // kid.position.x = up*.02;
                // 
                var twister = this.userData.tpTwist;
                kid.position.x = Math.cos((i*pi*4*(1+this.userData.tpTwist)/this.resampleDetail)*Math.ceil((.1+this.userData.tpPetals*Math.PI*4)*20))*this.userData.tpMult*.1;
                kid.position.z = Math.sin((i*pi*4*(1+this.userData.tpTwist)/this.resampleDetail)*Math.ceil((.1+this.userData.tpPetals*Math.PI*4)*20))*this.userData.tpLoop*THREE.Math.mapLinear(this.userData.tpPetals,0,.3,.26,.03);
                var sm = this.userData.tpNoiseFreq*15;
                kid.position.x += noise(a.x*sm,a.y*sm,a.z*sm)*this.userData.tpNoiseMult*.03;
                // if(Math.cos((i*pi*4*(1+this.userData.tpTwist*.01)/this.resampleDetail)*Math.ceil((1+this.userData.tpPetals*Math.PI*4)*20))>0)
                //     angle.position.x+=data.var5*.1;
                // else
                //     angle.position.x-=data.var5*.1;
                // kid.position.z = Math.sin((i*pi*4/this.resampleDetail)*this.resampleDetail/((1+data.var3)*20))*data.var4*.2;
                // kidA.scale.x = Math.cos((i*pi*2*(1+this.userData.tpTwist*.01)/this.resampleDetail)*Math.ceil((1+this.userData.tpPetals*Math.PI*4)*20))*(this.userData.tpFlipFlop);
                // kidA.position.z = Math.sin((i*pi*/this.resampleDetail)*this.resampleDetail/20)*.02;
                obj.updateMatrixWorld();
                var vec = new THREE.Vector3();
                vec.setFromMatrixPosition(kid.matrixWorld);
                geo.vertices.push(vec);
            }

            //            kid.position.x = Math.cos((i*pi*4/this.resampleDetail)*this.resampleDetail/(Math.ceil((1+this.userData.var3*Math.PI*4)*20)))*this.userData.var4*.1;


            // console.log((Math.ceil((1+this.userData.var3)*20)));

            var mat = new THREE.LineBasicMaterial( { color: 0x333333, transparent: true } );
            this.turtleDrawing = new THREE.Line(geo,mat);
            this.prnt.add(this.turtleDrawing);
            // var sp = new THREE.SplineCurve3(geo.vertices);
            // return new THREE.Mesh(new THREE.TubeGeometry(new THREE.SplineCurve3(geo.vertices),geo.vertices.length,.01),new THREE.MeshLambertMaterial(  ))
        };

        //just for diagnostics 
        this.animateTurtle = function(){

            if(!this.obj){
                this.obj = sphere(.01);
                this.kid = sphere(.01);
            }
            this.obj.add(this.kid);
            this.prnt.add(this.obj);

            // console.log(obj);
            // console.log(count);

             // var spiral = this.spiralize();

            if(count>this.spiral.geometry.vertices.length-5)
                count=0;

            var spiral = this.spiral;//this.prnt.children[0];

            // var geo = new THREE.Geometry();

            // console.log(spiral);

            // for(var i = 0 ; i < spiral.geometry.vertices.length-1 ; i++){
                var a = spiral.geometry.vertices[count];
                var b = spiral.geometry.vertices[count+5];
                this.obj.position = a;
                this.obj.up = new THREE.Vector3(0,0,1);
                this.obj.lookAt(b);
                this.kid.position.x = Math.sin((count/this.resampleDetail)*212)*.01;
                // obj.updateMatrixWorld();
                // var vec = new THREE.Vector3();
                // vec.setFromMatrixPosition(kid.matrixWorld);
                // geo.vertices.push(vec);
            // }

            // var mat = new THREE.LineBasicMaterial( { color: 0x333333, transparent: true } );
            // return new THREE.Line(geo,mat);
        };

        this._makeBalls = function(){

            this.balls = new Balls({userData:this.userData,pUserData:this.pUserData,numBalls:this.numBalls});
            this.balls.init();
        };

        //push data object into pUserData (previous) 
        //and return boolean stating if they're the same
        this.updateUserData = function(){

            var check = true;

            check = compareObj(this.userData,this.pUserData);
            this.pUserData = duplicateObject(this.userData);

            return check;
        };

        this.animateBalls = function(t){

            this.userData = this._setValuesFromData(this.processData);

            this.balls.userData = this.userData;
            this.balls.userData.layers = this.layers;

            this.counter+=this.counterStep;

            var tCount = this.counter;

            this.balls.animate(tCount);
            this.cells.off = tCount*(.27/this.scale);


            // this.cells.updatePoints(this.balls.balls);
            this.cells.updatePointsFromImg(this.drawCanvas(tCount),this.gridDetail);
            this.cells.showLines();

            if(this.cells.getLineParent().children.length>this.layers/this.counterStep){
                this.cells.shiftLineParent();
            }
            if(this.counter>this.layers){
                this.counter=0;
            }

            this.updateUserData();

            this.cells.drawContour(true);
        };

        this._setSeam = function(){

            for(var i = 0 ; i < flowerGeo.children.length ; i++){
                var g = flowerGeo.children[i].children[0].geometry;
                if(i===0)
                    var v = new THREE.Vector3(-1,0,0);
                else
                    var v = flowerGeo.children[i-1].children[0].geometry.vertices[0];
                this._setStart(g,v);
                //diagnostics
                // sp = sphere(.01);
                // sp.position = flowerGeo.children[i].children[0].geometry.vertices[0];
                // console.log(sp);
                // this.prnt.add(sp);
            }
        };

        this._setStart = function(a,b){

            //sets the first vertex in a to be the closets to b
       
            var t = 0;
            var r = [];

            if(a.vertices.length>0){
              
                var min=1e6;
                t=0;

                for(var j = a.vertices.length-1 ; j >= 0; j--){               
                    if (Math.abs(a.vertices[j].y-b.y)===0 && Math.abs(a.vertices[j].x-b.x)<min){
                        min = Math.abs(a.vertices[j].x-b.x);
                        t=j;
                    }
                }

                var front = a.vertices.splice(t, Number.MAX_VALUE);

                while(a.vertices.length>0){
                    front.push(a.vertices.shift());
                }

                // front.unshift(front[front.length-1].clone());
                front.push(front[0].clone());
                a.vertices = front;
            }
        };

        this._smooth = function(a){

            for(var i = 1 ; i < a.length-1 ; i++){

                var vec = a[i];

                for(var j = -1 ; j < 1 ; j++){
                    var temp =  a[i+j];
                    if(j!==i)
                    vec.add(temp);
                    // var temp2 = a[i+j];
                    

                    // vec.x += temp.x;
                    // vec.x += temp2.x;
                    // vec.y += temp.y;
                    // vec.y += temp2.y;
                    // vec.z += temp.z;
                    // vec.z += temp2.z;

                    
                }
                vec.x /= 3;
                vec.y /= 3;
                vec.z /= 3;
            }
        };

        this.spiralize = function(a){

            this._setSeam();

            var splines = [];

            for(l in flowerGeo.children){
                var arr = flowerGeo.children[l].children[0].geometry.vertices;
                // var arr2 = [];
                // var arr3 = [];
                // for (var k in arr){
                //     arr2[k] = arr[k];
                // }
                // for(var k = 0 ; k < arr.length ; k++){
                //     arr3.push(arr[k]);
                //     arr3.push(arr2[k]);
                //     arr3.push(arr2[k]);
                // }
                var line = makeNurbs([arr],this.curveDetail,false,true);
                splines.push(line);
            }

            var steps = this.resampleDetail;

            var returner = [];

            var geo = new THREE.Geometry();

            for(var s = 1 ; s < splines.length ; s++){

                // var r = [];
                // 
                // var p1 = [];
                // var p2 = [];
                // for(var i = 0 ; i < steps ; i++){
                //     p1.push(splines[s].getPointAt(i/steps));
                //     p2.push(splines[s-1].getPointAt(i/steps))
                // }
                var p1 =   splines[s].getSpacedPoints(steps);
                var p2 = splines[s-1].getSpacedPoints(steps);

                for(var i = 0 ; i < steps ; i++){
                    var p3 = p2[i].lerp(p1[i],i/steps);
                    geo.vertices.push(p3);
                }
            }

            // this.smooth(geo.vertices);

            // geo.vertices = makeNurbs([geo.vertices],this.resampleDetail * this.layers,true,false);
            var mat = new THREE.LineBasicMaterial( { color: 0x333333, transparent: true } );
            var spiral = new THREE.Line(geo,mat);

            return spiral;
        };

        this.drawCanvas = function(v){



            var val = v || 0;

            var cntr = this.gridDetail;

            // console.log(this.balls.balls[0].position.x);

            if(this.canvas!==null){

                var ctx = this.canvas.getContext("2d");
                ctx.globalCompositeOperation = 'lighter';
                var id = ctx.createImageData(this.gridDetail,this.gridDetail); // only do this once per page
                var d  = id.data;                        // only do this once per page
                
                var dat = [];

                var rand = 0;

                var freq = .3;

                var centerX = this.balls.balls[0].position.x;//15+noise(val*.01)*this.gridDetail/2;
                var centerY = this.balls.balls[0].position.y;//15+noise(val*.01+.3333) * this.gridDetail/2;

                ctx.clearRect ( 0 , 0 , this.gridDetail, this.gridDetail );


                for(var i = 0 ; i < this.balls.balls.length ; i ++){

                    var b = this.balls.balls[i].position;
                    var r = this.balls.balls[i].rad;
                    var h = this.gridDetail/2;
                    var f = this.gridDetail;


                    var grd=ctx.createRadialGradient(
                        h+b.x*f,
                        h+b.y*f,
                        0,
                        h+b.x*f,
                        h+b.y*f,
                        r*f
                        );
                    grd.addColorStop(0, 'rgba(255,0,0,255)');
                    grd.addColorStop(1, 'rgba(0,0,0,255)');
                    // grd.addColorStop(0,"green");
                    // grd.addColorStop(1,"black");

                    
                    // Fill with gradient
                    ctx.fillStyle=grd;
                    ctx.fillRect(0,0,cntr,cntr);

                }

                
        
        // ctx.lineTo(175, 50);
        // ctx.lineTo(200, 75);
        // ctx.lineTo(175, 100);
        // ctx.lineTo(75, 100);
        // ctx.lineTo(50, 75);
        // ctx.closePath();
                        
                // ctx.beginPath();
                
                // for(var i = 1 ; i < 1000 ; i++){
                //     ctx.beginPath();
                //     // ctx.moveTo(cntr/2, cntr/2);
                //     // ctx.moveTo(
                //     //     (cntr/2)+Math.sin((i-1)*.1)*(i/1000)*(cntr/2),
                //     //     (cntr/2)+Math.cos((i-1)*.1)*(i/1000)*(cntr/2)
                //     // );
                //     ctx.lineTo(
                //         (cntr/2)+Math.sin((i-1))*(cntr/5),
                //         (cntr/2)+Math.cos((i-1))*(cntr/5)
                //     );
                //     ctx.lineTo(
                //         (cntr/2)+Math.sin((i))*(cntr/5),
                //         (cntr/2)+Math.cos((i))*(cntr/5)
                //     );
                //     //  ctx.lineTo(
                //     //     (cntr/2)+Math.sin((i+1)*.1)*(i/1000)*(cntr/2),
                //     //     (cntr/2)+Math.cos((i+1)*.1)*(i/1000)*(cntr/2)
                //     // );
                //     // ctx.closePath();
                //     ctx.strokeStyle = "rgb("+(1+((i/1000)*-1))*255+",0,0)";
                //     ctx.lineWidth = 2;
                //     ctx.stroke();
                // }
              

                // var outerColor = 'rgba(0,0,0,255)';
                // var innerColor = 'rgba(255,0,0,255)';

                // var w = this.gridDetail;
                // var h = this.gridDetail;
    
    

                // function gradient(dir) {
                //     var grad = ctx.createLinearGradient(dir[0], dir[1], dir[2], dir[3]);
                    
                //     // grad.addColorStop(0, outerColor);
                //     grad.addColorStop(0, innerColor);
                //     grad.addColorStop(1.0, outerColor);
                    
                //     return grad;
                // }

                // // idea: render background gradient and a clipped "bow"
                // function background() {
                //     ctx.fillStyle = gradient([0, 0, 0, h]);
                //     ctx.fillRect(0, 0, w, h);
                // }

                // function bow() {
                //     ctx.save();

                //     ctx.beginPath();
                //     ctx.moveTo(0, 0);
                //     ctx.lineTo(w, h);
                //     ctx.lineTo(w, 0);
                //     ctx.lineTo(0, h);
                //     ctx.clip();
                    
                //     ctx.fillStyle = gradient([0, 0, w, 0]);
                //     ctx.fillRect(0, 0, w, h);

                //     ctx.restore();
                // }

                // function nGon(s){

                //     for(var i = 1 ; i < s ; i++){

                //         var c = w/2;
                //         var e = 30;

                //         var x =  c+Math.sin((i/s)*Math.PI*2)*e;
                //         var y =  c+Math.sin((i/s)*Math.PI*2)*e;
                //         var px = c+Math.sin(((i-1)/s)*Math.PI*2)*e;
                //         var py = c+Math.sin(((i-1)/s)*Math.PI*2)*e;

                //         ctx.save();

                //         ctx.beginPath();
                //         ctx.moveTo(c,c);
                //         // ctx.lineTo(0,h);
                //         ctx.lineTo(x,y);
                //         ctx.lineTo(h, 0);
                //         ctx.clip();
                        
                //         ctx.fillStyle = gradient([0, 0, w, 0]);
                //         ctx.fillRect(0, 0, w, h);

                //         ctx.restore();

                //     }

                // }

                // // background();
                // // bow();
                // nGon(5);



                var im=ctx.getImageData(0,0,this.gridDetail,this.gridDetail);
                // console.log(im);

                var q = -1;

                for(var i = 0 ; i < this.gridDetail ; i++){
                    for(var j = 0 ; j < this.gridDetail ; j++){
                        dat.push([im.data[++q],im.data[++q],im.data[++q],im.data[++q]]);
                    }
                }



                // var q=0;
                // for(var i = 0 ; i < d.length ; i++){
                //     d[i] =   dat[q][0]*255;
                //     d[++i] = dat[q][1];
                //     d[++i] = dat[q][2];
                //     d[++i] = dat[q][3];
                //     q++;
                // }

                // d[0]   = .5;
                // d[1]   = .5;
                // d[2]   = .5;
                // d[3]   = .5;

                // ctx.putImageData( id, 0, 0 );  
                // console.log(dat);

                return dat;


            }
        };
    }

    function Balls(params){ //line

        args = params || {};

        THREE.Object3D.call(this);

        this.numBalls = args.numBalls || 1;
        this.balls = [];
        this.prnt = new THREE.Object3D();

        this.userData = args.userData || data;
        this.pUserData = args.pUserData || data;

        this.count = 0;

        var snap = [.2,.2,.2,.2,.2,.2];

        this.init = function(){

            console.log(Math.round(1+this.userData.numBalls*10));

            if(this.tree)
                purgeObject(this.tree);

            this.tree = new TREE();
            this.tree.generate({
                joints:[1,5],
                angles:[0,pi],
                rads:[1,Math.max(0.001,Math.round(1+this.userData.numBalls*10))],
                length:[0.001,.1],
                start:[0],
                width:[1,.2]
            });

            this.tree.rotation.x=pi;
            this.tree.setScale(.3);
            
            // scene.add(this.tree);
        };

        this._updateBallPosition = function(){

            if(this.userData.numBalls!=this.pUserData.numBalls)
                this.init();

            var b = this.tree.worldPositionsArray(this.tree.report());
            this.balls = [];

            for(i in b){
                for(j in b[i]){
                    var p = b[i][j];
                    var q = new Ball({x:p.x,y:p.y});
                    q.parent = this;
                    // q.position.x = p.x;//new THREE.Vector3(1,1,0);

                    q.rad = p.w;//.04;
                    this.balls.push(q);
                }
            }

            // for(var i = 0 ; i < 30 ; i++){
            //     for(var j = 0 ; j < 30 ; j++){
            //         var q = new Ball({x:i/120,y:j/120});
            //         q.rad = .01;
            //         this.balls.push(q);
            //     }
            // }

            // console.log(this.balls);

            this.pUserData = duplicateObject(this.userData);
        }

        this.animate = function(t){

            var r = .2;

            this.tree.rotation.y = t*this.userData.baseTwist*.01;

            var scalar =  Math.min(1,THREE.Math.mapLinear((t)/this.userData.layers,.75,1,1,.01+this.userData.bpTopScale));
            var bulge = (1+Math.cos(Math.PI+((t/this.userData.layers)*Math.PI*2))/2)*this.userData.bpBulge;
            // this.tree.setScale();

            if(this.userData.numBalls>0){
                this.tree.applyFunc(this.tree.makeInfo([
                    [0,-1,-1,-1,-2],                            {
                        ty:this.userData.bpLength,
                        // sc:(1+this.userData.bpSize) * scalar,
                        rz: Math.sin(t*.01)*.19
                    },
                    [0,-1,-1,-1,0],                            {
                        // ty:this.userData.bpLength,
                        sc:(1+this.userData.bpSize) * scalar + bulge,
                        // rz: Math.sin(t*.01)*.19
                    },
                    // [0,-1,-1,-1,1],                            {ry:this.userData.bpNoisePos},
                    // [0,0,0],                            {rx:data.baseTwist*.001},
                    // [0,1,-2],                            {sc:1,rx:-Math.sin(t*.01)*.19},
                    // [0,-1,0],                            {tz:-Math.sin(t*.01)*1},
                    // [0,0,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
                    // [0,2,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
                    // [0,4,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
                    // [0,1,1],                              {rx:pi*2+t*-.01},
                    // [0,3,1],                              {rx:pi*2+t*-.01},
                    // [0,5,1],                              {rx:pi*2+t*-.01},
                ]),this.tree.transform);

                 this.tree.applyFunc(this.tree.makeInfo([
                    // [0,-1,-1,-1,-2],                            {sc:1+this.userData.bpSize,rz: Math.sin(t*.01)*.19},
                    [0,-1,-1,-1,0],  {
                        ry:this.userData.bpNoisePos,
                        o:this.userData.bpNoiseAnim,
                        off:this.userData.bpNoiseOffset,
                        sc:this.userData.bpNSFreq,
                        scl:this.userData.bpNoiseScale,
                        lscl:this.userData.layers,
                        uscl:this.userData.bpScaleUp,
                    },
                    // [0,0,0],                            {rx:data.baseTwist*.001},
                    // [0,1,-2],                            {sc:1,rx:-Math.sin(t*.01)*.19},
                    // [0,-1,0],                            {tz:-Math.sin(t*.01)*1},
                    // [0,0,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
                    // [0,2,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
                    // [0,4,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
                    // [0,1,1],                              {rx:pi*2+t*-.01},
                    // [0,3,1],                              {rx:pi*2+t*-.01},
                    // [0,5,1],                              {rx:pi*2+t*-.01},
                ]),function(o,args){
                    o.rotation.y = noise(args.off+1+t*args.o*.01+o.offset*13.1331)*args.ry*3;
                    var sc = 1+(noise(.1*t*args.sc+1+o.offset*.333)*(args.scl));
                    sc*=1+(THREE.Math.mapLinear(t/args.lscl,0,1,-1,1))*args.uscl;
                    o.scale = new THREE.Vector3(sc,sc,sc);
                 });
            }

            this.tree.applyFunc(this.tree.makeInfo([
                [0,0,-1],                            {width:this.userData.baseCenterScale*2*
                    (1+(THREE.Math.mapLinear(t/this.userData.layers,0,1,-1,1))*this.userData.bpScaleUp)},
            ]),this.tree.setJointWidth);
           

            this._updateBallPosition();

        };
    }

    Balls.prototype = Object.create(THREE.Object3D.prototype);

    function Ball(params){

        args = params || {};

        THREE.Object3D.call(this);

        this.position.x = args.x || 0;
        this.position.y = args.y || 0;
        this.rad = args.rad || .2; 
    }

    Ball.prototype = Object.create(THREE.Object3D.prototype);

    function Cells(params){

        var args = params || {};

        var prnt = params.parent || new THREE.Object3D();
        var amt = params.amount || 10;
        var extrude = params.extrude ? true : false;
        var scale = params.scale || 1;

        var pnts = [];
        var cells = [];
        var edges = [];
        var sortedEdges = [];
        var fEdges = [];
        var sEdges = [];
        var contour = [];

        this.off = args.off || 0;

        var faceParent = new THREE.Object3D();
        var lineParent = new THREE.Object3D();

        // prnt.add(faceParent);
        prnt.add(lineParent);
        // scene.add(prnt);

        this.getLineParent = function(){
            return lineParent;
        };

        this.getParent = function(){
            return prnt;
        }

        this.shiftLineParent = function(amt){

            var a = amt || 1;

            for(var i = 0 ; i < a ; i++){
                this._purgeObj(lineParent.children[0]);
            } 
        };

        this.setScale = function(s){
            prnt.scale.x = prnt.scale.y = prnt.scale.z = s;
        };

        //make points and cells
        this.make = function(){

            var i,j;

            for (i = 0; i < amt; i++) {
                for (j = 0; j < amt; j++) {
                    var pnt = new point({x:(i/amt)-.5,y:(j/amt)-.5,parent:prnt});
                    pnts.push(pnt);
                }
            }

            for (i = 0; i < amt-1; i++) {
                for (j = 0; j < amt-1; j++) {
                    cells.push(new cell({parent:faceParent,id:i+j*amt,points:[pnts[i+j*amt], pnts[i+((1+j)*amt)], pnts[1+i+((1+j)*amt)], pnts[1+i+j*amt]  ]}));
                    
                }
            }
        };

        this.showBoundary = function(){
            for (i = 0; i < amt; i++) {
                for (j = 0; j < amt; j++) {
                    if(i===0 || i==amt-1 || j===0 || j==amt-1){
                        pnts[i+j*amt].showPoint();
                    }
                }
            }
        };

        this.showPoints = function(){
            for(var p in pnts){
                pnts[p].showPoint();
            }
        };

        this.hidePoints = function(){
            for(var p in pnts){
                pnts[p].hidePoint();
            }
        };

        this.showFaces = function(){
            prnt.add(faceParent);
        };

        this.hideFaces = function(){
            prnt.remove(faceParent);
        };

        this.showLines = function(){
            prnt.add(lineParent);
        };

        this.hideLines = function(){
            prnt.remove(lineParent);
        };

        this.makeFaces = function(){
            for(var i in cells){
                cells[i].makeFace();
            }
        };

        //darken border points so there are no open shapes
        this.vignette = function(){
            for (i = 0; i < amt; i++) {
                for (j = 0; j < amt; j++) {
                    var tPoint = pnts[i+j*amt];
                    var c = tPoint.getColor();
                    if(i===0 || i==amt-1 || j===0 || j==amt-1){
                        tPoint.setColor(new THREE.Color(0,0,0));
                    }
                }
            }
        };

        this.updatePointsFromImg = function(img,res){

            for(var p  = 0 ; p < res ; p++){
                for(var j  = 0 ; j < res ; j++){
                    var c = Math.max(0,img[p+j*res][0]/255);
                    // if(c>.5)
                    // console.log(c);
                    pnts[p+j*res].setColor(new THREE.Color(c,c,c));
                }
                 
            }

            // console.log(img);

            // for(var p in pnts){
            //     var c = Math.random();
            //     pnts[p].setColor(new THREE.Color(c,c,c));
            // }

            this.vignette();

            edges = [];

            for(var i in cells){

                cells[i].updateColor();///****************
                if(cells[i].returnEdge().length>0)
                    edges.push(cells[i].returnEdge());
            }  
        };

        this.updatePoints = function(ball){

            for(var p in pnts){
                var c = 0;
                for(var i in ball){
                    // if(pnts[p].getColor().b<1){
                        var vec = new THREE.Vector3(pnts[p].getX(),pnts[p].getY(),0);
                        // ball[i].parent.updateMatrixWorld();
                        // scene.updateMatrixWorld();
                        var vec2 = ball[i].position;//new THREE.Vector3();
                        // vec2.setFromMatrixPosition(ball[i].matrixWorld);
                        var a = (vec.x-vec2.x);
                        var b = (vec.y-vec2.y);
                        var dist = Math.abs(Math.sqrt(a*a+b*b));

                        
                        if(dist<ball[i].rad && c<1)
                            c+=(ball[i].rad/dist)-1;
                        
                        // c *= 1+noise(vec.x*0.1333,vec.y*0.1333,count*0.03333)*1;
                        
                        pnts[p].setColor(new THREE.Color(c,c,c));
                    // }
                }
            }

            this.vignette();

            edges = [];

            for(var i in cells){

                cells[i].updateColor();///****************
                if(cells[i].returnEdge().length>0)
                    edges.push(cells[i].returnEdge());
            }  
        };

        this._flattenEdges = function(){

            fEdges = [];

            var flatEdges = [];

             for(var i in edges){
                for(var j in edges[i]){
                    for(var k = 0 ; k < edges[i][j].length ; k++){
                        flatEdges.push(edges[i][j][k]);

                        //diagnostics
                        // for(var q in edges[i][j][k]){
                        //     if(flatEdges.hasOwnProperty(edges[i][j][k][q].name)){
                        //         flatEdges[edges[i][j][k][q].name].push(q);
                        //         flatEdges[edges[i][j][k][q].name].w = edges[i][j].w;
                        //     }
                        //     else{
                        //         flatEdges[edges[i][j][k][q].name]=[q];
                        //         flatEdges[edges[i][j][k][q].name].w2 = edges[i][j].w;
                        //     }
                        // }
                    }
                }
            }
           
            fEdges = flatEdges;
        };

        this._sortEdges = function(){

            sEdges = [];

            while(fEdges.length>0 ){

                var p = 0;
                var se = [];
                se.push(fEdges.splice(0,1)[0]);

                for(var i = 0 ; i < 5 ; i++){
                 
                    for(p = 0 ; p < se.length ; p++){
                        
                        for(var k = 0 ; k < fEdges.length ; k++){
                           
                            if(fEdges[k][0].name==fEdges[k][1].name){
                                fEdges.splice(k,1);
                                k=0;
                                p=0;
                            }
                            else if(se[p][1].name==fEdges[k][0].name
                                    ){
                                se.push(((fEdges.splice(k,1)[0])));
                                k=0;
                            }
                             else if(se[p][0].name==fEdges[k][1].name && p===0){
                                se.unshift(((fEdges.splice(k,1)[0])));
                                k=0;
                                p=0;
                            }
                        }
                    }
                }

                sEdges.push(se);

            }
        };

        this.reverseEdge = function(edge){
            var temp = edge[1];
            edge[1]=edge[0];
            edge[0]=temp;
        };

        this._edgesToContour = function(arr){

            var a = sEdges;

            contour = [];

            for(var i = 0 ; i < a.length ; i++){
                var c = [];
                for(var j = 0 ; j < a[i].length ; j++){
                    if(j==0){
                        c.push(a[i][j][0]);
                        c.push(a[i][j][1]);
                    }
                    if(j>0 && a[i][j-1][1].distanceTo(a[i][j][1])<(2/amt))
                    c.push(a[i][j][1]);
                }
                contour.push(c);
            }
        };

        this.drawContour = function(r){

            this._flattenEdges();
            this._sortEdges();
            this._edgesToContour();

            var returnLargest = r ? true:false;

            var len = contour.length;
            var i = 0;

            if(returnLargest){
                var arrLen = 0;
                var which = 0;
                for(var j = 0 ; j < contour.length ; j++){
                    if(contour[j].length > arrLen){
                        arrLen = contour[j].length;
                        which = j;
                    }
                }
                i=which;
                len = which+1;
            }

            // if(!extrude) 
            this._purgeEdgeGeos();

            for(; i < len ; i++){

                var geo = new THREE.Geometry();
                var mat = new THREE.LineBasicMaterial( {color:0x999999} );

                for(var j = 0 ; j < contour[i].length ; j++){
                    var vec = contour[i][j];
                    if(extrude)
                        contour[i][j].z = this.off;
                    geo.vertices.push(vec);
                }

                edgeGeo = new THREE.Line(geo,mat);
                this.edgeGeos.add(edgeGeo);
            }
        };

        this.drawNurbs = function(o){

            this._flattenEdges();
            this._sortEdges();
            this._edgesToContour();
            this._purgeEdgeGeos();

            var geo = new THREE.Geometry();

            geo.vertices = makeNurbs(contour,100,true);
            var mat = new THREE.LineBasicMaterial( { color: 0x333333, transparent: true } );
            edgeGeo = new THREE.Line(geo,mat);
            this.edgeGeos.add(edgeGeo);
        };

        this._purgeEdgeGeos = function(){

            if(!extrude){
                if(this.edgeGeos){
                    lineParent.remove(this.edgeGeos);
                    this.edgeGeos.traverse(function(obj){
                        if(obj instanceof THREE.Line){
                            obj.geometry.dispose();
                            obj.material.dispose();
                        }
                    });
                    this.edgeGeos = null;
                }
            }
            this.edgeGeos=new THREE.Object3D();
            lineParent.add(this.edgeGeos);
        };

        this._purgeObj = function(o){

            if(o.parent)
                o.parent.remove(o);

            o.traverse(function(obj){
                if(obj instanceof THREE.Line){
                    obj.geometry.dispose();
                    obj.material.dispose();
                }
                });
            o = null;
        };

        this.drawEdges = function(){

            this._flattenEdges();
            this._sortEdges();
            this._purgeEdgeGeos();

            // if(!extrude){

            //     if(this.edgeGeos){
            //         lineParent.remove(this.edgeGeos);
            //         this.edgeGeos.traverse(function(obj){
            //             if(obj instanceof THREE.Line){
            //                 obj.geometry.dispose();
            //                 obj.material.dispose();
            //             }
            //         });
            //         this.edgeGeos = null;
            //     }
            // }

            // this.edgeGeos=new THREE.Object3D();
            
            
            for(var i in edges){
                for(var j in edges[i]){
                    for(var k in edges[i][j]){
                        var geo = new THREE.Geometry();
                        var mat = new THREE.LineBasicMaterial( { color:0x999999} );
                        for(var m in edges[i][j][k]){
                            // if(m!=='0'){
                                // console.log(m);
                                var vert = edges[i][j][k][m];
                                if(extrude)
                                    vert.z = count*.27;
                                geo.vertices.push(vert);
                            // }
                        }
                        edgeGeo = new THREE.Line(geo,mat);
                        this.edgeGeos.add(edgeGeo);
                    }
                }
            }
            
            lineParent.add(this.edgeGeos);//ready to be deprecated
        };
    }

    function point(params){

        var args = params || {};
        var x = params.x || 0;
        var y = params.y || 0;
        var color = params.color || new THREE.Color(1,1,0);
        // var pGeo = new sphere(0.01,6,6);
        var prnt = args.parent || scene;
        // pGeo.position.x=x;
        // pGeo.position.y=y;

        this.hidePoint = function(){
            // prnt.remove(pGeo);
        };

        this.showPoint = function(){
            // prnt.add(pGeo);
        };

        this.setX = function(val){
            x = val;
        };
        this.getX = function(){
            return x;
        };
        this.setY = function(val){
            y = val;
        };
        this.getY = function(){
            return y;
        };
        this.setColor = function(c){
            color = c;
            // pGeo.material.color=c;
        };
        this.getColor = function(){
            return color;
        };
    }

    function cell(params){

        var args = params || {};
        var points = params.points || [];
        var id = params.id || Math.random();
        var thresh = params.thresh || 1;
        
        var prnt = params.parent || scene;

        var geo = new THREE.Geometry();
        geo.points = [];
        var mat = new THREE.MeshLambertMaterial( {color:0xFFFFFF,vertexColors:THREE.VertexColors});
        var mesh;

        var conditions = [
            [0,0,0,0],  //0
            [1,1,1,1],  //1
            [1,0,0,0],  //2
            [0,1,0,0],  //3
            [0,0,1,0],  //4
            [0,0,0,1],  //5
            [1,1,0,0],  //6
            [0,1,1,0],  //7
            [0,0,1,1],  //8
            [1,0,0,1],  //9
            [1,0,1,0],  //10
            [0,1,0,1],  //11
            [0,1,1,1],  //12
            [1,0,1,1],  //13
            [1,1,0,1],  //14
            [1,1,1,0]   //15
        ];

       
        this.getPoints = function(){
            return points;
        };

        this.printPoints = function(){
            for(var i in points){
                console.log(i,id,points[i].getX(),points[i].getY());
            }
        };

        this.makeFace = function(){

            for(var i in points){
                var vec = new THREE.Vector3(points[i].getX(),points[i].getY(),0);
                vec.color = points[i].color;
                geo.vertices.push(vec);
                geo.points.push(points[i]);
            }

            geo.faces.push(new THREE.Face3(0,1,2));
            geo.faces.push(new THREE.Face3(2,3,0));

            for(var i = 0 ; i < 2 ; i++){
                for(var j = 0 ; j < 3 ; j++){
                    geo.faces[i].vertexColors[j] = points[geo.faces[i].a].getColor();
                }
            }

            geo.computeCentroids();
            geo.computeFaceNormals();
            geo.computeVertexNormals();

            mesh = new THREE.Mesh(geo,mat);

            prnt.add(mesh);
        };

        this.updateColor = function(){

            if(mesh){

                for(var i = 0 ; i < 2 ; i++){
                    mesh.geometry.faces[i].vertexColors[0] = points[geo.faces[i].a].getColor();
                    mesh.geometry.faces[i].vertexColors[1] = points[geo.faces[i].b].getColor();
                    mesh.geometry.faces[i].vertexColors[2] = points[geo.faces[i].c].getColor();
                    mesh.geometry.colorsNeedUpdate = true;
                }
            }

        };

        this.returnEdge = function(){

            var edges = [];
            var check = [];
            var toLerp = [];
            var w = 0;

            for(var p in points){
                check[p] = Math.round(Math.min(1,points[p].getColor().r));
                toLerp[p] = points[p].getColor().r;
            }

            for(var v in conditions){
                if(arraysEqual(check,conditions[v])){
                    w=v;
                }
            }

            if(w!==0 && w!== 1){
                if(w==2){
                    var e  = makeEdge([points[0],points[1],points[3]],w);
                    edges.push(e);
                }
                if(w==3){
                    var e  = makeEdge([points[1],points[2],points[0]],w);
                    edges.push(e);
                }
                if(w==4){
                    var e  = makeEdge([points[2],points[3],points[1]],w);
                    edges.push(e);
                }
                if(w==5){
                    var e  = makeEdge([points[3],points[0],points[2]],w);
                    edges.push(e);
                }
                if(w==6){
                    var e  = makeEdge([points[2],points[3],points[0],points[1]],w);
                    edges.push(e);
                }
                if(w==7){
                    var e  = makeEdge([points[3],points[0],points[1],points[2]],w);
                    edges.push(e);
                }
                if(w==8){
                    var e  = makeEdge([points[0],points[1],points[2],points[3]],w);
                    edges.push(e);
                }
                if(w==9){
                    var e  = makeEdge([points[1],points[2],points[3],points[0]],w);
                    edges.push(e);
                }
                if(w==10){
                    var e  = makeEdge([points[0],points[1],points[3]],w);
                    edges.push(e);
                    var e  = makeEdge([points[2],points[3],points[1]],w);
                    edges.push(e);
                }
                if(w==11){
                    var e  = makeEdge([points[1],points[2],points[0]],w);
                    edges.push(e);
                    var e  = makeEdge([points[3],points[0],points[2]],w);
                    edges.push(e);
                }
                if(w==12){
                    var e  = makeEdge([points[0],points[3],points[1]],w);
                    edges.push(e);
                }
                if(w==13){
                    var e  = makeEdge([points[1],points[0],points[2]],w);
                    edges.push(e);
                }
                if(w==14){
                    var e  = makeEdge([points[2],points[1],points[3]],w);
                    edges.push(e);
                }
                if(w==15){
                    var e  = makeEdge([points[3],points[2],points[0]],w);
                    edges.push(e);
                }
                
            }
            return edges;
        };
    }

    function makeEdge(arr,w){

        var e = [];

        if(arr.length==3){
            var veca = new THREE.Vector3(arr[0].getX(),arr[0].getY(),0);
            veca.color = arr[0].getColor();
            var vecd = new THREE.Vector3(arr[0].getX(),arr[0].getY(),0);
            vecd.color = arr[0].getColor();
            var vecb = new THREE.Vector3(arr[1].getX(),arr[1].getY(),0);
            vecb.color = arr[1].getColor();
            var vecc = new THREE.Vector3(arr[2].getX(),arr[2].getY(),0);
            vecc.color = arr[2].getColor();

            var lerpA = THREE.Math.mapLinear(.5,arr[0].getColor().r , arr[1].getColor().r,0,1);
            var lerpB = THREE.Math.mapLinear(.5,arr[0].getColor().r , arr[2].getColor().r,0,1);

            e.push(edge(veca.lerp(vecb,lerpA),vecd.lerp(vecc,lerpB)));
        }
         if(arr.length==4){
            var veca = new THREE.Vector3(arr[0].getX(),arr[0].getY(),0);
            veca.color = arr[0].getColor();
            var vecb = new THREE.Vector3(arr[1].getX(),arr[1].getY(),0);
            vecb.color = arr[1].getColor();
            var vecc = new THREE.Vector3(arr[2].getX(),arr[2].getY(),0);
            vecc.color = arr[2].getColor();
            var vecd = new THREE.Vector3(arr[3].getX(),arr[3].getY(),0);
            vecd.color = arr[0].getColor();

            var lerpA = THREE.Math.mapLinear(.5,arr[0].getColor().r , arr[3].getColor().r,0,1);
            var lerpB = THREE.Math.mapLinear(.5,arr[1].getColor().r , arr[2].getColor().r,0,1);

            e.push(edge(veca.lerp(vecd,lerpA),vecb.lerp(vecc,lerpB)));
        }

        e.w = w;

        return e;
    }

    function edge(a,b){

        var r = [];
        a.name = a.x.toFixed(4)+","+a.y.toFixed(4);
        b.name = b.x.toFixed(4)+","+b.y.toFixed(4);
        r=[a,b];
        return r;
    }

    function arraysEqual(a, b) {
      if (a === b) return true;
      if (a == null || b == null) return false;
      if (a.length != b.length) return false;
      for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    function makeNurbs(points,det,returnGeom,spaced){

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
    }

    function saveGCode(arr,scalar) {

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
    }

    function saveGCodeMakerbot(arr,scalar) {

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
    }

    function makeFrame(size){

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
    }

    function purgeObject(o){

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
    };

    var compareObj = function(a,b){

        var returner = true;

        for(var k in a){
            if(b[k]!=a[k])
                returner = false;
        }

        return returner;
    }

    function duplicateObject(a){

        var b = {};

        for(var k in a){
            b[k] = a[k];
        }

        return b;
    }

    return Flower;
});