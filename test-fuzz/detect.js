#!/usr/bin/env node
/*!
 * detect.js - fuzz testing script implementation difference detection
 * Copyright (c) 2018, the bcoin developers (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict'

const path = require('path');
const { exec } = require('child_process');
const { readdirSync } = require('fs');

const NUM_CPUS = require('os').cpus().length;
const CONCURRENCY = NUM_CPUS;

// TODO streaming/iterative listing of files,
// see: https://github.com/nodejs/node/issues/583
const files = readdirSync(path.resolve(__dirname, './data'));

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
  const bcashPath = path.resolve(__dirname, `./verify.js`);
  const abcPath = path.resolve(__dirname, `./verify`);
  const filePath = path.resolve(__dirname, `./data/${file}`);

  const bcash = await execAsync(`node ${bcashPath} ${filePath}`);
  const abc = await execAsync(`${abcPath} ${filePath}`);

  return (bcash == abc);
}

async function detectSet(files) {
  return Promise.all(files.map(async (f) => await detect(f)));
}

(async function() {

  for (let i = 0; i < files.length; i += CONCURRENCY) {
	const results = await detectSet(files.slice(i, i + CONCURRENCY));
	console.log('results', results);
  }

  // TODO handle tail of files
  // TODO if the results differ, save and log the result
})();
