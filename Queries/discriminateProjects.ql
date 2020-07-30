import javascript
import DataFlow
import ES20xxFeatures
import semmle.javascript.DynamicPropertyAccess

class LocalFile extends File {
  LocalFile() {
    not this.getATopLevel().isExterns()
  }
}

predicate hasOctal() {
  exists(Literal l | l.getRawValue().regexpMatch("^0[bo].*") and l.getFile() instanceof LocalFile)
}

predicate hasWithStmt() {
  exists(WithStmt ws | ws.getFile() instanceof LocalFile)
}

// note: if we're going to disallow deletion of specific properties like Object.prototype, this can easily 
// be added as another condition in this predicate
predicate hasDeleteVar() {
 exists(DeleteExpr de | (not de.getOperand().stripParens() instanceof PropAccess) and de.getFile() instanceof LocalFile) // can only delete properties 
}

predicate hasIllegalRedefinition() {
 exists( VarDef vd | (vd.getAVariable().getName() = "eval"
      // redefinition of arguments inside of a function 
    or (vd.getAVariable().getName() = "arguments" and vd.getTarget().getParentExpr*().getContainer() instanceof Function))
      and vd.getFile() instanceof LocalFile
  )
}

predicate hasIllegalReassignment() {
  exists( AssignExpr ae| (ae.getLhs() = DataFlow::globalVarRef("eval").asExpr() // reassigning eval
      or exists(ArgumentsVariable av | ae.getLhs() = av.getAnAccess())) // reassigning arguments
        and ae.getFile() instanceof LocalFile
  )
}

predicate hasES20xxFeatures() {
 exists(ASTNode an | isES20xxFeature(an, _, _) and an.getFile() instanceof LocalFile) 
}

predicate hasFunctionDeclInsideIf() {
  exists( IfStmt s, FunctionDeclStmt fdecl | s = fdecl.getParentStmt*() and s.getFile() instanceof LocalFile)
}

// for example: function f(a, a, b)
predicate hasFunctionWithDuplicateParamName() {
 exists( Function f | exists(int i, int j | f.getParameter(i).getName() = f.getParameter(j).getName() and not i = j) 
   and f.getFile() instanceof LocalFile)
}

predicate hasAssignmentToUndeclaredVar() {
 exists( AssignExpr ae, Variable v | ae.getLhs() = v.getAnAccess() and 
      not exists(VarDecl vd | vd.getVariable() = v)  
          and ae.getFile() instanceof LocalFile
  )
}

predicate hasAssigningThisToGlobalVar() {
 exists( GlobalVariable gv, ThisExpr ae | gv.getAnAssignedExpr() = ae and ae.getFile() instanceof LocalFile)
}

// this is a query that already exists 
// https://github.com/github/codeql/blob/master/javascript/ql/src/LanguageFeatures/ArgumentsCallerCallee.ql
// looking for: using arguments.caller or arguments.callee 
predicate hasUseOfArgsCallerOrCallee() {
  exists(PropAccess acc, ArgumentsVariable args | 
    acc.getBase() = args.getAnAccess() and
    acc.getPropertyName().regexpMatch("caller|callee") and
    // don't flag cases where the variable can never contain an arguments object
    not exists(Function fn | args = fn.getVariable()) and
    not exists(Parameter p | args = p.getAVariable()) and
    // arguments.caller/callee in strict mode causes runtime errors,
    // this is covered by the query 'Use of call stack introspection in strict mode'
    not acc.getContainer().isStrict() and
    acc.getFile() instanceof LocalFile
  )
}

// --------------------------------------------------------------------------------------------- other problems than strict mode

class ModuleExportsNode extends DataFlow::Node {
  ModuleExportsNode() {
    this.(DataFlow::PropRef).getBase().asExpr() instanceof ModuleAccess and 
    this.(DataFlow::PropRef).getPropertyName() = "exports" 
  }
}


