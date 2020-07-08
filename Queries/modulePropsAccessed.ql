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
	DataFlow::ModuleImportNode getImpNode() { 
		result = impNode
	}
}

DataFlow::ModuleImportNode propRefIsModRef(DataFlow::PropRef pr) {
	exists(ModImportVar mv | pr.getBase().asExpr() = mv.getAnAccess() and result = mv.getImpNode())
}


// is the access path directly part of the source code we analyzed
predicate isLocal(Expr e) {
	not e.getTopLevel() instanceof Externs
}

// get all assignments to properties of modules
// and which are directly part of the analyzed source code
from DataFlow::PropRef  mp 
where isLocal(mp.asExpr()) 
select mp, mp.getBase(), propRefIsModRef(mp), mp.asExpr().getFile()

