const { SyncHook } = require('../index');

const hook = new SyncHook(['arg1', 'arg2', 'arg3']);

hook.tap('PluginA', (arg1, arg2, arg3) => {
    console.log('PluginA: ', arg1, arg2, arg3);
});

hook.tap('PluginB', (arg1, arg2, arg3) => {
    console.log('PluginB: ', arg1, arg2, arg3);
});

hook.call('chris', 'wong', 'cwluvani');