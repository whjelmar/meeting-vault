type HookFunction = (...args: any[]) => void;

interface Hooks {
  [key: string]: HookFunction[];
}

const hooks: Hooks = {
  prestart: [],
  poststart: [],
  prebuild: [],
  postbuild: []
};

function registerHook(hookName: string, fn: HookFunction): void {
  if (hooks[hookName]) {
    hooks[hookName].push(fn);
  } else {
    throw new Error(`Hook ${hookName} is not supported.`);
  }
}

function executeHooks(hookName: string, ...args: any[]): void {
  if (hooks[hookName]) {
    hooks[hookName].forEach(fn => fn(...args));
  }
}

export {
  registerHook,
  executeHooks
};
