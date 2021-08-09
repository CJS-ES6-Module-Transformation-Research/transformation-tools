#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="${HOME}/module-refactoring"

cd "${PROJECT_DIR}"

for dir in `ls`; 
do
  echo ""
  echo "${dir}"
  echo ""
  cd "${PROJECT_DIR}"
  cd "${dir}" || continue
  git reset HEAD --hard
  git clean -fd
  git checkout preprocessed
  npm run webpack:preprocessed
  # mkdir "${SCRIPT_DIR}/bundles/${dir}"
  cp "./webpack-bundles/preprocessed.json" "${SCRIPT_DIR}/bundles/${dir}/preprocessed.json"
  echo ""
  cd ..
done

# echo "Comparing bundles..."
# echo ""

# cd "${SCRIPT_DIR}"
# node compare-bundles.js
