#!/usr/bin/env node
import { runCli } from '../skills/chuot-van/scripts/cli.mjs';

process.exitCode = await runCli(process.argv.slice(2));
