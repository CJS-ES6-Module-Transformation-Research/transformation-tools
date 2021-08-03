export * from './Require'
export * from './data'
export * from './factories'
export * from './predicates'
export * from './types'
import chalk from 'chalk'

let _JPP= (obj) =>JSON.stringify(obj,null,3  )


const JPP =  (obj) => console.log(_JPP(obj))
JPP.red = (obj)=> console.log(chalk.red(_JPP(obj)))
JPP.green = (obj)=> console.log(chalk.green(_JPP(obj)))
export {JPP}
