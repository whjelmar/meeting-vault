import { registerHook } from './index';

registerHook('prestart', () => {
  console.log('Executing prestart hook');
});