predicate hasEvalCall() { 
  exists(CallExpr ce | ce.getCalleeName() = "eval" and ce.getFile() instanceof LocalFile )
}

predicate accessRequireFields() {
  exists( DataFlow::PropRef pr | pr.getBase().asExpr().toString() = "require" and pr.getFile() instanceof LocalFile)
}

predicate accessModuleFields() {
  exists( DataFlow::PropRef pr | pr.getBase().asExpr().toString() = "module" and 
                       not pr.getPropertyName() = "exports" and
                       pr.getFile() instanceof LocalFile)
}

predicate accessProcessMainModule() {
  exists( DataFlow::PropRef pr | pr.getBase().asExpr().toString() = "process" and 
                       pr.getPropertyName() = "mainModule" and
                       pr.getFile() instanceof LocalFile)
}

predicate dynamicModuleExport() {
  exists( DynamicPropRead dpr | dpr.getBase() instanceof ModuleExportsNode and dpr.getFile() instanceof LocalFile)
}

predicate conditionalExport() { 
  exists( DataFlow::PropWrite pw | pw instanceof ModuleExportsNode and
                       pw.asExpr().getEnclosingStmt().getParentStmt*() instanceof ControlStmt and 
                       pw.getFile() instanceof LocalFile)
}

predicate exportInFunction() {
  exists( DataFlow::PropWrite pw | pw instanceof ModuleExportsNode and
                       pw.asExpr().getEnclosingStmt().getParentStmt*() instanceof FunctionDeclStmt and 
                       pw.getFile() instanceof LocalFile)  
}

predicate exportsInPkgJSON() {
  exists(PackageJSON pkgj | exists(pkgj.getPropValue("exports")) and pkgj.getFile() instanceof LocalFile) 
}

predicate nonstringRequireArg() {
   exists(CallExpr ce | ce.getCalleeName() = "require" and (not exists(ce.getAnArgument().getStringValue())) and ce.getFile() instanceof LocalFile)
}

string projectViolatesCondition() {
  hasOctal() and result = "has an octal literal" or 
  hasWithStmt() and result = "has a with statement" or
  hasDeleteVar() and result = "can only use delete on properties" or 
  hasIllegalRedefinition() and result = "has a redefinition of eval, or arguments inside a function" or
  hasIllegalReassignment() and result = "has a reassignment of eval, or arguments inside a function" or
  //hasES20xxFeatures() and result = "has ES20xx features" or
  hasFunctionDeclInsideIf() and result = "has a function declaration inside an if statement" or
  hasFunctionWithDuplicateParamName() and result = "has a function with multiple parameters of the same name (e.g. function f(a, a, b))" or 
  hasAssignmentToUndeclaredVar() and result = "has assignment to an undeclared variable" or
  hasAssigningThisToGlobalVar() and result = "has an assignment of \"this\" to a global variable" or
  hasUseOfArgsCallerOrCallee() and result = "arguments.callee and arguments.caller should not be used" or 
  hasEvalCall() and result = "eval is called: behaviour will change in ESM" or 
  accessRequireFields() and result = "accessing fields of require that dont exist in ESM" or
  accessModuleFields() and result = "accessing fields of module that dont exist in ESM" or 
  accessProcessMainModule() and result = "accessing process.mainModule" or 
  dynamicModuleExport() and result = "has a dynamic module export, module.exports[e] = o" or 
  conditionalExport() and result = "has a conditional export" or 
  exportInFunction() and result = "has an export in a function" or 
  exportsInPkgJSON() and result = "has an exports field in a package.json" or 
  nonstringRequireArg() and result = "has a require with a non-string module specifier"
}

string projectResult() {
 result = projectViolatesCondition() 
  or (not exists(projectViolatesCondition()) and result = "project is ok for transformation")
}

// either get a list of the violations
// or, if there are none, list the "project is ok for transformation"
select projectResult()

