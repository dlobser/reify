define(["ModelGenerator/interface/GUI"], function(GUI){

	/**
	 *  enumerable type describing possible ranges
	 *  of the 
	 *  @type {Object}
	 */
	var Range = {
		NegativeOne : "negativeOne",
		Normal : "normal",
	};

	//////////////////////////////////
	/// DATA
	//////////////////////////////////

	/**
	 *  The number of cores the object has
	 *  @type {Number}
	 *  @const
	 */
	var CoreCount = 2;

	/**
	 *  the attributes that belong to a single core
	 *  @type {Object}
	 */
	var CoreDescription = {
		"linearSpline" : {
			"range" : Range.Normal,
			"name" : "Linear Spline"
		},
		"bpSides" : {
			"range" : Range.Normal,
			"name" : "Side Count",
		},
		"bpSize" : {
			"range" : Range.Normal,
			"name" : "Base Size"	
		},
		"bpTwist" : {
			"range" : Range.NegativeOne,
			"name" : "Twist"	
		},
		"cbTwist" : {
			"range" : Range.NegativeOne,
			"name" : "cbTwist"	
		},
		"cbTwistX" : {
			"range" : Range.NegativeOne,
			"name" : "cbTwistX"	
		},
		"cbTwistY" : {
			"range" : Range.NegativeOne,
			"name" : "cbTwistY"	
		},
		"cbTwistZ" : {
			"range" : Range.NegativeOne,
			"name" : "cbTwistZ"	
		},
		"cbWobbleMult" : {
			"range" : Range.Normal,
			"name" : "Wobble Mult"	
		},
		"cbWobbleFreq" : {
			"range" : Range.Normal,
			"name" : "Wobble Freq"	
		},
		"tpPetals" : {
			"range" : Range.Normal,
			"name" : "Petal Count"	
		},
		"sinTri" : {
			"range" : Range.Normal,
			"name" : "Sine<->Triangle"	
		},
		"tpMult" : {
			"range" : Range.NegativeOne,
			"name" : "Turtle Mult"	
		},
		"tpLoop" : {
			"range" : Range.NegativeOne,
			"name" : "Turtle Loop"	
		},
		"tpTwist" : {
			"range" : Range.NegativeOne,
			"name" : "Turtle Twist"	
		},
		"tpTwist2" : {
			"range" : Range.NegativeOne,
			"name" : "Turtle Twist 2"	
		},
		"tpCornerMult" : {
			"range" : Range.NegativeOne,
			"name" : "Corner Mult"	
		},
	};

	/**
	 *  the attributes that belong to a base
	 *  @type {Object}
	 */
	var BaseDescription = {
		"twist" : {
			"range" : Range.NegativeOne,
			"name" : "Twist"	
		},
		"offset" : {
			"range" : Range.Normal,
			"name" : "Offset"
		},
	};

	//////////////////////////////////
	/// GUI CREATION
	//////////////////////////////////

	function addBaseData(obj){
		var base = obj.base = {};
		for (var param in BaseDescription){
			base[param] = 0;//Math.random()*.02;
		}
	}

	function addCoreData(obj, coreCount){
		var cores = obj.cores = [];
		for (var i = 0; i < coreCount; i++){
			var core = {};
			for (var param in CoreDescription){
				core[param] = 0;//Math.random()*.02;
			}
			cores.push(core);
		}
	}

	function createDataObject(){
		var obj = {};
		addBaseData(obj);
		addCoreData(obj, CoreCount);
		return obj;
	}

	var obj = createDataObject();
	console.log(JSON.stringify(obj, undefined, "\t"));

	return obj;
});