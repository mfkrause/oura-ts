#!/usr/bin/env node

import { Command } from 'commander';

import { createAuthCommand } from './commands/auth.js';
import { createGetCommand } from './commands/get.js';
import { createWebhooksCommand } from './commands/webhooks.js';

const program = new Command();

program.name('oura').description('CLI for the Oura Ring API v2').version('0.1.0');

program.addCommand(createAuthCommand());
program.addCommand(createGetCommand());
program.addCommand(createWebhooksCommand());

program.parse();
