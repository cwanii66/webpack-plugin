
const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook,
} = require('tapable');

// init
const hook = new SyncHook(['arg1', 'arg2', 'arg3']);

// register
hook.tap('flag1', (arg1, arg2, arg3) => {
    console.log('flag1: ', arg1, arg2, arg3);
});
// trigger
hook.call('1', '2', '3');