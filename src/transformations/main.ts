import {projectReader} from '../abstract_representation/project_representation/project/FileProcessing'
import {TransformableProject} from "../abstract_representation/project_representation/project/TransformableProject";

import {transformImport} from './import_transformations/visitors/import_replacement'
import {exportTransform} from "./export_transformations/visitors/exportCollector";
// import yargs from "yargs";

const helpString = `Usage: `;

// @ts-ignore
let x = yargs

// .command<{}>(  "sanitize",` [inplace:'-i'] <projdir> [target] --` ).argv
// console.log(x).alias('sanitize', 'clean'
import {argv} from 'process';
// import {Transformer} from "src/transformations/Transformer";
