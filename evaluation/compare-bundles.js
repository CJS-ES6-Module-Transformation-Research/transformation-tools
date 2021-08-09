(async function(){

  'use strict';
  const fs = require('fs');
  const path = require('path');
  const os = require('os');

  const projectDirs = [
    'cli-progress',
    'get-repository-url',
    'hull',
    'memory-fs',
    'min-req-promise',
    'simplify-js',
    'suncalc',
    'tar-fs',
    'tcppubsub',
    'through',
    'unbzip2-stream',
    'yosay',
    'node-ping'
  ];

  const data = await Promise.all(projectDirs.map(async(project) => {

    return {
      name: (project + "                            ").substr(0, 20),
      default: JSON.parse(await fs.promises.readFile(path.resolve('bundles',  project, 'webpack-bundles', 'default.json'))),
      preprocessed: JSON.parse(await fs.promises.readFile(path.resolve('bundles',  project, 'webpack-bundles', 'preprocessed.json'))),
      transformed: JSON.parse(await fs.promises.readFile(path.resolve('bundles',  project, 'webpack-bundles', 'transformed.json'))),
    };

  }));

  console.log(`  No. \tProject Name\t\t\tdefault\t\tpreprocessed\ttransformed\t% change`);
  console.log("");

  data.forEach((proj, index) => {
    console.log(` ${index+1} \t${proj.name}\t\t${proj.default[0].parsedSize}\t\t${proj.preprocessed[0].parsedSize}\t\t${proj.transformed[0].parsedSize}\t\t${((proj.transformed[0].parsedSize-proj.default[0].parsedSize)/proj.default[0].parsedSize)*100}`)
  });

}())