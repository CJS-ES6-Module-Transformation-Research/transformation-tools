#!/bin/bash

curDir=`pwd`
projDir=$1
cd $projDir

git reset --hard
if [ ! -d "node_modules" ]; then
	npm install
fi
npm run build --if-present

cd $curDir
