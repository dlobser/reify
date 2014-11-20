## STYLE GUIDE

Indentation : tabs (4 spaces)

## OBJECTS

Define Classes using function and methods on the function's prototype. 

Include a ```dispose``` method which cleans up all memory which the object allocated. 

Include a docblock comment at the top describing what the class does

```javascript

/**
 *  This is an example class
 *  @param {string} params 
 */
var Obj = function(params){
	//stuff
};

Obj.prototype.method = function(){
	//functionality	
};

Obj.prototype.dispose = function(){
	//clean up	
};
```

Include only a single class per file. If the class requires a helper class which should remain private or is minimal, it can be included in the same file. 

## FILES/FOLDER NAMING

All files should begin with a capitol and all folders should be lowercase. 

```
app/
	submodule/
		Mod0.js
		Mod1.js
	Main.js
```

## BEST PRACTICES

Loose-Coupling between modules. 

Changes should hopefully only need to be made in one place. 

Hierarchical patterns good: one class constructors child classes, etc. 

For non-hierarchical singletons, use a mediator/event pattern. 

Consistent interfaces. for example: classes which use a DOM element as a container, should take that element as the first argument. 