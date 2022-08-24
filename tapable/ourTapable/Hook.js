class Hook {
    constructor(args = [], name = undefined) {
        // 保存初始化Hook时传递的参数
        this._args = args;
        this.name = name;
        this.taps = [];
        // 拦截tapable整个发布订阅执行的流程
        this.interceptors = [];
        // hook.call 调用方法
        this._call = CALL_DELEGATE;
        this.call = CALL_DELEGATE;
        // _x 存放hook中所有通过tap注册的函数
        this._x = undefined;

        // 动态编译方法
        this.compile = this.compile;
        // 注册方法
        this.tap = this.tap;
    }
    compile(options) {
        throw new Error('Abstract: this method should be overridden');
    }
}

module.exports = Hook;