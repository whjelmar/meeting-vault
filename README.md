# {{PROJECT_NAME}}

## Description

{{SHORT_DESCRIPTION}}

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Badges](#badges)
- [Design Principles](#design-principles)
- [Project Structure](#project-structure)
- [Extensibility](#extensibility)

## Installation

To install the project dependencies, run:

```bash
npm install
```

## Usage

To start the application, run:

```bash
npm start
```

## Using the CLI

To use the CLI, make sure you have built the project first:

```bash
npm run build
```

Then you can run the CLI using:

``` bash
npx {{PROJECT_NAME}} --help
```

This will show you the available commands and options for the CLI.

### Disabling the Banner

If you prefer not to display the Figlet banner, you can use the --no-banner option:

```bash
npx {{PROJECT_NAME}} --no-banner
```

### Enabling Debug Mode

The CLI supports a debug mode which provides more detailed logging information. To enable debug mode, use the `--debug` (or `-d`) flag.

Example:

```bash
npx {{PROJECT_NAME}} --debug
```

When debug mode is enabled, the application will log detailed debug information, including the running configuration and all registered plugins, to help with troubleshooting and development.

### Enabling Verbose Mode

The CLI supports a verbose mode which provides more detailed output than usual but less than debug-level logging. To enable verbose mode, use the --verbose flag.

Example:

```bash
npx {{PROJECT_NAME}} --verbose
```

### Suppressing Output

The CLI supports a quiet mode which suppresses all output except for errors. To enable quiet mode, use the --quiet flag.

Example:

```bash
npx {{PROJECT_NAME}} --quiet
```

### Dry Run Mode

The CLI supports a dry run mode which shows what would be done without actually performing any actions. To enable dry run mode, use the --dry-run flag.

Example:

```bash
npx {{PROJECT_NAME}} --dry-run
```

### Forcing Actions

The CLI supports a force mode which bypasses confirmation prompts or overwrites files. To enable force mode, use the --force flag.

Example:

```bash
npx {{PROJECT_NAME}} --force
```

## Using the GUI

The application also includes a graphical user interface (GUI) built with Electron and React. The GUI provides equivalent functionality to the CLI, including configuration management, input/output management, logging, and more.

### Configuration Management

The GUI allows you to load and display the current configuration. You can specify a custom configuration file through the GUI.

### Input/Output Management

The GUI provides fields to specify input and output files and allows you to select input and output file types.

### Logging

The GUI displays logs in a dedicated section and allows you to toggle debug and verbose modes.

### Execution Controls

The GUI provides Start/Stop buttons to control the execution of tasks and indicates if dry run mode is enabled.

### Plugin Management

The GUI displays a list of registered plugins and allows you to enable/disable plugins.

### Miscellaneous

The GUI allows you to toggle the banner display and force actions.

### Running the GUI

To start the GUI, run:

```bash
npm start
```

## Configuration File

This project uses cosmiconfig to manage configuration. The configuration system allows for specifying defaults and overriding them with configuration files or environment variables.

### Cosmiconfig Info

By default, Cosmiconfig will check the current directory for the following:

- a package.json property
- a JSON or YAML, extensionless "rc file"
- an "rc file" with the extensions .json, .yaml, .yml, .js, .ts, .mjs, or .cjs
- any of the above two inside a .config subdirectory
- a .config.js, .config.ts, .config.mjs, or .config.cjs file

For this application, cosmiconfig will search up the directory tree for configuration in the following places:

a {{PROJECT_NAME}} property in package.json
a .{{PROJECT_NAME}} file in JSON or YAML format
a .{{PROJECT_NAME}}.json, .{{PROJECT_NAME}}rc.yaml, .{{PROJECT_NAME}}rc.yml, .{{PROJECT_NAME}}rc.js, .{{PROJECT_NAME}}rc.ts, .{{PROJECT_NAME}}rc.mjs, or .{{PROJECT_NAME}}rc.cjs file
a {{PROJECT_NAME}}rc, {{PROJECT_NAME}}rc.json, {{PROJECT_NAME}}rc.yaml, {{PROJECT_NAME}}rc.yml, {{PROJECT_NAME}}rc.js, {{PROJECT_NAME}}rc.ts, {{PROJECT_NAME}}rc.mjs, or {{PROJECT_NAME}}rc.cjs file inside a .config subdirectory
a {{PROJECT_NAME}}.config.js, {{PROJECT_NAME}}.config.ts, {{PROJECT_NAME}}.config.mjs, or {{PROJECT_NAME}}.config.cjs file
Optionally, you can tell it to search up the directory tree using search strategies, checking each of these places in each directory, until it finds some acceptable configuration (or hits the home directory).

### Using a Custom Configuration File
You can specify a custom configuration file using the --config (or -c) option when running the CLI. This allows you to override the default configuration and any configuration found by cosmiconfig.

Example:

```bash
npx {{PROJECT_NAME}} --config path/to/custom/config.json
```

### Default Configuration

The default configuration is located in src/config/default.ts and includes settings for logging and tracing.

Example:

```typescript
const config = {
  logging: {
    level: 'info',
    mask: ['email', 'password', 'ssn'],
    transports: {
      console: {
        enabled: true
      },
      file: {
        enabled: true,
        path: 'combined.log'
      }
    }
  },
  tracing: {
    serviceName: '{{PROJECT_NAME}}'
  },
  inputFile: '',
  outputFile: '',
  inputType: 'json',
  outputType: 'json'
};

export default config;
```

### Loading Configuration

The configuration is loaded using cosmiconfig, which searches for configuration files or environment variables. The loaded configuration is merged with the default configuration.

Example:

```typescript
import { cosmiconfigSync } from 'cosmiconfig';
import defaultConfig from './default';

const moduleName = '{{PROJECT_NAME}}';
const explorer = cosmiconfigSync(moduleName);

const result = explorer.search();

const config = {
  ...defaultConfig,
  ...(result ? result.config : {})
};

export default config;
```

## Development

### Building the Project

To build the project, run:

```bash
npm run build
```

### Watching for Changes

To watch for changes and rebuild automatically, run:

```bash
npm run dev
```

### Linting and Formatting

To lint the project files, run:

```bash
npm run lint
```

To format the project files, run:

```bash
npm run format
```

### Running Tests

To run the tests, run:

```bash
npm test
```

### Type Checking

To type-check the project, run:

```bash
npm run type-check
```

### Cleaning the Build

To clean the build artifacts, run:

```bash
npm run clean
```

## Logging and Tracing

### Logging Framework

This project uses Cabin.js and Pino for logging. Cabin.js provides advanced logging features, including automatic PII masking and structured logging. It uses Pino for its transport capability.

#### Logging Setup

Cabin.js is configured in src/logger.ts. The configuration includes setting the logging level, masking fields, and configuring transports for console and file logging.

Example:

```typescript
import Cabin from 'cabin';
import { Signale } from 'signale';
import { createWriteStream } from 'fs';
import pino from 'pino';
import config from './config';

const { level, mask, transports } = config.logging;

const logStream = transports.file.enabled
  ? createWriteStream(transports.file.path, { flags: 'a' })
  : null;

const loggerTransports = [];

if (transports.console.enabled) {
  loggerTransports.push(new Signale({ stream: process.stdout }));
}

if (logStream) {
  loggerTransports.push(pino(logStream));
}

const cabin = new Cabin({
  axe: {
    logger: pino(logStream || undefined),
  },
  mask
});

cabin.setLevel(level);

loggerTransports.forEach(transport => cabin.setTransport(transport));

export default cabin;
```

### Tracing Framework

This project uses OpenTelemetry for tracing. OpenTelemetry provides distributed tracing capabilities, which help monitor and troubleshoot the application.

#### Tracing Setup

OpenTelemetry is configured in src/tracing.ts. The configuration includes setting up a Jaeger exporter and registering the tracer provider.

Example:

```typescript
import { NodeTracerProvider } from '@opentelemetry/node';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import config from './config';

const { serviceName } = config.tracing;

const provider = new NodeTracerProvider();

const exporter = new JaegerExporter({
  serviceName,
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();

console.log('Tracing initialized');
```

## Contributing

Thank you for considering contributing to {{PROJECT_NAME}}! We welcome contributions from everyone. By participating in this project, you agree to abide by the [Code of Conduct](docs/COE_OF_CONUCT.md). See the [CONTRIBUTING](docs/CONTRIBUTING.md) for more information on how to get involved.

## License

This project is licensed under the MIT License. See the [LICENSE](docs/LICENSE.md) file for details.

## Badges

![Electron Version](https://img.shields.io/badge/electron-30.0.9-blue)
![Node Version](https://img.shields.io/badge/node-16.0.0-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## Design Principles

**Consistency**: Maintain a consistent coding style and structure.
**Extensibility**: Design the project to be easily extensible with plugins and hooks.
**Simplicity**: Keep the project as simple as possible while meeting requirements.

See more information about our design principles and our architectural decision records in our [decisions](docs/decisions/) documents directory.

## Project Structure

```arduino

my-project/
├── src/
│   ├── plugins/
│   │   └── index.ts
│   ├── hooks/
│   │   ├── prestart.ts
│   │   ├── poststart.ts
│   │   ├── prebuild.ts
│   │   ├── postbuild.ts
│   │   └── index.ts
│   └── index.ts
├── package.json
├── tsconfig.json
├── webpack.config.js
├── README.md
└── scripts/
    ├── setup-template.ps1
    └── setup-template.sh
```

## Extensibility

### Plugin Framework

{{PROJECT_NAME}} includes a plugin framework that allows for easy extension of the application's functionality. Plugins can register hooks to perform actions at different stages of the application lifecycle.

### Hooks

The following hooks are available:

prestart: Executed before the application starts.
poststart: Executed after the application starts.
prebuild: Executed before the build process starts.
postbuild: Executed after the build process completes.

### Creating a Plugin

To create a plugin, add a TypeScript file in the src/plugins directory. Each plugin should register hooks using the registerHook function.

Example:

```typescript

import { registerHook } from '../hooks';

function examplePlugin(): void {
  registerHook('prestart', () => {
    console.log('Example Plugin: Prestart hook');
  });

  registerHook('poststart', () => {
    console.log('Example Plugin: Poststart hook');
  });
}

export default examplePlugin;
```
