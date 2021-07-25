
import { replace, VisitorOption } from "estraverse";
import { Node } from "estree";
import { JSFile } from "../../filesystem";
import { NodeComparators } from "../../utility/static-analysis/tagger";

export function tagScopes(js: JSFile) {
  let scopeID = 0;
  replace(js.getAST(), {
    
    enter: (node: Node, parent: Node) => {
      switch (node.type) {
        case "BlockStatement":
          scopeID++;
        default:
          node[NodeComparators.Scope_ID] = 	scopeID;
      }
      return node;
    },

    leave: (node: Node, parent: Node) => {
      switch (node.type) {
        case "BlockStatement":
          scopeID--;
          break;
      }
      return VisitorOption.Skip;
    }


  })

}
