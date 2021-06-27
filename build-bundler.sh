PROJ_DIRS="$CJS/.project-dirs/projects"
function buildABundle(){
    cd $PROJ_DIRS || exit 1
    cd $1 || exit 1
    _DIR="$PROJ_DIRS/$1"
    main=$($CJS/getMainFromPackage $1)
    generate
}