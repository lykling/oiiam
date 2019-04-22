/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file env.js
 * @author Pride Leong<lykling.lyk@gmail.com>
 */
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

export const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')));

export const args = yargs.version(
    pkg.version
).env(
    'OIIAM'
).option('hydra-admin-url', {
    default: 'https://localhost:4445'
}).argv;

export const settings = {};
