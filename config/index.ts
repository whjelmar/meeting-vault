import { cosmiconfigSync } from 'cosmiconfig';
import defaultConfig from './default';

const moduleName = '{{PROJECT_NAME}}';

function loadConfig(cliOptions: any) {
  const explorer = cosmiconfigSync(moduleName);
  const result = cliOptions.config ? explorer.load(cliOptions.config) : explorer.search();

  const config = {
    ...defaultConfig,
    ...(result ? result.config : {}),
    // Command-line options override config file settings
    inputFile: cliOptions.input || (result && result.config.inputFile) || defaultConfig.inputFile,
    outputFile: cliOptions.output || (result && result.config.outputFile) || defaultConfig.outputFile,
    inputType: cliOptions.inputType || (result && result.config.inputType) || defaultConfig.inputType,
    outputType: cliOptions.outputType || (result && result.config.outputType) || defaultConfig.outputType,
  };

  return config;
}

export default loadConfig;
