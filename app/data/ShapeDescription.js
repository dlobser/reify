define(function(){

	var ShapeData = function(){
		this.data = {};
		this._makeData();
		/*this.gui = new dat.GUI({
			width: 300,
			autoPlace : false
		});*/
	};

	ShapeData.prototype.set = function(data){
		for (var attr in data){
			if (this.data.hasOwnProperty(attr)){
				this.data[attr] = data[attr];
			}
		}
	};

	ShapeData.prototype.get = function(){
		var ret = {};
		for (var attr in this.data){
			var desc = this.Description[attr];
			var val = this.data[attr];
			if (desc.range === ShapeData.Range.NegativeOne){
				ret[attr] = Math.abs(val);
				ret[attr+"_sign"] = val > 0;
			} else {
				ret[attr] = val;
			}
		}
		return ret;
	};

	ShapeData.prototype._makeData = function(){
		for (var param in this.Description){
			var desc = this.Description[param];
			this.data[param] = desc.default || 0;
		}
	};

	/**
	 *  enumerable type describing possible ranges
	 *  of the 
	 *  @type {Object}
	 */
	ShapeData.Range = {
		NegativeOne : "negativeOne",
		Normal : "normal",
	};

	/**
	 *  the attributes that belong to a single core
	 *  @type {Object}
	 */
	ShapeData.prototype.Description = {
		"linearSpline" : {
			"range" : ShapeData.Range.Normal,
			"name" : "Linear Spline"
		},
		"baseTwist" : {
			"range" : ShapeData.Range.NegativeOne,
			"name" : "Base Twist"	
		},
		"bpSides" : {
			"range" : ShapeData.Range.Normal,
			"name" : "Side Count",
		},
		"bpSize" : {
			"range" : ShapeData.Range.Normal,
			"name" : "Base Size"	
		},
		"bpTwist" : {
			"range" : ShapeData.Range.NegativeOne,
			"name" : "Twist"	
		},
		"cbTwist" : {
			"range" : ShapeData.Range.NegativeOne,
			"name" : "Cube Twist"	
		},
		"tpPetals" : {
			"range" : ShapeData.Range.Normal,
			"name" : "Petal Count"	
		},
		"sinTri" : {
			"range" : ShapeData.Range.Normal,
			"name" : "Sine/Triangle"
		},
		"tpMult" : {
			"range" : ShapeData.Range.NegativeOne,
			"name" : "Turtle Mult"
		},
		"tpLoop" : {
			"range" : ShapeData.Range.NegativeOne,
			"name" : "Turtle Loop"
		},
		"tpTwist" : {
			"range" : ShapeData.Range.NegativeOne,
			"name" : "Turtle Weave"
		},
		"tpTwist2" : {
			"range" : ShapeData.Range.NegativeOne,
			"name" : "Turtle Twist 2"
		},
		"tpCornerMult" : {
			"range" : ShapeData.Range.Normal,
			"name" : "Corner Mult"
		},
		"xtraControls" : {
			"range" : ShapeData.Range.Normal,
			"name" : "subDiv Controls"
		},
		"xtraWaveMult" : {
			"range" : ShapeData.Range.NegativeOne,
			"name" : "subDiv Multiply"
		},
		"xtraZWaveFreq" : {
			"range" : ShapeData.Range.Normal,
			"name" : "subDiv ZFrequency"
		},
		"xtraXWaveFreq" : {
			"range" : ShapeData.Range.Normal,
			"name" : "subDiv XFrequency"
		},
		"xtraBulgeAmount" : {
			"range" : ShapeData.Range.Normal,
			"name" : "subDiv Bulge Amount"
		},
		"xtraBulgeFreq" : {
			"range" : ShapeData.Range.Normal,
			"name" : "subDiv Bulge Freq"
		},
		"xtraSinTri" : {
			"range" : ShapeData.Range.Normal,
			"name" : "subDiv WaveType"
		},
		"bulgeAmount" : {
			"range" : ShapeData.Range.NegativeOne,
			"name" : "Bulge Amount"
		},
		"bulgeFreq" : {
			"range" : ShapeData.Range.Normal,
			"name" : "Bulge Frequency"
		},
		"bulgeOff" : {
			"range" : ShapeData.Range.Normal,
			"name" : "Bulge Offset"
		},
		"bulgeSinTri" : {
			"range" : ShapeData.Range.Normal,
			"name" : "Bulge Wave Type"
		},
		"lean" : {
			"range" : ShapeData.Range.NegativeOne,
			"name" : "Lean"
		},
	};
	
	return new ShapeData();
});