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
      serviceName: 'meeting-vault'
    },
    inputFile: '',
    outputFile: '',
    inputType: 'json',
    outputType: 'json'
  };
  
  export default config;
  