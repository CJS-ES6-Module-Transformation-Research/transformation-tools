import javascript

predicate moduleHasOnlyDefaultExport(ES2015Module esmMod) {
  exists(ExportDefaultDeclaration expDecl | expDecl = esmMod.getAnExport()) 
  and 
  not exists(ExportNamedDeclaration expDecl | expDecl = esmMod.getAnExport())
}

predicate moduleHasOnlyNamedExport(ES2015Module esmMod) {
  not exists(ExportDefaultDeclaration expDecl | expDecl = esmMod.getAnExport()) 
  and 
  exists(ExportNamedDeclaration expDecl | expDecl = esmMod.getAnExport())
}

predicate moduleHasBothDefaultAndNamedExports(ES2015Module esmMod) {
  exists(ExportDefaultDeclaration expDecl | expDecl = esmMod.getAnExport()) 
  and 
  exists(ExportNamedDeclaration expDecl | expDecl = esmMod.getAnExport())
}

from ES2015Module esmMod
where moduleHasBothDefaultAndNamedExports(esmMod)
select esmMod.getFile()

