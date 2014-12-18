define(["dat"], function(dat){

	var gui = new dat.GUI();

	console.warn("using global info object");

	/**
	 *  put dummy variables in here
	 */
	var localInfo = window.info = {
		"var1" : 0.1,
		"var2" : 0.1,
		"var3" : 0.1
	};

	var dummies = gui.addFolder("Dummies");
	for (var param in localInfo){
		dummies.add(localInfo, param);
	}

	dummies.open();
	gui.open();
	
	return localInfo;
});