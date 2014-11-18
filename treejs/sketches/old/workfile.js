sc1 = {
    
    setup:function(){

        frameRate = 1;


        b = new Balls({numBalls:6});
        b.init();
        flower = new Flower({layers:10,curveDetail:600,resampleDetail:600,balls:b,scale:150,gridDetail:20});
        flower.init();
       
        // simpleSquares.setup();

        var center = new THREE.Object3D();
        var line = new THREE.Mesh(new THREE.CylinderGeometry( 1,1),new THREE.MeshLambertMaterial(  ));
        line.position.x = -50;
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

    draw:function(time){
        // flower.animateTurtle();
        // 
        // simpleSquares.draw();

        if(varR){

            // var n = [];
            // for(var i in flower.prnt.children[0].geometry.vertices.length){
            //     var v = flower.prnt.children[0].geometry.vertices;
            // }
            saveGCode([flower.prnt.children[0].geometry.vertices],flower.scale)
            console.log(flower.prnt);
            varR=false;
        }
         if(varE){

            // var n = [];
            // for(var i in flower.prnt.children[0].geometry.vertices.length){
            //     var v = flower.prnt.children[0].geometry.vertices;
            // }
            saveGCodeMakerbot([flower.prnt.children[0].geometry.vertices],flower.scale)
            console.log(flower.prnt);
            varE=false;
        }

    }
};

simpleSquares = {

    setup:function(){

        var cGeo = new THREE.Object3D();
        cells = new Cells({extrude:false,parent:cGeo,amount:60});
        // cells.showFaces();
        cells.showLines();
        cells.make();
        // cells.showPoints();
        cells.makeFaces();
        cells.setScale(100);
        b = new Balls({numBalls:6});
        b.init();
        console.log(b);

    },

    draw:function(){

        if(typeof b === 'undefined')
            this.setup();
        else
            b.animate(count);
        // console.log(b);
        cells.updatePoints(b.balls);
        // cells.drawNurbs();
        cells.drawContour(true);
        // cells.drawEdges();


    }
}

function Flower(params){

    args = params || {};
    this.layerHeight = args.layerHeight || 0.27;
    this.layers = args.layers || 100;
    this.baseDetail = args.baseDetail || 100;
    this.prnt = args.parent || new THREE.Object3D();
    this.gridDetail = args.gridDetail || 30;
    this.balls = args.balls || [];
    this.scale = args.scale || 1;
    this.curveDetail = args.curveDetail || 100;
    this.resampleDetail = args.resampleDetail || 100;

    var spiralize = args.spiralize || true;

    var flowerGeo;

    this.init = function(){

        scene.add(this.prnt);
        this.cells = new Cells({extrude:true,parent:this.prnt,amount:this.gridDetail});
        this.cells.make();
        this.cells.makeFaces();
        this.cells.setScale(args.scale);
        this.cells.showBoundary();

        for(var i = 0 ; i < this.layers ; i++){

            this.balls.animate((90+i));
            
            this.cells.updatePoints(this.balls.balls);

            // flowerGeo = this.cells.drawNurbs(i);
            // console.log(flowerGeo);
            this.cells.off = i*(.27/this.scale);
            this.cells.drawContour(true);
            this.cells.hideLines();
            // this.cells.drawNurbs();


            console.log(this.layers-i);

        }

        flowerGeo = this.cells.getLineParent();

        if(!spiralize){
            this.setSeam();
            this.prnt.add(flowerGeo);
        }
        else
            this.prnt.add(this.turtle());

        // this.animateTurtle();

        console.log(this.prnt);
    };

    this.turtle = function(){

        var obj = new THREE.Object3D();
        var kidA = new THREE.Object3D();
        var kid = new THREE.Object3D();
        kidA.add(kid);
        obj.add(kidA);

        var spiral = this.spiralize();
        this.spiral = spiral;

        var geo = new THREE.Geometry();

        console.log(spiral.geometry.vertices.length);

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
            kid.position.x = Math.cos((i*pi*4/this.resampleDetail)*this.resampleDetail/10)*.01;
            kid.position.z = Math.sin((i*pi*4/this.resampleDetail)*this.resampleDetail/10)*.01;
            // kidA.scale.x = Math.sin((i*pi*2/this.resampleDetail)*this.resampleDetail/20);
            // kidA.position.z = Math.sin((i*pi*/this.resampleDetail)*this.resampleDetail/20)*.02;
            obj.updateMatrixWorld();
            var vec = new THREE.Vector3();
            vec.setFromMatrixPosition(kid.matrixWorld);
            geo.vertices.push(vec);
        }

        var mat = new THREE.LineBasicMaterial( { color: 0x333333, transparent: true } );
        return new THREE.Line(geo,mat);
        // var sp = new THREE.SplineCurve3(geo.vertices);
        // return new THREE.Mesh(new THREE.TubeGeometry(new THREE.SplineCurve3(geo.vertices),geo.vertices.length,.01),new THREE.MeshLambertMaterial(  ))
    };

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
    }

    this.setSeam = function(){

        for(var i = 0 ; i < flowerGeo.children.length ; i++){
            var g = flowerGeo.children[i].children[0].geometry;
            if(i===0)
                var v = new THREE.Vector3(-1,0,0);
            else
                var v = flowerGeo.children[i-1].children[0].geometry.vertices[0];
            this.setStart(g,v);
            //diagnostics
            // sp = sphere(.01);
            // sp.position = flowerGeo.children[i].children[0].geometry.vertices[0];
            // console.log(sp);
            // this.prnt.add(sp);
        }
    };

    this.setStart = function(a,b){

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

    this.smooth = function(a){

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

        this.setSeam();

        var splines = [];

        for(l in flowerGeo.children){
            var line = makeNurbs([flowerGeo.children[l].children[0].geometry.vertices],this.curveDetail,false,true);
            splines.push(line);
        }

        var steps = this.curveDetail;

        var returner = [];

        var geo = new THREE.Geometry();

        for(var s = 1 ; s < splines.length ; s++){

            // var r = [];
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
    }
}

function Balls2(params){

    args = params || {};

    THREE.Object3D.call(this);

    this.numBalls = args.numBalls || 1;
    this.balls = [];

    this.init = function(){
        this.tree = new TREE();
        this.tree.generate({
            joints:[10],
            angles:[pi],
            rads:[6],
            length:[4]
        });
        this.tree.rotation.x=pi;
        this.tree.setScale(.01);
        var b = this.tree.worldPositionsArray(this.tree.report());
        for(i in b){
            for(j in b[i]){
                var p = b[i][j];
                var q = new Ball();
                q.parent = this;
                q.position = p;//new THREE.Vector3(0,0,0);
                q.rad = .04;
                this.balls.push(q);
            }
        }
        scene.add(this.tree);
        console.log(this.balls);
    };

    this.animate = function(t){

       this.tree.applyFunc(this.tree.makeInfo([
            [0,-1,[1,8]],                              {rx:Math.sin(t*.5)*.3},
            // [0,-1,-1,-1,-1],                        {rz:mouseX+data.var1},
            // [0,-1,-1,-1,-1,-1,-1],                  {rz:mouseX+data.var2},
            // [0,-1,-1,-1,-1,-1,-1,-1,-1],            {rz:mouseX+data.var3},
            // [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],      {rz:mouseX+data.var4},
            // [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],{rz:mouseX+data.var5},
        ]),this.tree.transform);

        var b = this.tree.worldPositionsArray(this.tree.report());
        this.balls = [];
        for(i in b){
            for(j in b[i]){
                var p = b[i][j];
                var q = new Ball();
                q.parent = this;
                q.position = p;//new THREE.Vector3(0,0,0);
                q.rad = .05;
                this.balls.push(q);
            }
        }

    };

    this.init2 = function(){
        for(var i = 0 ; i < this.numBalls ; i++){
            var ball = new Ball();
            ball.position.y=1;
            if(i>0){
                var bp = new THREE.Object3D();
                bp.add(ball);
                bp.rotation.z = ((i-1)/(this.numBalls-1)) * pi * 4;
                this.balls[0].add(bp);
            }
            else
                this.add(ball);
            this.balls.push(ball);
        }
    };

    this.animate2 = function(t){

        // var off = THREE.Math.mapLinear(Math.sin(t),-1,1,0,.15)
        // this.balls[0].position.x = 0;
        // this.balls[0].position.y = 0;
        // this.balls[0].rad = .1+off*1.5;
        // this.balls[0].rotation.z+=t*.0051;
        // for(var i = 1 ; i < this.numBalls ; i++){
        //     this.balls[i].position.y = off*2;// = new THREE.Vector3(0,omouseY*10,0);
        //     // this.balls[i].rotation.z = omouseX*2;
        // }
    };  
}

function Balls3(params){

    args = params || {};

    THREE.Object3D.call(this);

    this.numBalls = args.numBalls || 1;
    this.balls = [];
    this.prnt = new THREE.Object3D();

    this.count = 0;

    this.init = function(){
        this.tree = new TREE();
        this.tree.generate({
            joints:[5,8],
            angles:[pi,.7],
            rads:[5,2],
            length:[4,3],
            start:[1,4]
        });
        this.tree.rotation.x=pi;
        this.tree.setScale(.01);
        var b = this.tree.worldPositionsArray(this.tree.report());
        for(i in b){
            for(j in b[i]){
                var p = b[i][j];
                var q = new Ball();
                q.parent = this;
                q.position = p;//new THREE.Vector3(0,0,0);
                q.rad = .04;
                this.balls.push(q);
            }
        }
        scene.add(this.tree);
        // console.log(this.balls);
    };

    this.animate = function(t){

        var size = t/4;
        if(size>1)
            size=1;

        var scalar = THREE.Math.smoothstep(size,0,1);
        var scalar2 = THREE.Math.smoothstep(size,0,1);
        // scalar*=.5;
        scalar+=.001;

        // console.log(++this.count);

       this.tree.applyFunc(this.tree.makeInfo([
            [0,-1,-2],                              {sc:1,rx:Math.sin(t*2)*.1},
            [0,-1,4],                                {ry:pi},
            [0,-1,-1,0,-2],                              {sc:scalar,rz:Math.sin(t*2)*-.2},
            [0,-1,-1,1,-2],                              {sc:scalar,rz:Math.sin(t*2)*.2},
            [0,-1,-1,0,0],                              {rz:scalar*.7},
            [0,-1,-1,1,0],                              {rz:scalar*.7},
            // [0,-1,-1,-1,-1],                        {rz:mouseX+data.var1},
            // [0,-1,-1,-1,-1,-1,-1],                  {rz:mouseX+data.var2},
            // [0,-1,-1,-1,-1,-1,-1,-1,-1],            {rz:mouseX+data.var3},
            // [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],      {rz:mouseX+data.var4},
            // [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],{rz:mouseX+data.var5},
        ]),this.tree.transform);

       var r = .2;

       if(15-t*10>4)
            r=(15-t*10)*.015;
        else
            r=.04;

        scalar2*=-1;
        scalar2+=1;

        scalar2*=.2;
        scalar2+=.04;
        // scalar2
        r=scalar2;

        // console.log(r);

        var b = this.tree.worldPositionsArray(this.tree.report());
        this.balls = [];
        for(i in b){
            for(j in b[i]){
                var p = b[i][j];
                var q = new Ball();
                q.parent = this;
                q.position = p;//new THREE.Vector3(0,0,0);
                q.rad = r;
                this.balls.push(q);
            }
        }

    };//branching
}

function Balls4(params){

    args = params || {};

    THREE.Object3D.call(this);

    this.numBalls = args.numBalls || 1;
    this.balls = [];
    this.prnt = new THREE.Object3D();

    this.count = 0;

    var snap = [.2,.2,.2,.2,.2,.2];

    this.init = function(){
        this.tree = new TREE();
        this.tree.generate({
            joints:[7],
            angles:[pi],
            rads:[6],
            length:[.3],
            start:[1],
            width:[.8]
        });
        this.tree.rotation.x=pi;
        this.tree.setScale(.13);
        var b = this.tree.worldPositionsArray(this.tree.report());
        for(i in b){
            for(j in b[i]){
                var p = b[i][j];
                var q = new Ball();
                q.parent = this;
                q.position = p;//new THREE.Vector3(0,0,0);
                q.rad = .04;
                this.balls.push(q);
            }
        }
        scene.add(this.tree);
        // console.log(this.balls);
    };

    this.animate = function(t){

        var r = .2;

        // var size = t/4;
        // if(size>1)
        //     size=1;

        // var scalar = THREE.Math.smoothstep(size,0,1);
        // var scalar2 = THREE.Math.smoothstep(size,0,1);
        // // scalar*=.5;
        // scalar+=.001;

        // console.log(++this.count);
        // 
        

        if(t%20==0  && this.count<7)
            this.count++;

        for(var i = 0 ; i < this.count-1 ; i++){

            // console.log(snap[i])
            if(snap[i]>.001)
                snap[i] *= .9;

           
        }

         for(var i = 0 ; i < snap.length ; i++){
            snap[i]+=.01;
             this.tree.applyFunc(this.tree.makeInfo([
                [0,i,0],       {sc:snap[i]}, 
            ]),this.tree.transform);
        }



        var pq = t;

        if(pq>120)
            pq=120;

        console.log(pq);

        this.tree.applyFunc(this.tree.makeInfo([
            [0,-1,-2],                            {sc:1,rx:Math.sin(t*.05)*.04},
            [0,0,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
            [0,2,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
            [0,4,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
            // [0,1,1],                              {rx:pi*2+t*-.01},
            // [0,3,1],                              {rx:pi*2+t*-.01},
            // [0,5,1],                              {rx:pi*2+t*-.01},
        ]),this.tree.transform);
       

       // var r = .2;

       // if(15-t*10>4)
       //      r=(15-t*10)*.015;
       //  else
       //      r=.04;

       //  scalar2*=-1;
       //  scalar2+=1;

       //  scalar2*=.2;
       //  scalar2+=.04;
       //  // scalar2
       //  r=scalar2;

        // console.log(r);

        var b = this.tree.worldPositionsArray(this.tree.report());
        this.balls = [];
        for(i in b){
            for(j in b[i]){
                var p = b[i][j];
                var q = new Ball();
                q.parent = this;
                q.position = p;//new THREE.Vector3(0,0,0);
                q.rad = p.w;
                if(j=='0')
                    q.rad=.1;
                this.balls.push(q);
            }
        }

    };//shelves
}

function Balls5(params){ //upside down shelves

    args = params || {};

    THREE.Object3D.call(this);

    this.numBalls = args.numBalls || 1;
    this.balls = [];
    this.prnt = new THREE.Object3D();

    this.count = 0;

    var snap = [.2,.2,.2,.2,.2,.2];

    this.init = function(){
        this.tree = new TREE();
        this.tree.generate({
            joints:[7],
            angles:[pi],
            rads:[6],
            length:[.3],
            start:[1],
            width:[.8]
        });
        this.tree.rotation.x=pi;
        this.tree.setScale(.13);
        var b = this.tree.worldPositionsArray(this.tree.report());
        for(i in b){
            for(j in b[i]){
                var p = b[i][j];
                var q = new Ball();
                q.parent = this;
                q.position = p;//new THREE.Vector3(0,0,0);
                q.rad = .04;
                this.balls.push(q);
            }
        }
        scene.add(this.tree);
        // console.log(this.balls);
    };

    this.animate = function(t){

        var r = .2;

        // var size = t/4;
        // if(size>1)
        //     size=1;

        // var scalar = THREE.Math.smoothstep(size,0,1);
        // var scalar2 = THREE.Math.smoothstep(size,0,1);
        // // scalar*=.5;
        // scalar+=.001;

        // console.log(++this.count);
        // 
        

        if(t%20==0  && this.count<7)
            this.count++;

        for(var i = this.count-2 ; i < this.count-1 ; i++){

            // console.log(snap[i])
            if(snap[i] < 1.01)
                snap[i] = 1.02;

           
        }

         for(var i = 0 ; i < snap.length ; i++){
            if(snap[i]>.1)
                snap[i]-=.004;
             this.tree.applyFunc(this.tree.makeInfo([
                [0,i,0],       {sc:snap[i]}, 
            ]),this.tree.transform);
        }



        var pq = t;

        if(pq>120)
            pq=120;

        console.log(pq);

        this.tree.applyFunc(this.tree.makeInfo([
            [0,-1,-2],                            {sc:1,rx:Math.sin(t*.05)*.04},
            [0,0,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
            [0,2,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
            [0,4,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
            // [0,1,1],                              {rx:pi*2+t*-.01},
            // [0,3,1],                              {rx:pi*2+t*-.01},
            // [0,5,1],                              {rx:pi*2+t*-.01},
        ]),this.tree.transform);
       

       // var r = .2;

       // if(15-t*10>4)
       //      r=(15-t*10)*.015;
       //  else
       //      r=.04;

       //  scalar2*=-1;
       //  scalar2+=1;

       //  scalar2*=.2;
       //  scalar2+=.04;
       //  // scalar2
       //  r=scalar2;

        // console.log(r);

        var b = this.tree.worldPositionsArray(this.tree.report());
        this.balls = [];
        for(i in b){
            for(j in b[i]){
                var p = b[i][j];
                var q = new Ball();
                q.parent = this;
                q.position = p;//new THREE.Vector3(0,0,0);
                q.rad = p.w;
                if(j=='0')
                    q.rad=.14;
                this.balls.push(q);
            }
        }

    };
}


function Balls(params){ //line

    args = params || {};

    THREE.Object3D.call(this);

    this.numBalls = args.numBalls || 1;
    this.balls = [];
    this.prnt = new THREE.Object3D();

    this.count = 0;

    var snap = [.2,.2,.2,.2,.2,.2];

    this.init = function(){
        this.tree = new TREE();
        this.tree.generate({
            joints:[15],
            angles:[pi],
            rads:[2],
            length:[.2],
            start:[1],
            width:[.3]
        });
        this.tree.rotation.x=pi;
        this.tree.setScale(.13);
        var b = this.tree.worldPositionsArray(this.tree.report());
        for(i in b){
            for(j in b[i]){
                var p = b[i][j];
                var q = new Ball();
                q.parent = this;
                q.position = p;//new THREE.Vector3(0,0,0);
                q.rad = .04;
                this.balls.push(q);
            }
        }
        scene.add(this.tree);
        // console.log(this.balls);
    };

    this.animate = function(t){

        var r = .2;

        // var size = t/4;
        // if(size>1)
        //     size=1;

        // var scalar = THREE.Math.smoothstep(size,0,1);
        // var scalar2 = THREE.Math.smoothstep(size,0,1);
        // // scalar*=.5;
        // scalar+=.001;

        // console.log(++this.count);
        // 
        

        // if(t%20==0  && this.count<7)
        //     this.count++;

        // for(var i = this.count-2 ; i < this.count-1 ; i++){

        //     // console.log(snap[i])
        //     if(snap[i] < 1.01)
        //         snap[i] = 1.02;

           
        // }

        //  for(var i = 0 ; i < snap.length ; i++){
        //     if(snap[i]>.1)
        //         snap[i]-=.004;
        //      this.tree.applyFunc(this.tree.makeInfo([
        //         [0,i,0],       {sc:snap[i]}, 
        //     ]),this.tree.transform);
        // }



        // var pq = t;

        // if(pq>120)
        //     pq=120;

        // console.log(pq);

        this.tree.applyFunc(this.tree.makeInfo([
            [0,0,-2],                            {sc:1,rx: Math.sin(t*.01)*.19},
            [0,1,-2],                            {sc:1,rx:-Math.sin(t*.01)*.19},
            [0,-1,0],                            {tz:-Math.sin(t*.01)*1},
            // [0,0,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
            // [0,2,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
            // [0,4,1],                              {sc:.8+(1+Math.sin(t*.02))*.2},
            // [0,1,1],                              {rx:pi*2+t*-.01},
            // [0,3,1],                              {rx:pi*2+t*-.01},
            // [0,5,1],                              {rx:pi*2+t*-.01},
        ]),this.tree.transform);
       

       // var r = .2;

       // if(15-t*10>4)
       //      r=(15-t*10)*.015;
       //  else
       //      r=.04;

       //  scalar2*=-1;
       //  scalar2+=1;

       //  scalar2*=.2;
       //  scalar2+=.04;
       //  // scalar2
       //  r=scalar2;

        // console.log(t);

        var b = this.tree.worldPositionsArray(this.tree.report());
        this.balls = [];
        for(i in b){
            for(j in b[i]){
                var p = b[i][j];
                var q = new Ball();
                q.parent = this;
                q.position = p;//new THREE.Vector3(0,0,0);
                q.rad = p.w;
                // if(j=='0')
                //     q.rad=.14;
                this.balls.push(q);
            }
        }

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
    scene.add(prnt);

    this.getLineParent = function(){
        return lineParent;
    };

    this.setScale = function(s){
        console.log(prnt);
        prnt.scale.x = prnt.scale.y = prnt.scale.z = s;
    }

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

    this.updatePoints = function(ball){

        for(var p in pnts){
            var c = 0;
            for(var i in ball){
                // console.log(ball);
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

    this.flattenEdges = function(){

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

    this.sortEdges = function(){

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

    this.edgesToContour = function(arr){

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

        this.flattenEdges();
        this.sortEdges();
        this.edgesToContour();

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
        this.purgeEdgeGeos();

        

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

        this.flattenEdges();
        this.sortEdges();
        this.edgesToContour();
        this.purgeEdgeGeos();

        // var off = o || count;

        // if(!extrude){
        //     this.purgeEdgeGeos();
        // }

        // if(!this.nurbsFlower && extrude){
        //     this.nurbsFlower = new THREE.Line(new THREE.Geometry(),new THREE.LineBasicMaterial(  ));
        // }

        var geo = new THREE.Geometry();

        // for(var k = 0 ; k < contour.length; k++){

        //     if(contour[k].length>3){

        //         var nurbsControlPoints = [];
        //         var nurbsKnots = [];
        //         var nurbsDegree = 3;

        //         for ( var i = 0; i <= nurbsDegree; i ++ ) {

        //             nurbsKnots.push( 0 );

        //         }


        //         for ( var i = 0, j = contour[k].length; i < j ; i ++ ) {

        //             var vec = new THREE.Vector4(
        //                     contour[k][i].x,
        //                     contour[k][i].y,
        //                     contour[k][i].z,
        //                     1 // weight of control point: higher means stronger attraction
        //                 );

        //             if(extrude)
        //                 vec.z+=this.off;

        //             nurbsControlPoints.push(vec);

        //             var knot = ( i + 1 ) / ( j - nurbsDegree );
        //             nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );

        //         }

        //         var nurbsCurve = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);
        //         // console.log(nurbsCurve);
        //         geo = new THREE.Geometry();
        //         geo.vertices = nurbsCurve.getPoints(300);
        //         var mat = new THREE.LineBasicMaterial( { color: 0x333333, transparent: true } );
        //         // if(!extrude){
        //             edgeGeo = new THREE.Line(geo,mat);
        //             this.edgeGeos.add(edgeGeo);
        //         // }
        //     }
        // }
        geo.vertices = makeNurbs(contour,100,true);
        var mat = new THREE.LineBasicMaterial( { color: 0x333333, transparent: true } );
        edgeGeo = new THREE.Line(geo,mat);
        this.edgeGeos.add(edgeGeo);

        // console.log(geo);

        // if(extrude&&geo){
        //     for(var i = 0 ; i < geo.vertices.length ; i++){
        //         this.nurbsFlower.geometry.vertices.push(geo.vertices[i]);
        //     }
        //     return this.nurbsFlower;
        // }


        // for(var i = 0 ; i < contour.length ; i++){

        //     var geo = new THREE.Geometry();
        //     var mat = new THREE.LineBasicMaterial( {color:0x999999} );

        //     for(var j = 0 ; j < contour[i].length ; j++){
        //         geo.vertices.push(vertArray[i][j]);
        //     }
        //     edgeGeo = new THREE.Line(geo,mat);
        //     this.edgeGeos.add(edgeGeo);
        // }
    };

    this.purgeEdgeGeos = function(){

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

    this.drawEdges = function(){

        this.flattenEdges();
        this.sortEdges();

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
        
        lineParent.add(this.edgeGeos);
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

// function setStart(a,b){

//     //sets the first vertex to be the smallest in X
   
//     var t = 0;
//     var r = [];

//     if(a.vertices.length>0){
      
//         var min=1e6;
//         t=0;

//         for(var j in a.vertices){
//             // for(var i in b.vertices){
           
//                 if (a.vertices[j].distanceTo(b)<min){
//                     min = a.vertices[j].distanceTo(b);
//                     t=j;
//                 }
//             // }

//         }
//         // console.log(t);
//         var front = a.vertices.splice(t, Number.MAX_VALUE);

//         while(a.vertices.length>0){
//             front.push(a.vertices.shift());
//         }
//         front.unshift(front[front.length-1].clone())
//         a.vertices = front;
//     }
// }

// function slicesToSpiral(a){

//     var splines = [];

//     for(l in a){
//         var line = new THREE.SplineCurve3(a[l]);
//         splines.push(line);
//     }

//     var steps = 100;

//     var returner = [];

//     for(var s = 1 ; s < splines.length ; s++){

//         var r = [];

//         for(var i = 0 ; i < steps ; i++){
//             var p1 = splines[s].getPointAt(i/steps);
//             var p2 = splines[s-1].getPointAt(i/steps);
//             var p3 = p2.lerp(p1,i/steps);
//             returner.push(p3);
//         }
//         // returner.push(r);
//     }

//     return returner;
// }

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

    var output = ";FLAVOR:UltiGCode\n;TIME:1081      \n;MATERIAL:1177      \n;MATERIAL2:0         \n\n;Layer count: 170\n;LAYER:0\nM107\nG1 F9000 X20.360 Y20.859 Z0.300 E-2.0\n;TYPE:WALL-OUTER\n";

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


            X-=MinX;
            Y-=MinY;
            

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

                pX-=MinX;
                pY-=MinY;


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

/**
 * @author renej
 * NURBS utils
 *
 * See NURBSCurve and NURBSSurface.
 *
 **/


/**************************************************************
 *  NURBS Utils
 **************************************************************/

THREE.NURBSUtils = {

    /*
    Finds knot vector span.

    p : degree
    u : parametric value
    U : knot vector
    
    returns the span
    */
    findSpan: function( p,  u,  U ) {
        var n = U.length - p - 1;

        if (u >= U[n]) {
            return n - 1;
        }

        if (u <= U[p]) {
            return p;
        }

        var low = p;
        var high = n;
        var mid = Math.floor((low + high) / 2);

        while (u < U[mid] || u >= U[mid + 1]) {
          
            if (u < U[mid]) {
                high = mid;
            } else {
                low = mid;
            }

            mid = Math.floor((low + high) / 2);
        }

        return mid;
    },
    
        
    /*
    Calculate basis functions. See The NURBS Book, page 70, algorithm A2.2
   
    span : span in which u lies
    u    : parametric point
    p    : degree
    U    : knot vector
    
    returns array[p+1] with basis functions values.
    */
    calcBasisFunctions: function( span, u, p, U ) {
        var N = [];
        var left = [];
        var right = [];
        N[0] = 1.0;

        for (var j = 1; j <= p; ++j) {
       
            left[j] = u - U[span + 1 - j];
            right[j] = U[span + j] - u;

            var saved = 0.0;

            for (var r = 0; r < j; ++r) {

                var rv = right[r + 1];
                var lv = left[j - r];
                var temp = N[r] / (rv + lv);
                N[r] = saved + rv * temp;
                saved = lv * temp;
             }

             N[j] = saved;
         }

         return N;
    },


    /*
    Calculate B-Spline curve points. See The NURBS Book, page 82, algorithm A3.1.
 
    p : degree of B-Spline
    U : knot vector
    P : control points (x, y, z, w)
    u : parametric point

    returns point for given u
    */
    calcBSplinePoint: function( p, U, P, u ) {
        var span = this.findSpan(p, u, U);
        var N = this.calcBasisFunctions(span, u, p, U);
        var C = new THREE.Vector4(0, 0, 0, 0);

        for (var j = 0; j <= p; ++j) {
            var point = P[span - p + j];
            var Nj = N[j];
            var wNj = point.w * Nj;
            C.x += point.x * wNj;
            C.y += point.y * wNj;
            C.z += point.z * wNj;
            C.w += point.w * Nj;
        }

        return C;
    },


    /*
    Calculate basis functions derivatives. See The NURBS Book, page 72, algorithm A2.3.

    span : span in which u lies
    u    : parametric point
    p    : degree
    n    : number of derivatives to calculate
    U    : knot vector

    returns array[n+1][p+1] with basis functions derivatives
    */
    calcBasisFunctionDerivatives: function( span,  u,  p,  n,  U ) {

        var zeroArr = [];
        for (var i = 0; i <= p; ++i)
            zeroArr[i] = 0.0;

        var ders = [];
        for (var i = 0; i <= n; ++i)
            ders[i] = zeroArr.slice(0);

        var ndu = [];
        for (var i = 0; i <= p; ++i)
            ndu[i] = zeroArr.slice(0);

        ndu[0][0] = 1.0;

        var left = zeroArr.slice(0);
        var right = zeroArr.slice(0);

        for (var j = 1; j <= p; ++j) {
            left[j] = u - U[span + 1 - j];
            right[j] = U[span + j] - u;

            var saved = 0.0;

            for (var r = 0; r < j; ++r) {
                var rv = right[r + 1];
                var lv = left[j - r];
                ndu[j][r] = rv + lv;

                var temp = ndu[r][j - 1] / ndu[j][r];
                ndu[r][j] = saved + rv * temp;
                saved = lv * temp;
            }

            ndu[j][j] = saved;
        }

        for (var j = 0; j <= p; ++j) {
            ders[0][j] = ndu[j][p];
        }

        for (var r = 0; r <= p; ++r) {
            var s1 = 0;
            var s2 = 1;

            var a = [];
            for (var i = 0; i <= p; ++i) {
                a[i] = zeroArr.slice(0);
            }
            a[0][0] = 1.0;

            for (var k = 1; k <= n; ++k) {
                var d = 0.0;
                var rk = r - k;
                var pk = p - k;

                if (r >= k) {
                    a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
                    d = a[s2][0] * ndu[rk][pk];
                }

                var j1 = (rk >= -1) ? 1 : -rk;
                var j2 = (r - 1 <= pk) ? k - 1 :  p - r;

                for (var j = j1; j <= j2; ++j) {
                    a[s2][j] = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j];
                    d += a[s2][j] * ndu[rk + j][pk];
                }

                if (r <= pk) {
                    a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r];
                    d += a[s2][k] * ndu[r][pk];
                }

                ders[k][r] = d;

                var j = s1;
                s1 = s2;
                s2 = j;
            }
        }

        var r = p;

        for (var k = 1; k <= n; ++k) {
            for (var j = 0; j <= p; ++j) {
                ders[k][j] *= r;
            }
            r *= p - k;
        }

        return ders;
    },


    /*
    Calculate derivatives of a B-Spline. See The NURBS Book, page 93, algorithm A3.2.

    p  : degree
    U  : knot vector
    P  : control points
    u  : Parametric points
    nd : number of derivatives

    returns array[d+1] with derivatives
    */
    calcBSplineDerivatives: function( p,  U,  P,  u,  nd ) {
        var du = nd < p ? nd : p;
        var CK = [];
        var span = this.findSpan(p, u, U);
        var nders = this.calcBasisFunctionDerivatives(span, u, p, du, U);
        var Pw = [];

        for (var i = 0; i < P.length; ++i) {
            var point = P[i].clone();
            var w = point.w;

            point.x *= w;
            point.y *= w;
            point.z *= w;

            Pw[i] = point;
        }
        for (var k = 0; k <= du; ++k) {
            var point = Pw[span - p].clone().multiplyScalar(nders[k][0]);

            for (var j = 1; j <= p; ++j) {
                point.add(Pw[span - p + j].clone().multiplyScalar(nders[k][j]));
            }

            CK[k] = point;
        }

        for (var k = du + 1; k <= nd + 1; ++k) {
            CK[k] = new THREE.Vector4(0, 0, 0);
        }

        return CK;
    },


    /*
    Calculate "K over I"

    returns k!/(i!(k-i)!)
    */
    calcKoverI: function( k, i ) {
        var nom = 1;

        for (var j = 2; j <= k; ++j) {
            nom *= j;
        }

        var denom = 1;

        for (var j = 2; j <= i; ++j) {
            denom *= j;
        }

        for (var j = 2; j <= k - i; ++j) {
            denom *= j;
        }

        return nom / denom;
    },


    /*
    Calculate derivatives (0-nd) of rational curve. See The NURBS Book, page 127, algorithm A4.2.

    Pders : result of function calcBSplineDerivatives

    returns array with derivatives for rational curve.
    */
    calcRationalCurveDerivatives: function ( Pders ) {
        var nd = Pders.length;
        var Aders = [];
        var wders = [];

        for (var i = 0; i < nd; ++i) {
            var point = Pders[i];
            Aders[i] = new THREE.Vector3(point.x, point.y, point.z);
            wders[i] = point.w;
        }

        var CK = [];

        for (var k = 0; k < nd; ++k) {
            var v = Aders[k].clone();

            for (var i = 1; i <= k; ++i) {
                v.sub(CK[k - i].clone().multiplyScalar(this.calcKoverI(k,i) * wders[i]));
            }

            CK[k] = v.divideScalar(wders[0]);
        }

        return CK;
    },


    /*
    Calculate NURBS curve derivatives. See The NURBS Book, page 127, algorithm A4.2.

    p  : degree
    U  : knot vector
    P  : control points in homogeneous space
    u  : parametric points
    nd : number of derivatives

    returns array with derivatives.
    */
    calcNURBSDerivatives: function( p,  U,  P,  u,  nd ) {
        var Pders = this.calcBSplineDerivatives(p, U, P, u, nd);
        return this.calcRationalCurveDerivatives(Pders);
    },


    /*
    Calculate rational B-Spline surface point. See The NURBS Book, page 134, algorithm A4.3.
 
    p1, p2 : degrees of B-Spline surface
    U1, U2 : knot vectors
    P      : control points (x, y, z, w)
    u, v   : parametric values

    returns point for given (u, v)
    */
    calcSurfacePoint: function( p, q, U, V, P, u, v ) {
        var uspan = this.findSpan(p, u, U);
        var vspan = this.findSpan(q, v, V);
        var Nu = this.calcBasisFunctions(uspan, u, p, U);
        var Nv = this.calcBasisFunctions(vspan, v, q, V);
        var temp = [];

        for (var l = 0; l <= q; ++l) {
            temp[l] = new THREE.Vector4(0, 0, 0, 0);
            for (var k = 0; k <= p; ++k) {
                var point = P[uspan - p + k][vspan - q + l].clone();
                var w = point.w;
                point.x *= w;
                point.y *= w;
                point.z *= w;
                temp[l].add(point.multiplyScalar(Nu[k]));
            }
        }

        var Sw = new THREE.Vector4(0, 0, 0, 0);
        for (var l = 0; l <= q; ++l) {
            Sw.add(temp[l].multiplyScalar(Nv[l]));
        }

        Sw.divideScalar(Sw.w);
        return new THREE.Vector3(Sw.x, Sw.y, Sw.z);
    }

};


/**
 * @author renej
 * NURBS curve object
 *
 * Derives from Curve, overriding getPoint and getTangent.
 *
 * Implementation is based on (x, y [, z=0 [, w=1]]) control points with w=weight.
 *
 **/


/**************************************************************
 *  NURBS curve
 **************************************************************/

THREE.NURBSCurve = function ( degree, knots /* array of reals */, controlPoints /* array of Vector(2|3|4) */) {

    this.degree = degree;
    this.knots = knots;
    this.controlPoints = [];
    for (var i = 0; i < controlPoints.length; ++i) { // ensure Vector4 for control points
        var point = controlPoints[i];
        this.controlPoints[i] = new THREE.Vector4(point.x, point.y, point.z, point.w);
    }

};


THREE.NURBSCurve.prototype = Object.create( THREE.Curve.prototype );


THREE.NURBSCurve.prototype.getPoint = function ( t ) {

    var u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]); // linear mapping t->u

    // following results in (wx, wy, wz, w) homogeneous point
    var hpoint = THREE.NURBSUtils.calcBSplinePoint(this.degree, this.knots, this.controlPoints, u);

    if (hpoint.w != 1.0) { // project to 3D space: (wx, wy, wz, w) -> (x, y, z, 1)
        hpoint.divideScalar(hpoint.w);
    }

    return new THREE.Vector3(hpoint.x, hpoint.y, hpoint.z);
};


THREE.NURBSCurve.prototype.getTangent = function ( t ) {

    var u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]);
    var ders = THREE.NURBSUtils.calcNURBSDerivatives(this.degree, this.knots, this.controlPoints, u, 1);
    var tangent = ders[1].clone();
    tangent.normalize();

    return tangent;
};


