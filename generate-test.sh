#!/bin/bash
if [ -z $1 ]
then
	exit 1
fi
mkdir -p $1/actual $1/expected &&
cd $1 && 
cd actual  &&
touch main.js mod.js &&
npm init -y > /dev/null || echo "error in npm init"
echo "console.log();">> main.js
echo "console.log();">> mod.js
cd ..
cd expected  &&
touch main.js mod.js && 
npm init -y > /dev/null || echo "error in npm init"
echo "console.log();">> main.js
echo "console.log();">> mod.js
cd ..