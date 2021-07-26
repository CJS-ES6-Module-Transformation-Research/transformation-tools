import {join} from "path";
import {readdirSync, readFileSync} from "fs";
import {createProject} from "./index";
import 'mocha'
import {ProjectManager} from "../src/control";

let sa = join('/Users/sam/Documents/module_research/CJS_Transform', 'test_data', 'static_analysis/data-compare')
let paths = {
    export_data: {
        path: join(sa, 'export-api-and-type')

    },
    forced_default: {
        path: {
            call_expression: join(sa, 'forced-defaults/call-expression'),
            direct_rhs: join(sa, 'forced-defaults/direct-rhs'),
            prop_reassign: join(sa, 'forced-defaults/prop-reassign')
        }
    },
    names: {
        path: join(sa, 'property-reads')
    },
    shadows: {
        path: join(sa, 'shadow-vars')
    },
}
let expecteds = {

    export_data: {
        expected: JSON.parse(readFileSync(join(paths.export_data.path, 'expected.json'), 'utf-8'))

    },
    forced_default: {
        expected:
            {
                call_expression: JSON.parse(readFileSync(join(paths.forced_default.path.call_expression, 'expected.json'), 'utf-8')),
                direct_rhs: JSON.parse(readFileSync(join(paths.forced_default.path.direct_rhs, 'expected.json'), 'utf-8')),
                prop_reassign: JSON.parse(readFileSync(join(paths.forced_default.path.prop_reassign, 'expected.json'), 'utf-8'))
            }
    },
    names: {
        expected: JSON.parse(readFileSync(join(paths.names.path, 'expected.json'), 'utf-8'))
    },
    shadows: {
        expected: JSON.parse(readFileSync(join(paths.shadows.path, 'expected.json'), 'utf-8'))
    },

}
let {export_data, forced_default, shadows, names} = expecteds
let exp_d = export_data.expected.map(e => createProject(e, true)) as ProjectManager[]
let shad = shadows.expected.map(e => createProject(e, true)) as ProjectManager[]
let props = names.expected.map(e => createProject(e, true)) as ProjectManager[]
let {call_expression, direct_rhs, prop_reassign} = forced_default.expected
let callex = call_expression.map(e => createProject(e, true)) as ProjectManager[]
let direct = direct_rhs.map(e => createProject(e, true)) as ProjectManager[]
let reassign = prop_reassign.map(e => createProject(e, true)) as ProjectManager[]
let _tests = {}

export_data.expected.forEach(test => {
    _tests[test] = createProject(test, true)
})

describe('export_data', () => {
    it('exports', () => {
        exp_d.forEach(ex => {

        })
    })
})
describe('forced_default', () => {

    describe('call-expression', () => {
        it('forced_defaults_list', () => {
            callex.forEach(e => {
                e.forEachSource(js => js._intermediate.forcedDefaultMap)
            })
        })

    })
    describe('direct-rhs', () => {
        it('forced_defaults_list', () => {
            direct.forEach(e => {
            })
        })

    })
    describe('prop-reassign', () => {
        it('forced_defaults_list', () => {
            reassign.forEach(e => {
            })

        })

    })
})
describe('names_properties', () => {
    it('properties-on-ids', () => {
        props.forEach(e => {
        })

    })

})
describe('shadow-variables', () => {
    it('shadow-variables', () => {
        shad.forEach(e => {
        })

    })

})


let value = readdirSync(sa).map(e => {
    // console.log(e)
    return e
}).filter(w => w !== '.DS_Store')
let value2 = value.map(e => {
    return {
        test_type: e,
        test_suites: readdirSync(join(sa, e))
            .filter(w => w !== '.DS_Store')
    }
})
let value3 = value2.map(e => {

    let suites = e.test_suites
        .map(r => {
                return {
                    suite: r,
                    expected: JSON.parse(readFileSync(join(sa, e.test_type, r, 'expected.json'), 'utf-8')),
                    test_dirs: readdirSync(join(sa, e.test_type, r)).filter(w => w !== '.DS_Store')
                }
            }
        )
    return {category: e.test_type, suites}
})

// console.log(JSON.stringify(value,null,3))
// console.log(JSON.stringify(value2,null,3))
console.log(JSON.stringify(value3, null, 3))
value3.forEach(e => {
    let cat = e.category
    let suites = e.suites
    suites.forEach(suite => {
        let suitename = suite.suite
        suite.expected.tests.forEach(project => {
                let proj = createProject(project, true)

            }
        )
    })

})
