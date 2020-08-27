import sys
import json

CJS_METRICS_FILENAME = "exports.report.js.txt"
SANITIZE_METRICS_FILENAME = "sanitize.report.js.txt"
EXPORTS_METRICS_FILENAME = "esmExports.report.js.txt"
IMPORTS_METRICS_FILENAME = "imports.etc..report.js.txt"
DEFAULT_IMP_FILENAME = "importInfo_pt2.report.js.txt"

class ProjectMetrics:
	
	def __init__( self, proj_name):
		self.proj_name = proj_name
	
	# change this if you want a different presentation of the metrics 
	def __str__( self):
		return( 
			str(self.proj_name) + "; " +
			# CJS metrics: 
			str(self.namedExports) + "; " + 
			str(self.defaultExports) + "; " +
			str(self.requireTotal) + "; " +  
			# sanitize metrics: 
			str(self.accessReplace) + "; " + 
			str(self.filenameCount) + "," + str(self.dirnameCount) + "; " + 
			str(self.sanitizedRequireTotal) + "; " + 
			# ESM export metrics:
			str(self.esmNamedExports) + "; " + 
			str((self.esmDefaultExports + self.esmForcedDefaultExports)) + " (" + str(self.esmForcedDefaultExports) + ") ; " + 
			#  ESM import metrics:
			str(self.importNAMES) + "; " + 
			str(self.importDefault) + " (" + str(self.importForcedDefault) + ") ; " + 
			str(self.copyByValue)
			)

def get_forced_default_import():
	with open( DEFAULT_IMP_FILENAME) as f:
		data = json.load(f)
	f.close()
	forced_def_paths = [ k["relativizedImportString"] for f in data for k in data[f]]
	return( len( set( forced_def_paths)))

def get_all_metrics( proj_name):
	ret_obj = ProjectMetrics( proj_name)
	# get the CJS metrics
	with open( CJS_METRICS_FILENAME) as f:
		data = json.load(f)
	f.close()
	ret_obj.namedExports = data["namedExports"]
	ret_obj.defaultExports = data["defaultExports"]
	# get the sanitize metrics
	with open( SANITIZE_METRICS_FILENAME) as f:
		data = json.load(f)
	f.close()
	ret_obj.requireTotal = data["requireTotal"]
	ret_obj.accessReplace = data["accessReplace"]
	ret_obj.filenameCount = data["filenaemCount"]
	ret_obj.dirnameCount = data["dirnameCount"]
	ret_obj.sanitizedRequireTotal = data["sanitizedRequireTotal"]
	# get the ESM export metrics
	with open( EXPORTS_METRICS_FILENAME) as f:
		data = json.load(f)
	f.close()
	ret_obj.esmNamedExports = data["esmNamedExports"]
	ret_obj.esmDefaultExports = data["esmDefaultExports"]
	ret_obj.esmForcedDefaultExports = data["esmForcedDefaultExports"]
	# get the ESM export metrics
	with open( IMPORTS_METRICS_FILENAME) as f:
		data = json.load(f)
	f.close()
	ret_obj.importNAMES = data["importNAMES"]
	ret_obj.importDefault = data["importDefault"]
	ret_obj.importForcedDefault = get_forced_default_import()
	ret_obj.copyByValue = data["copyByValue"]
	return( ret_obj)


if len( sys.argv) != 3:
	print("Usage: python3 collectData.py proj_name append_file")
else:
	proj_name = sys.argv[1]
	append_file = sys.argv[2]
	out_obj = get_all_metrics( proj_name)
	with open( append_file, 'a') as f:
		f.write( str(out_obj) + "\n")
	f.close()