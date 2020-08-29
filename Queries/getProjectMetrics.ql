import javascript

class LocalFile extends File {
  LocalFile() {
    not this.getATopLevel().isExterns()
  }
}

class LocalAnalyzedModule extends AnalyzedModule {
  LocalAnalyzedModule() {
  	this.getFile() instanceof LocalFile 	   
  }
}

int getNumLOC() {
	result = sum( any(LocalFile f).getNumberOfLinesOfCode())
}

int getNumJSFiles() {
	result = count( LocalFile f | f.getExtension() = "js")
}

int getNumRequires() {
	result = count( Require r | r.getFile() instanceof LocalFile)
}

int getNumExports() {
	result = sum( count(string s | exists(LocalAnalyzedModule am | exists(am.getAnExportedValue(s)))))	
}

select getNumLOC(), getNumJSFiles(), getNumRequires(), getNumExports() 
