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
  