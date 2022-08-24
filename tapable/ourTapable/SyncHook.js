const Hook = require('./Hook.js');

const TAP_ASYNC = () => {
    throw new Error('tapAsync is not supported on SyncHook');
}
const TAP_PROMISE = () => {
    throw new Error('tapPromise is not supported on SyncHook');
}

function COMPILE() {
    
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