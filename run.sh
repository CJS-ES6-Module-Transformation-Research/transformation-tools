
EXEC_DIR=$1
OPTs=$2
if [ -z $EXEC_DIR ]
then
	EXEC_DIR="."
fi
cd $EXEC_DIR || exit 1
BASE_DIR=$(pwd)
_meta="$EXEC_DIR/.project-dirs"
LIST_OF_PROJECTS="$_meta/p.rojs2.TF"
PROJECTS_DIR="$_meta/projects"

TF_PATH=$EXEC_DIR

function execProject(){
	PROJ_PATH=$1
	case $2 in

	test-only)
	npm run es-test 

;;

rebulild)
	cd $PROJ_PATH || exit 1
	git reset --hard
	cd $EXEC_DIR || exit 1 
	ts-node cjs-transform.ts i --import_type named $PROJ_PATH --report --ignored dist
	cd $PROJ_PATH || exit 1
;;

reset)
	cd $PROJ_PATH || exit 1
	git reset --hard

;; 

	complete)
	cd $PROJ_PATH || exit 1
	git reset --hard
	cd $EXEC_DIR || exit 1 
	ts-node cjs-transform.ts i --import_type named $PROJ_PATH --report --ignored dist
	cd $PROJ_PATH || exit 1
	npm install &&
	npm run es-test 
;;




	esac

}

grep -v '^ *#' < $LIST_OF_PROJECTS | while IFS= read -r project
do
  execProject "$PROJECTS_DIR/$project" $2
done