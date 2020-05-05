#!/bin/zsh
#$*.test.js

#PROJ_FOLDER="/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform"
#TEST_FOLDER="$PROJ_FOLDER/test/"
#for file in ls `ls /Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test`
#do
#  echo $file;
#  done
#ls $PROJ_FOLDER
./clean
ts-mocha ./test/baseSingleProject.test.ts
./clean
ts-mocha ./test/importManager.test.ts

./clean
ts-mocha ./test/jsfileNamespace.test.ts

#args=""
#cd test
#tsFiles=$(ls /Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test | grep .test.ts|tr '\n' ' '
# //| while read file;
# do
#  echo "./test/$file" ;echo $tsFiles
#  done
#echo "GAP" $(echo $testFiles)
#for i in
#do
#  args="${args} ${i}"
#done
#
#echo $args
#echo $tsFiles
#ts-mocha $tsFiles

#cd ..
#for testFile in `echo $tsFiles`;
#do
#  ./clean
#  ts-mocha "./test/$testFile";
#done
