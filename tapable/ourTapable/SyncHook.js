const Hook = require('./Hook.js');
const HookCodeFactory = require('./HookCodeFactory.js');

class SyncHookCodeFactory extends HookCodeFactory {
    
    content({ onError, onDone, rethrowIfPossible }) {
        return this.callTapsSeries({
            onError: (i, error) => onError(error),
            onDone,
            rethrowIfPossible,
        });
    }
}
const factory = new SyncHookCodeFactory();

const TAP_ASYNC = () => {
    throw new Error('tapAsync is not supported on SyncHook');
}
const TAP_PROMISE = () => {
    throw new Error('tapPromise is not supported on SyncHook');
}

/**
 * 调用栈this.call() -> CALL_DELEGATE -> this._createCall() -> this.compile() -> hook.COMPILE()
 * @param {*} options
 */
function COMPILE(options) {
    factory.setup(this, options);
    return factory.create(options);
}

// basic SyncHook file
function SyncHook(args = [], name = undefined) {
    const hook = new Hook(args, name);
    hook.constructor = SyncHook;
    hook.TAP_ASYNC = TAP_ASYNC;
    hook.TAP_PROMISE = TAP_PROMISE;
    hook.compile = COMPILE;
    return hook;
}
SyncHook.prototype = null;

module.exports = SyncHook;