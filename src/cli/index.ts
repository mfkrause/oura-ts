#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createAuthCommand } from './commands/auth.js';
import { createGetCommand } from './commands/get.js';
import { createWebhooksCommand } from './commands/webhooks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(path.join(__dirname, '../../package.json'), 'utf8')) as {
  version: string;
};

const program = new Command();

program.name('oura').description('CLI for the Oura Ring API v2').version(packageJson.version);

program.addCommand(createAuthCommand());
program.addCommand(createGetCommand());
program.addCommand(createWebhooksCommand());

program.parse();
