import { registerHook } from './index';

registerHook('poststart', () => {
  console.log('Executing poststart hook');
});
