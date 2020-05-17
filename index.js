#!/usr/bin/env node
let command = null;

try {
    command = require(`${process.cwd()}/node_modules/nodax`);
} catch (e) {
    command = require("nodax");
}