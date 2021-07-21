import {Program} from "esprima";
import {traverse} from "estraverse";
import {ArrayPattern, AssignmentPattern, Identifier, MemberExpression, Node, ObjectPattern, RestElement} from "estree";
import {id} from "../utility/factories";



/**
 * represents a namespace for a javascript file. includes potential variables (any LHS assignment even if not declared ) for safety.
 */
export class Namespace {
	private names: Set<string> = new Set<string>();
	private hasDirname: boolean = false
	private hasFilename: boolean = false
	private potentialShadow: { [key: string]: number } = {};
	private moduleSpecifierData: {
		moduleSpecifier:{ [key: string]: string },
		identifierMS:{ [key: string]: string }
	} = {moduleSpecifier: {}, identifierMS:{}} ;



	castShadow(identifier:Identifier): void {
	// @ts-ignore
		identifier.markings = identifier.markings || []
		 // @ts-ignore
		identifier.markings.push('maybe_shadow')
}
	private constructor(ast: Program,defaultExport:Identifier= undefined) {
		if(defaultExport){
			this.__export = defaultExport
		}
		this.names = new Set<string>();
		traverse(ast, {
			enter: (node: Node) => {
				switch (node.type) {
					case "VariableDeclarator": {
						walkPatternToIdentifier(node.id,  node,this.names, true);

						if (node.init && node.init.type === 'Identifier') {
							walkPatternToIdentifier(node.init, node,this.names)
						}
						break;
					}
					case "AssignmentExpression": {
						walkPatternToIdentifier(node.left,  node,this.names);
						break;
					}
					case "FunctionDeclaration": {
						node.params.forEach((e) => walkPatternToIdentifier(e,  node,this.names, true))
						this.names.add(node.id.name)
						this.castShadow(node.id)
						break;
					}
					case "ClassDeclaration": {
						this.names.add(node.id.name);
						this.castShadow(node.id)

						break;
					}
					case "Identifier":
						if (this.hasDirname && this.hasFilename) {
							return
						}
						switch (node.name) {
							case "__filename":
								this.names.add(node.name)
								this.hasFilename = true;
								break;
							case "__dirname":
								this.names.add(node.name)
								this.hasFilename = true;
								break;
						}

						break;
				}
			}
		});
	}

	public addToNamespace(name: string): void {
		this.names.add(name)
	}

	/**
	 * returns true if name is in the namespace.
	 * @param name the tewt name.
	 */
	containsName(name: string): boolean {
		return this.names.has(name);
	}

	/**
	 * gets a list of all names int he namespace set.
	 */
	getAllNames(): string[] {
		let list: string[] = [];
		this.names.forEach((e) => list.push(e))
		return list;
	}

	/**
	 * creates a Namespace object from a Program AST interface object.
	 * @param ast the Program object.
	 */
	static create(ast: Program, defaultExport:Identifier= undefined): Namespace {

		return new Namespace(ast,defaultExport);
	}


	/**
	 * generates a relatively desirable name if there is a collision.
	 * @param name the name to test for collisions.
	 * @return the Identifier object with the non-colliding name.
	 */
	generateBestName(name: string): Identifier {
		if (!name) {
			throw new Error("illegal argument")
		}
		if (!this.names.has(name)) {
			this.addToNamespace(name)
			console.log(`--> ${name}`)

			return {name: name, type: "Identifier"};
		}

		let nameGen = [
			numberNameFormula(name, '', -4, this.names),
			numberNameFormula(name, '_', 0, this.names),
			numberNameFormula(name, '$', 2, this.names),
			numberNameFormula(name, '__', 7, this.names),
			numberNameFormula(name, '$$', 20, this.names),
			numberNameFormula(name, '$_', 14, this.names)
		].sort((a, b) => a.quality - b.quality)

		// [0].name
		this.addToNamespace(nameGen[0].name)
		// console.log(`--> ${nameGen[0].name}`)

		return {name: nameGen[0].name, type: "Identifier"};

		function numberNameFormula(name: string, symbol: string, startQuality: number, namespace: Set<string>): NameQuality {

			return numberName(0);

			function numberName(q: number): NameQuality {
				let curr = `${name}${symbol}${q}`

				if (namespace.has(curr)) {
					return numberName(q + 1);
				} else {
					return {name: curr, quality: q + startQuality};
				}
			}
		}


	}

	private importMeta: Identifier = null

	getImportMeta() {
		if (this.importMeta) {
			return this.importMeta
		}
		this.importMeta = this.generateBestName("IMPORT_META_URL")
		return this.importMeta;
	}

	private __export: Identifier = this.getDefaultExport();

	getDefaultExport():Identifier {
		if (!this.__export) {
			this.__export = this.generateBestName("__exports")
		}
	return id(this.__export.name )
		//return {type:"MemberExpression",computed:false, object:id('module'),property:id('exports')};
	}

	getMSID(requireStr: string) {
		if (!this.moduleSpecifierData.identifierMS[requireStr]) {

			let cleaned = requireStr.replace(new RegExp(`(\.json)|(\.js)`, 'g'),'').replace(new RegExp(`([^a-zA-Z0-9_\$])|(\.json)|(\.js)`, "g"),'_')
			// let replaceDotJS: RegExp = // /[\.js|]/gi
			// let illegal: RegExp = new RegExp(`([^a-zA-Z0-9_\$])|(\.json)|(\.js)`, "g"); ///[alphaNumericString|_]/g
			// let cleaned = requireStr.replace(replaceDotJS, '');
			// cleaned = cleaned.replace(illegal, "_");
			if (cleaned[0] !== '_') {
				cleaned = '_' + cleaned;
			}

			let gbsn = this.generateBestName(cleaned)
			cleaned = gbsn.name
			this.moduleSpecifierData.moduleSpecifier[requireStr] = cleaned
			this.moduleSpecifierData.identifierMS[cleaned] = requireStr

			return cleaned
		}
		return this.moduleSpecifierData.moduleSpecifier[requireStr]
	}
}


/**
 * recursive walker function to detect identifiers as names for a namespace.
 * @param node the potential node to search
 * @param ids the set of Identifier strings found so far.
 */
function walkPatternToIdentifier(node: (Identifier | ObjectPattern | ArrayPattern | RestElement |
	AssignmentPattern | MemberExpression),parent:Node, ids: Set<string>, isADeclaration: boolean = false) {
	switch (node.type) {
		case "ArrayPattern":
			node.elements.forEach((e) => walkPatternToIdentifier(e,node, ids))
			break;
		case "AssignmentPattern":
			walkPatternToIdentifier(node.left,node, ids)
			if (node.right.type === 'Identifier') {
				walkPatternToIdentifier(node.right,node, ids)
			}

			break;
		case "Identifier":
			// (node.parent.type)
		if(parent.type === "MemberExpression"){
			if (node === parent.object){
				ids.add(node.name);
			}
		}else{
			ids.add(node.name);
		}


			break;
		case "ObjectPattern":
			node.properties.forEach((e) => {
				if (e.type === "Property") {
					walkPatternToIdentifier(e.value,e, ids)
				} else {

					throw new Error('unsupported operation non-property')
					//walkPatternToIdentifier(e, ids)
				}
			})
			break;
		case "RestElement":
			throw new Error('unsupported operation non-property')
			break;
		case "MemberExpression":
			if (node.object.type === "Identifier") {
				ids.add(node.object.name)
			} else if (node.object.type === "MemberExpression") {
				walkPatternToIdentifier(node.object, node,ids)
			}
	}
}


interface NameQuality {
	name: string
	quality: number
}



