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

async function detect(datadir, file) {
  const bcashPath = path.resolve(__dirname, `./verify.js`);
  const abcPath = path.resolve(__dirname, `./verify`);
  const filePath = path.resolve(datadir, `./${file}`);

  const bcash = await execAsync(`${bcashPath} ${filePath}`);
  const abc = await execAsync(`${abcPath} ${filePath}`);

  const match = (bcash == abc);

  const result = {
    match: match,
    bcash: bcash,
    abc: abc,
    filePath: filePath
  };

  return result;
}

async function detectSet(datadir, fileset) {
  return Promise.all(fileset.map(async (f) => await detect(datadir, f)));
}

(async function() {
  let datadir = path.resolve(__dirname, './data');
  if (process.argv.length > 2) {
    datadir = path.resolve(__dirname, process.argv[2]);
  }
  console.info('Using test data directory: %s', datadir);

  const files = readdirSync(datadir);

  const length = files.length;
  let success = 0;
  let failed = 0;

  logStats(success, failed, length);
  const interval = setInterval(() => logStats(success, failed, length), 5000);

  function logStats(success, failed, length) {
    console.info('success: %d, failed: %d, total: %s, time: %s',
                 success, failed, length, new Date().toISOString());
  }

  function logFailure(result) {
    console.error('failed for %s with bcash: %d, abc: %d', result.filePath, result.bcash, result.abc);
  }

  function closeProgram() {
    logStats(success, failed, length);
    clearInterval(interval);
  }

  let results = [];

  async function tryDetectSet(datadir, fileset) {
    try {
      results = await detectSet(datadir, fileset);
    } catch(err) {
      console.log(err);
      process.exit(1);
    }
    results.forEach((result) => {
      if (result.match) {
        success += 1;
      } else {
        failed += 1;
        logFailure(result);
      }
    });
  }

  for (let i = 0; i + CONCURRENCY < length; i += CONCURRENCY) {
    await tryDetectSet(datadir, files.slice(i, i + CONCURRENCY));
  }
  await tryDetectSet(datadir, files.slice(length - (length % CONCURRENCY), length));

  closeProgram();
})();
