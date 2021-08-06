#!/bin/bash

transformRoot=$1

if [ -z $transformRoot ]; then
    transformRoot="."
fi
shift

if [ ! -d "$transformRoot" ]; then
	echo "Usage: ./runTransformer.sh <directory-to-transform>"
	exit
fi
node ${PROJECT_ROOT}/out.d/cjs-transform.ts i --import_type named $transformRoot $2 --ignored dist  configs rolls webpack-bundles
