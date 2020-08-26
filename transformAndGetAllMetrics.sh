#!/bin/bash

# Usage: ./transfromAndGetAllMetrics.sh listOfProjsFile outputFile

tsc # make sure to build the current project

listFile=$1
outputFile=$2
curDir=`pwd`
projDirName="../Benchmarks/"

declare -a projs=( `cat $listFile` )

echo "Starting transformation and data collection"
for projName in "${projs[@]}"; do
	echo "Working on" $projName
	curProjDir=$projDirName$projName
	./resetProject.sh $curProjDir > /dev/null
	./runTransformer.sh $curProjDir
	python3 collectData.py $projName $outputFile
done
echo "Done!"
