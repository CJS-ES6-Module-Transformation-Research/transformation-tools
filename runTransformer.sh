#!/bin/bash

transformRoot=$1

if [ ! -d "$transformRoot" ]; then
	echo "Usage: ./runTransformer.sh <directory-to-transform>"
	exit
fi

ts-node cjs-transform.ts i --import_type named $transformRoot --report
