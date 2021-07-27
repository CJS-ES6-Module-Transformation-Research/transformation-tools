#!/bin/bash

# runs all tests... file  test-reports will have the status codes of all of the tests. 
PROJECT_DIR="${HOME}/module-refactoring"

cd "${PROJECT_DIR}"
rm "test-reports"

for dir in `ls`; 
do
  echo ""
  echo "${dir}"
  echo ""
  cd "${PROJECT_DIR}"
  cd "${dir}" || continue
  # npm run CJS > ${dir}.test-results.txt
  npm run CJS
  echo "${dir} -> $?" >> ../test-reports
  echo ""
  cd ..
done
