define(["ModelGenerator/interface/ShapeSliders"], function(GUI){

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
	 *  The number of cores the DataObject has
	 *  @type {Number}
	 *  @const
	 */
	var CoreCount = 1;

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
			"name" : "Sine/Triangle"
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
			"range" : Range.NegativeOne,
			"name" : "Offset"
		},
	};

	//////////////////////////////////
	/// GUI CREATION
	//////////////////////////////////

	function addBaseData(obj){
		var base = obj.base = {};
		var folder = GUI.addFolder("Base");
		folder.open();
		for (var param in BaseDescription){
			var desc = BaseDescription[param];
			GUI.addSlider(folder, base, param, desc);
		}
	}

	function addCoreData(obj, coreCount){
		var cores = obj.cores = [];
		var top = GUI.addFolder("Cores");
		top.open();
		for (var i = 0; i < coreCount; i++){
			var core = {};
			var folder = GUI.addFolder(i, top);
			folder.open();
			for (var param in CoreDescription){
				core[param] = 0.0;
				var desc = CoreDescription[param];
				GUI.addSlider(folder, core, param, desc);
			}
			cores.push(core);
		}
	}

	function createDataObject(){
		var DataObj = {};
		addBaseData(DataObj);
		addCoreData(DataObj, CoreCount);
		return DataObj;
	}

	var DataObj = createDataObject();

	//////////////////////////////////
	/// GET THE OBJECT
	//////////////////////////////////

	function getObject(){
		var ret = {};
		ret.base = {};
		ret.cores = [];
		getBase(ret.base);
		getCores(ret.cores);		
		return ret;
	}

	function getCores(retObj){
		var cores = DataObj.cores;
		for (var i = 0; i < cores.length; i++){
			var core = cores[i];
			var coreObj = retObj[i] = {};
			for (var param in core){
				var val = core[param];
				var desc = CoreDescription[param];
				if (desc.range === Range.NegativeOne){
					coreObj[param] = Math.abs(val);
					coreObj[param+"_sign"] = val > 0;
				} else {
					coreObj[param] = val;
				}
			}
		}
	}

	function getBase(retObj){
		var base = DataObj.base;
		for (var param in base){
			var val = base[param];
			var desc = BaseDescription[param];
			if (desc.range === Range.NegativeOne){
				retObj[param] = Math.abs(val);
				retObj[param+"_sign"] = val > 0;
			} else {
				retObj[param] = val;
			}
		}
	}

	return DataObj;
});