// import {JSFile} from "../filesystem/JS";
import {default as ESTree} from "estree";
import {replace, traverse, VisitorOption} from "estraverse";
import {JSFile} from "../../filesystem/JS";

export abstract class Walker<T> {

    constructor(replace: boolean) {
        this.toReplace = replace;
    }

    private toReplace: boolean;
    protected js: JSFile
    protected data: T;

    abstract enter: (node: ESTree.Node, parentNode: ESTree.Node | null) => VisitorOption | ESTree.Node | void;
    abstract leave: (node: ESTree.Node, parentNode: ESTree.Node | null) => VisitorOption | ESTree.Node | void;
    abstract postTraversal: () => void

    public walk(js: JSFile, data: T = null): T {
        this.data = data;
        !this.toReplace ?
            traverse(js.getAST(), {enter: this.enter, leave: this.leave})
            : replace(js.getAST(), {enter: this.enter, leave: this.leave})
        this.postTraversal();
        return this.data;
    }

}