import javascript
import DataFlow
import AccessPaths

// subclass of Variable that represents variables that 
// store the result of a require
// note that this is not to do with ES6 imports; we're only
// looking for variables storing required modules
class ModImportVar extends Variable {
	DataFlow::ModuleImportNode impNode; 
	ModImportVar() {
		this.getAnAssignedExpr() = impNode.asExpr() 
	}	

	string getModPath() { 
		result = impNode.getPath()
	}
}

// subclass of AccessPath that represents 
// properties of a required module (or any of its subproperties)
class ChainedModProp extends AccessPath {
	string modPath;
	ChainedModProp() {
		exists(ModImportVar mv, PropAccess pa | this.getAnInstance() = pa 
												and this.getBasePath().getAnInstance() = mv.getAnAccess()
												and modPath = mv.getModPath())
	}

	string getModPath() { 
		result = modPath
	}
}

// assignments to a property of a module 
class ModPropAssign extends Assignment {
	ChainedModProp modPropBase;
	ModPropAssign() {
		this.getLhs() = modPropBase.getAnInstance()
	}

	ChainedModProp getModPropBase() { 
		result = modPropBase
	}

	string getModPath() { 
		result = modPropBase.getModPath()
	}
}

// is the access path directly part of the source code we analyzed
predicate isLocal(AccessPath ap) {
	not ap.getAnInstance().getTopLevel() instanceof Externs
}

bindingset[modPath]
predicate multiImportModule(string modPath) {
	count( DataFlow::ModuleImportNode impNode | impNode.getPath() = modPath) > 1
}

// get all assignments to properties of modules
// and which are directly part of the analyzed source code
from ModPropAssign mp 
where isLocal(mp.getModPropBase()) 
and multiImportModule(mp.getModPath())
select mp

