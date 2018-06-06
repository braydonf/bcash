#!/usr/bin/env node
/*!
 * verify.js - verify script for fuzz testing
 * Copyright (c) 2018, the bcoin developers (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const TX = require('../lib/primitives/tx');
const Script = require('../lib/script/script');
const fs = require('fs')

const filename = process.argv[2];

fs.readFile(filename, 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    process.exit(2);
  }

  try {
    const lines = data.split('\n');
    const outputScriptBuffer = Buffer.from(lines[0], 'hex');
    const txBuffer = Buffer.from(lines[1], 'hex');

    const tx = TX.fromRaw(txBuffer);
    const inputIndex = parseInt(lines[2]);
    const input = tx.inputs[inputIndex].script;
    const output = Script.fromRaw(outputScriptBuffer);

    const flags = parseInt(lines[3]);

    Script.verify(
      input,
      null, // TODO remove as argument?
      output,
      tx,
      inputIndex,
      0, // TODO randomize value?
      flags
    );
    console.log(1);
  } catch(err) {
    console.log(0);
  }
  process.exit(0);
});
