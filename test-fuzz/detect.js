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

  const bcash = await execAsync(`${bcashPath} ${filePath}`);
  const abc = await execAsync(`${abcPath} ${filePath}`);

  const match = (bcash == abc);

  if (!match) {
    throw new Error(`Implementation difference: ${filePath}`);
  }

  return match;
}

async function detectSet(files) {
  return Promise.all(files.map(async (f) => await detect(f)));
}

function logStats(count, length) {
  console.info('verified: %d, total: %s, time: %s', count, length, new Date().toISOString());
}

(async function() {
  const length = files.length;
  let count = 0;
  logStats(count, length);
  setInterval(() => logStats(count, length), 5000);

  for (let i = 0; i + CONCURRENCY < length; i += CONCURRENCY) {
    await detectSet(files.slice(i, i + CONCURRENCY));
    count += CONCURRENCY;
  }
  await detectSet(files.slice(length - length % CONCURRENCY, length));
})();
