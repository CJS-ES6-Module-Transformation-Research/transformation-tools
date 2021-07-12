import {expect} from "chai";
import {execSync} from "child_process";
import {existsSync, mkdir, mkdirSync, readdirSync, rmdirSync} from "fs";
import {copySync} from 'fs-extra'
import {join} from "path";
import {promisify} from "util";

async function _mkdir(path) {
	let callabck = async (str: string) => console.log(str)
	let _ = async (callback: () => string) => {
		return mkdir(path, recursive, callback)
	}
	return promisify(_)
}

const cjs = process.env.CJS as string
const test = join(cjs, 'test')
const test1 = join(test, 'test1')
const temp = join(test, 'temp')
const recursive = {recursive: true}

readdirSync(test).forEach(dir=>{
	let test_dir = join(test, dir)

		if (existsSync(test_dir) &&existsSync(temp)) {
			rmdirSync(temp, recursive)
		}



	mkdirSync(temp, recursive)
	copySync(test_dir, temp, recursive)
	let out = execSync(`node ${join(temp, 'main.js')}`, {encoding: 'utf-8'})
	expect(out).to.be.eq('xyz\n')

	rmdirSync(temp, recursive)

})


//   ['a', 'b','c/d',join('a/b', 'c'),'z/y/z']
// 	.map (e=> {
// let j = 		join(test1, e)
// 		console.log(j)
// 		return j
// 	})
// 	  .map(async (e)=>mkdir(e, {recursive:true}, (str)=>console.log(str)) )

// .forEach(console.log)
// mkdirSync(test)

