#!/usr/bin/env node

import { Command } from 'commander';
import plugins from './plugins';
import { executeHooks } from './hooks';
import figlet from 'figlet';
import ora from 'ora';
import logger from './logger';
import loadConfig from './config';
import './tracing';  // Initialize tracing

const program = new Command();

program
  .version('0.0.1')
  .description('{{SHORT_DESCRIPTION}}')
  .option('-d, --debug', 'enable debug mode')
  .option('--verbose', 'enable verbose mode')
  .option('--quiet', 'suppress all output except errors')
  .option('--dry-run', 'show what would be done without performing any actions')
  .option('--force', 'bypass confirmation prompts or overwrite files')
  .option('--no-banner', 'disable the banner')
  .option('-c, --config <path>', 'specify a custom configuration file')
  .option('-i, --input <file>', 'specify the input file')
  .option('-o, --output <file>', 'specify the output file')
  .option('--input-type <type>', 'specify the input file type')
  .option('--output-type <type>', 'specify the output file type')
  .parse(process.argv);

const options = program.opts();

// Load configuration
const config = loadConfig(options);

// Set logger level based on flags
if (options.debug) {
  logger.setLevel('debug');
  logger.debug('Debug mode enabled');
  logger.debug('Running configuration:', config);
  logger.debug('Registered plugins:', plugins);
} else if (options.verbose) {
  logger.setLevel('verbose');
  logger.verbose('Verbose mode enabled');
} else if (options.quiet) {
  logger.setLevel('error');
} else {
  logger.setLevel('info');
}

// Handle dry run
if (options.dryRun) {
  logger.info('Dry run mode enabled. No actions will be performed.');
  // Add any dry-run specific logic here
}

// Load plugins
plugins.forEach(plugin => plugin());

// Execute prestart hooks
executeHooks('prestart');

// Start the application
const spinner = ora('Starting the application...').start();

setTimeout(() => {
  if (!options.quiet) {
    spinner.succeed('Application started successfully!');
  }

  if (options.banner && !options.quiet) {
    console.log(figlet.textSync('{{PROJECT_NAME}}'));
  }

  // Log a message
  logger.info('Application started', { banner: options.banner, input: config.inputFile, output: config.outputFile });

  // Handle input and output
  if (config.inputFile) {
    logger.info(`Input file specified: ${config.inputFile}`);
  }

  if (config.outputFile) {
    logger.info(`Output file specified: ${config.outputFile}`);
  }

  if (config.inputType) {
    logger.info(`Input file type specified: ${config.inputType}`);
  }

  if (config.outputType) {
    logger.info(`Output file type specified: ${config.outputType}`);
  }

  // Execute poststart hooks
  executeHooks('poststart');
}, 1000);
