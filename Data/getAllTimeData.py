import sys 
import pandas as pd 
import numpy as np 
import os

REL_TIME = "real"

def get_seconds( s):
	mins = float(s.split("m")[0])
	secs = float(s.split("m")[1].split("s")[0])
	return( mins*60 + secs)

def get_mean_time( filename):
	try:
		df = pd.read_csv( filename, sep="\t", header=None)
		df.columns = ["type", "time"]
		df["time"] = df.time.apply(lambda s: get_seconds(s)) 
		return( df[df.type == "real"].time.mean())
	except:
		return np.nan

def get_std_time( filename):
	try:
		df = pd.read_csv( filename, sep="\t", header=None)
		df.columns = ["type", "time"]
		df["time"] = df.time.apply(lambda s: get_seconds(s)) 
		return( df[df.type == "real"].time.std())
	except:
		return np.nan

def printDFToFile( df, filename):
	f = open(filename, 'w');
	f.write(df.to_csv(index = False))
	f.close()


if len( sys.argv) != 2:
	print("Usage: python3 getAllTimeData.py num_runs")
else:
	num_runs = sys.argv[1]
	all_files = [f for f in os.listdir() if f.find("time_") > -1 and f.find("_" + num_runs + "runs.out") > -1]
	proj_names = [f[len("time_") : -len("_" + num_runs + "runs.out")] for f in all_files]
	ret_frame = pd.DataFrame(proj_names, columns=["project"])
	ret_frame["time"] = ret_frame.project.apply( lambda p: get_mean_time("time_" + p + "_" + num_runs + "runs.out"))
	ret_frame["stdev"] = ret_frame.project.apply( lambda p: get_std_time("time_" + p + "_" + num_runs + "runs.out"))
	ret_frame.dropna(inplace=True)
	print(ret_frame)
	printDFToFile( ret_frame, "timed_projects.csv")
