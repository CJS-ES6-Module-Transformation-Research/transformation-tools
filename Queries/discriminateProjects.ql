import javascript
import DataFlow
import ES20xxFeatures

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
  hasUseOfArgsCallerOrCallee() and result = "arguments.callee and arguments.caller should not be used"
}

string projectResult() {
 result = projectViolatesCondition() 
  or (not exists(projectViolatesCondition()) and result = "project is ok for transformation")
}

// either get a list of the violations
// or, if there are none, list the "project is ok for transformation"
select projectResult()

