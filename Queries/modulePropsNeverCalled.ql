import javascript
import DataFlow
import AccessPaths

class ModImportVar extends Variable {
	DataFlow::ModuleImportNode impNode; 
	ModImportVar() {
		this.getAnAssignedExpr() = impNode.asExpr()
	}	
}

class ModPropAP extends AccessPath {
	ModPropAP() {
		exists(ModImportVar mv, PropAccess pa | pa.getBase() = mv.getAnAccess() and this.getAnInstance() = pa)
	}
}

// never called, and never the base of a property access 
predicate modPropCouldBePrimitive( ModPropAP ap) {
	not exists(DataFlow::InvokeNode invk | invk.getInvokeExpr().getCallee() = ap.getAnInstance())
	and 
	not exists(PropAccess pa | pa.getBase() = ap.getAnInstance())
}

predicate isLocal(ModPropAP ap) {
	not ap.getAnInstance().getTopLevel() instanceof Externs
}


from ModPropAP ap
where modPropCouldBePrimitive(ap)
and isLocal(ap)
select ap