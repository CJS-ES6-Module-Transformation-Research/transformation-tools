import javascript
import DataFlow

// In CommonJS, primitive properties of module.exports are exported as *values*, while
// in ESM they are exported as references. This means that we see inconsistent behaviour in the
// following scenarios:
// CommonJS: 
// var x = 1;
// function inc() { ++x; }
// module.exports.inc = inc
// module.exports.x = x;
// 
// ESM
// var x = 1;
// function inc() { ++ x; }
// export {inc, x}
//
// uses:
// CommonJS
// const mod = require("module");
// console.log(mod.x); // prints 1
// mod.inc();	       // modifies the x internal to mod, but mod.x is not a pointer to this x (since x is a primitive)
// console.log(mod.x); // prints 1
//
// ESM
// import * as mod from "module";
// console.log(mod.x); // prints 1
// mod.inc(); 	       // now, mod.x is a pointer to the internal x
// console.log(mod.x); // prints 2


// for a given node n and variable v, determines if this 
// node represents a primitive export for which 
// there is ALSO an access inside a function 
// to be on the conservative side, assume any access in a function 
// can lead to a problem
predicate hasPrimitiveModifiedExport(DataFlow::Node n, Variable v) {
	exists(DataFlow::AnalyzedModule m, string s | 
			n.(DataFlow::AnalyzedNode).getAValue() = m.getAnExportedValue(s) and 
			m.getAnExportedValue(s) instanceof DataFlow::PrimitiveAbstractValue and 
			n.asExpr() = v.getAnAccess() and
			v.getAnAccess().getContainer() instanceof Function
		)
}

// get the file and variable matching to this potential
// primitive modified export 
from File f, Variable v
where exists(DataFlow::AnalyzedNode n | n.asExpr().getFile() = f and hasPrimitiveModifiedExport(n, v))
select f, v
