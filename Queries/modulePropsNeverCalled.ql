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
}

// subclass of AccessPath that represents 
// properties of a required module 
class ModPropAP extends AccessPath {
	ModPropAP() {
		exists(ModImportVar mv, PropAccess pa | pa.getBase() = mv.getAnAccess() and this.getAnInstance() = pa)
	}
}

// checks if a module property access path never called, and never the base of a property access 
// if it's called: it's a function 
// if it's the base of a property access: it's an object
predicate modPropCouldBePrimitive( ModPropAP ap) {
	not exists(DataFlow::InvokeNode invk | invk.getInvokeExpr().getCallee() = ap.getAnInstance())
	and 
	not exists(PropAccess pa | pa.getBase() = ap.getAnInstance())
}

// is the access path directly part of the source code we analyzed
predicate isLocal(ModPropAP ap) {
	not ap.getAnInstance().getTopLevel() instanceof Externs
}

// get all access paths which represent module properties
// which could be primitives 
// and which are directly part of the analyzed source code
from ModPropAP ap
where modPropCouldBePrimitive(ap)
and isLocal(ap)
select ap