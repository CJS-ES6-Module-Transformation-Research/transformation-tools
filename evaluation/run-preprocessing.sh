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
  git clean -fd
  git checkout main_cfg
  # git branch -D preprocessed
  # git push origin --delete preprocessed
  # git checkout -b preprocessed
  node "${PROJECT_ROOT}/redirect/src/bin/main.js" .
  # npm run webpack
  # npm run webpack:preprocessed
  # git add -A
  # git commit -m "Code preprocessed by tool"
  # git push origin preprocessed
  echo ""
done
