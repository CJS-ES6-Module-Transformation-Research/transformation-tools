#!/bin/bash 

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECTS_FILE="${SCRIPT_DIR}/projects"
PROJECT_ROOT="${HOME}/module-refactoring"

cd "${HOME}"
mkdir "module-refactoring"

cd "module-refactoring" || exit
for url in $(cat ${PROJECTS_FILE})
do
  cd "${PROJECT_ROOT}"
	git clone "$url" && cd "$(basename "$_")"
	git checkout main_cfg
	npm install
done
