#!/bin/bash

# usage <name-of-script> <project-root>
PROJECT_ROOT="${HOME}/transformation-tools"
PROJECT_DIR="${HOME}/module-refactoring"

export CJS="${PROJECT_ROOT}"

cd "${PROJECT_DIR}"

for dir in `ls`; 
do
  echo ""
  echo "${dir}"
  echo ""
  cd "${PROJECT_DIR}"
  cd "${dir}" || continue;
  git reset --hard
  ts-node -P "${PROJECT_ROOT}/tsconfig.json" "${PROJECT_ROOT}/src/bin/main.ts" .
  echo ""
done
