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
        // scene.add(this.tree);
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
        // scene.add(this.tree);
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
        // scene.add(this.tree);
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
        // scene.add(this.tree);
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


simpleSquares = {

    setup:function(){

        var cGeo = new THREE.Object3D();
        cells = new Cells({extrude:false,parent:cGeo,amount:30});
        // cells.showFaces();
        cells.showLines();
        cells.make();
        // cells.showPoints();
        cells.makeFaces();
        cells.setScale(150);
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

layeredSquares = {

    setup:function(){

        var cGeo = new THREE.Object3D();
        this.cells = new Cells({extrude:true,parent:cGeo,amount:40});
        // cells.showFaces();
        // this.cells.showLines();
        this.cells.make();
        // cells.showPoints();
        // this.cells.makeFaces();
        this.cells.setScale(150);
        b = new Balls({numBalls:6});
        b.init();
        console.log(b);

        this.counter = 0;

    },

    draw:function(){

        this.counter++;

        if(this.counter>100)
            this.counter=0;

        if(typeof b === 'undefined')
            this.setup();
        else
            b.animate(this.counter*(1+data.var2*5));
        // console.log(b);
        this.cells.updatePoints(b.balls);
        // cells.drawNurbs();
        this.cells.off=this.counter*(.27/150);

        if(this.cells.getLineParent().children.length>100)
            this.cells.shiftLineParent();

        this.cells.drawContour();
        // cells.drawEdges();


    }
}
