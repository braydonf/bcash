/*!
 * detect.js - fuzz testing script implementation difference detection
 * Copyright (c) 2018, the bcoin developers (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict'

const { readdirSync } = require('fs');
const { resolve } = require('path');
const { exec } = require('child_process');

const numCPUs = require('os').cpus().length;

// TODO streaming/iterative listing of files,
// see: https://github.com/nodejs/node/issues/583
const files = readdirSync(resolve(__dirname, './data'));

async function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve(stdout);
    });
  })
}

async function detect(file) {
  const bcash = await execAsync(`./node verify.js ${file}`);
  const abc = await execAsync(`./verify ${file}`);
  return (bcash == abc);
}

async function detectSet(files) {
  return Promise.all(files.map((f) => await detect(f)));
}

(async function() {

  for (let i = 0; i < files.length; i += numCPUs) {
    const set = files.slice(i, i + numCPUs);
    const results = await detectSet(set);
    console.log('results', results);
  }

  // TODO handle tail of files
  // TODO if the results differ, save and log the result
})();
