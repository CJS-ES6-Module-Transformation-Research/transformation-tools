#!/usr/local/bin/ts-node
import {run} from './src/run-from-cli'
import executioner from "./src/executor";

run(process.cwd(), executioner)

// (if ()
// run(cwd, executioner))


