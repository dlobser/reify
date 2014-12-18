define(["dat"], function(dat){

	var gui = new dat.GUI();

	console.warn("using global info object");

	/**
	 *  put dummy variables in here
	 */
	var localInfo = window.info = {
		"var1" : 0.1, //extra ctrls amount
		"var2" : 0.1, //extra wave offset
		"var3" : 0.1, //ctrl multiplier
		"var4" : 0.1, //extra wave frequency
		"var4b" : 0.1, //extra wave frequency
		"var4c" : 0.1, //extra wave frequency
		"var4d" : 0.1, //extra wave frequency
		"var5" : 0.1, //sin to triangle wave along length
		"var6" : 0.1, //mover
		"var7" : 0.1, //bulge freq
		"var8" : 0.1, //bulge offset
		"var9" : 0.1, //bulge amount
		"var10" : 0.0, //sin to tri
	};

	var dummies = gui.addFolder("Dummies");
	for (var param in localInfo){
		dummies.add(localInfo, param);
	}

	dummies.open();
	gui.open();
	
	return localInfo;
});