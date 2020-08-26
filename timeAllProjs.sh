#!/bin/bash

numRuns=$1

declare -a projs=( `cat proj_list.txt` )

echo "Timing all transformations"
for projName in "${projs[@]}"; do
	./timeTransformations.sh $numRuns "../Benchmarks/$projName" $projName
done

