
OPTs=$1
 
# cd $EXEC_DIR || exit 1
# BASE_DIR=$(pwd)
_meta="$CJS/.project-dirs"
LIST_OF_PROJECTS="$_meta/p.rojs2.TF"
PROJECTS_DIR="$_meta/projects"
echo "meta: $_meta "
echo "list: $LIST_OF_PROJECTS"
echo "dir: $PROJECTS_DIR"
 
function execProject(){
	PROJ_PATH=$1
	case $2 in

	test-only)
	npm run es-test 

;;

rebulild)
	cd $PROJ_PATH || exit 1
	git reset --hard
	cd $$CJS || exit 1 
	ts-node cjs-transform.ts i --import_type named $PROJ_PATH --report --ignored dist
 ;;

reset)
	cd $PROJ_PATH || exit 1
	git reset --hard

;; 

	complete)
	cd $PROJ_PATH || exit 1
	git reset --hard
	cd $CJS || exit 1 
	ts-node cjs-transform.ts i --import_type named $PROJ_PATH --report --ignored dist
	cd $PROJ_PATH || exit 1
	npm install &&
	npm run es-test 
;;




	esac

}

grep -v '^ *#' < $LIST_OF_PROJECTS | while IFS= read -r project
do
	# echo $project 
	# echo $1 
   execProject "$PROJECTS_DIR/$project" $1
done