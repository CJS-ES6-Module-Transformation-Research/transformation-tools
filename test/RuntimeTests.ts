import {expect} from 'chai';
import chalk from 'chalk'
import {execSync} from 'child_process'
import {copyFileSync, existsSync, mkdirSync, readdirSync, rmdirSync} from 'fs'
import {join} from 'path'
import {ProjConstructionOpts, ProjectManager} from "../src/control/ProjectManager";
import {clean} from "../src/refactoring/janitor";

let green = chalk.green
let testRoot = `${process.env.CJS}/test_data`
let testsDir = join(testRoot, 'cleaning/runtime_states')
// const echo = (x )=> console.log(x)
console.log(`testRoot : ${testRoot}`)
console.log(`testsDir : ${testsDir}`)
let tests_roots = readdirSync(testsDir).map(e => {
	let j: string = join(testsDir, e)
	console.log(green(j))
	return j
})

console.log(`tests_roots : ${tests_roots}`)

function removeIfExists(to): void {
	if (existsSync(to)) {
		rmdirSync(to, {recursive: true})
	}
}

function copy(path, to) {
	removeIfExists(to);
	mkdirSync(to)

	copyFileSync(path, to)
}

let betweenLines = (... lines) => lines.map(e => `${e}\n`).reduce((e, r) => e + r)
tests_roots.forEach(curr_test => {
	// let test
	// let json = JSON.parse(readFileSync(join(curr_test, 'package.json'), 'utf-8')) as { [key: string]: {} | [] | string | number | null | undefined }
	// let main = json.main as string

	let ls = readdirSync(curr_test)
	let original = join(curr_test, 'original')
	let tmp = join(curr_test, 'tmp')


	copy(original, tmp)
	let opts: ProjConstructionOpts = mock(tmp,)

	let {input} = opts
	let pm: ProjectManager = new ProjectManager(input, opts);

	clean(pm)

	console.log(green(original));
	console.log(green(tmp))
	// execSync(`cp -R ${original}/* ${tmp}`)
	// process.exit()
	pm.writeOut()
		.then(() => {
			// expect(readdirSync(tmp)).to.include
			let tmpRds = readdirSync(tmp)
			expect(tmpRds).to.include('main.js', (green(JSON.stringify(tmpRds, null, 1))))

			let str = execSync(`node ${join(tmp, 'main.js')}`).toString('utf-8')

			expect(str).to.be.eq(betweenLines('2', 'good', 'a:a', 'b:0', 'b:1'))

		})

		.catch(assertionErr => console.log(assertionErr, "didn't assert eq")).finally(() => console.log('finally'))
		.finally(() => {
		})

})


function mock(input: string): ProjConstructionOpts {
	return {
		input,
		output: '',
		suffix: '',
		isNamed: true,
		report: false,
		operation_type: "in-place"
	}
}