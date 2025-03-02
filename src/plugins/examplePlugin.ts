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
