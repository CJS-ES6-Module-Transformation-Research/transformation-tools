#!/bin/bash

numRuns=$1
projDir=$2
projName=$3
curDir=`pwd`
testOutFile=`echo $curDir`"/tests_$3_$1runs.out"
timeOutFile=`echo $curDir`"/time_$3_$1runs.out"
echo $timeOutFile
# if the time output file or test output file already exist, 
# delete them, to avoid repeatedly appending and polluting the old 
# data (move them to _old to avoid accidental deletion)
if test -f "$testOutFile"; then
	mv $testOutFile `echo $testOutFile`_old
fi
if test -f "$timeOutFile"; then
	mv $timeOutFile `echo $timeOutFile`_old
fi


#./resetProj.sh $projDir
cd $projDir
for x in $(eval echo {1..$1}); do
	echo "Running transformation: " $x
	 #{ time (./runTransformer.sh $projDir>> $testOutFile 2>&1) ; } 2>>$timeOutFile
	#./resetProj.sh $projDir
	{ time (node test/* >> $testOutFile 2>&1) ; } 2>>$timeOutFile
done
cd $curDir
