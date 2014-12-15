define(["THREE","jquery","ModelGenerator/data/ShapeDescription"], 
function (THREE,$,shapeData) {


	var UI = function(args){

		if(!args) args = {};

		this.vectors = args.vectors || [];
		this.ctrlArray = args.ctrlArray || [[]];
		this.res = args.res || 300;
		this.setCtrl();
		// this.ctrls = args.ctrlArray[0] || [];
		// this.scaledCtrls = [];
		// this.setCtrl = args.setCtrl || [];
		this.ctrlAmount = args.ctrlAmount || 10;
		
		this.setVec = args.setVec || [];
		this.lerpColors = [];

		this._drawLine = false;
		this._moveCtrl = -1;

		

		this.init(this.res,this.res);

		this.Utils = util;


		// Interface.Interface.UI.isDrawing = false;

		// this.staticDrawing = function(){
		// 	return Interface.Interface.UI.isDrawing;
		// };

	}

	var util = {

		dist:function(a,b){
			var X = Math.abs(a.x - b.x);
			var Y = Math.abs(a.y - b.y);
			return Math.sqrt((X*X)+(Y*Y));
		},

		lerp:function(a,b,t){
			return a + ((b-a)*t);
		},

	};


	UI.prototype = {

		init:function(x,y){

			this.width = x || 300;
			this.height = y || 300;

			var makeString = '<canvas id="canvasID" style="position:relative"></canvas>'

			var self = this;

			var func = function(){
				var options = document.getElementById('target').options;
				this.setCtrl(options.selectedIndex);
			}

			var list = $('<select id="target">').appendTo("#other");
			
			for(var i = 0 ; i < this.ctrlArray.length ; i++){
				var st = ""+this.ctrlArray[i].name;
				list.append($('<option value="' + this.ctrlArray[i].name + '">').text(st));
			}

			$( "#target" ).change(func.bind(this));

			list.css({
				"z-index" : 1000,
				"background-color" : "white",
				"position" : "absolute"
			});

			var cDiv = document.getElementById('canvasDiv').innerHTML = makeString ; // replaces the inner HTML of #someBox to a canvas

			this.cDiv = document.getElementById('canvasDiv');
			this.c = document.getElementById('canvasID');
			this.c.width = this.width;
			this.c.height = this.height;
			this.ctx = this.c.getContext("2d");
			// this.setVectors();
			this.addEventListeners();
			this.drawVectors();

			console.log(this.ctrls);
		},


		animate:function(){
			requestAnimationFrame(this.animate.bind(this));
			this.background();
			this.drawVectors();
		},


		addEventListeners:function(){

			var that = this;

			this.c.addEventListener('mousedown', function (evt) {
				that._drawLine = true;
				UI.isDrawing = true;
			}, false);

			this.c.addEventListener('mouseup', function (evt) {
				that._drawLine = false;
				UI.isDrawing = false;
				that._moveCtrl = -1;
			}, false);

			this.c.addEventListener ("mouseout", function (evt) {
				// that._drawLine = false;
				// Interface.UI.isDrawing = false;
				// that._moveCtrl = -1;
				console.log('out');
			},false);

			this.c.addEventListener('mousemove', function (evt) {

				var mousePos = that.getMousePos(evt);
			// that.mouseOut = false;

				if (that._drawLine) {
					for(var i = 0 ; i < that.ctrls.length ; i++){
						var vec = that.scaledCtrls[i];
						// vec.x/=2;
						// console.log(util.dist(mousePos,vec));
						// if(that._moveCtrl>-1)
						// 	i=that._moveCtrl;
						if( util.dist(mousePos,vec)<10 || that._moveCtrl == i){
							vec.x = mousePos.x;
							// that.ctrls[i].y = mousePos.y;
							that._moveCtrl = i;
							// that.ctrls[i].x = vec.x/this.res;
							i=that.ctrls.length;

						}
					}
				}

			}, false);
		},

		getVecs : function(arr){

			var r = arr || [];

			for(var i = 0 ; i < this.ctrls.length ; i++){
				r.push(new THREE.Vector3(
					this.ctrls[i].x/this.res,
					this.ctrls[i].y/this.res,
					this.ctrls[i].z/this.res));
			}

			var s = new THREE.SplineCurve3(r);

			return s;

		},

		getMousePos:function(evt){
			var rect = this.c.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};		
		},

		// setVectors:function() {

		// 	var nums =  this.setCtrl || [0,55,0,32,22,0,78,9,0,119,28,0,130,65,0,119,100,0,98,128,0,64,144,0,30,136,0,0,121,0];

		// 	var q = -1;

		// 	for (var i = 0; i < this.setCtrl.length/3; i++) {
		// 		var vec = {};
		// 		vec.x = nums[++q];//150 + ((1 + Math.cos((i / 9) * Math.PI * 2)) / 2) * -150; //Math.sin(i+cd);//*1+Math.sin(i*.032+(i/100)*pi*20)*.1;
		// 		vec.y = nums[++q];//i * 75 / 5; //*1+Math.cos(i*.032+(i/100)*pi*20)*.1;
		// 		vec.z = nums[++q];//0;
		// 		this.ctrls.push(vec);
		// 		this.vectors.push(vec);
		// 	}

		// 	console.log(this.ctrls);
	
		// },

		setCtrl:function(id){

			var ID = id || 0;
			this.ctrls = this.ctrlArray[ID];
			this.scaleCtrls();

		},

		applyScale:function(){

			for(var i = 0 ; i < this.ctrls.length ; i++){
				var vec = this.scaledCtrls[i].clone();
				vec.divideScalar(this.res);
				vec.x*=2;
				this.ctrls[i] = vec;
			}

			return this.ctrls;

		},

		scaleCtrls:function(){

			if(typeof this.scaledCtrls == 'undefined')
				this.scaledCtrls = [];

			for(var i = 0 ; i < this.ctrls.length ; i++){
				var vec = this.ctrls[i].clone();
				vec.x*=.5;
				vec.multiplyScalar(this.res);
				this.scaledCtrls[i] = vec;
			}
		},

		background:function(color){
			var col = color || "#558899";
			this.ctx.clearRect(0, 0, this.width,this.height);
			this.ctx.fillStyle = col;
			this.ctx.fillRect(0, 0, this.width,this.height);
		},

		drawVectors: function() {

			// this.ctx.clearRect(0, 0, 150, 150);
			// this.ctx.fillStyle = "#558899";
			// this.ctx.fillRect(0, 0, 150, 150);

			for (var i = 1; i < this.ctrls.length; i++) {
				this.ctx.beginPath();
				var vec = this.scaledCtrls[i - 1].clone();
				// vec.multiplyScalar(this.res);
				this.ctx.lineTo(vec.x, vec.y);
				var vec = this.scaledCtrls[i].clone();
				// vec.multiplyScalar(this.res);
				this.ctx.lineTo(vec.x, vec.y);
				this.ctx.stroke();

			}
			for(var i = 0 ; i < this.ctrls.length ; i++){
				this.ctx.save();
				var vec = this.scaledCtrls[i].clone();
				this.ctx.transform(1,0,0,1,vec.x,vec.y);
				this.ctx.beginPath();
				this.ctx.arc(0,0, 5, 0, 2 * Math.PI, false);
				this.ctx.fillStyle = "#ffffff";
				this.ctx.fill();
				this.ctx.stroke();
				this.ctx.restore();
			}
		},

		update:function(){

			if(this._drawLine)
				console.log(this.ctrls);
		},

	}

	return UI;

});
