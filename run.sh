
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
;;

rebulild)
;;

reset)
;; 

	complete)
;;




	esac

}

grep -v '^ *#' < $LIST_OF_PROJECTS | while IFS= read -r project
do
  echo "Line: $line"
done