import plugins from './plugins';
import { executeHooks } from './hooks';

// Load plugins
plugins.forEach(plugin => plugin());

// Execute prestart hooks
executeHooks('prestart');

// Start the application
console.log('Starting the application...');

// Execute poststart hooks
executeHooks('poststart');
