import {Identifier, Node} from "estree";
import {JSFileImpl} from "../../../abstract_fs_v2/JSv2";
import {isARequire} from "../../utilities/helpers";
import {RequireCall} from "../../utilities/Require";


export default (js: JSFileImpl) => function cleanModuleIdentifier(node: Node, parent: Node) {
	if (isARequire(node)) {
		let rs = (node as RequireCall).arguments[0].value.toString();
		(node as RequireCall).arguments[0].value = js.getRST().getTransformed(rs);
	}
}
