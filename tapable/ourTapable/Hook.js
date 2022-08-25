function CALL_DELEGATE(...args) {
    this.call = this._createCall('sync');
    return this.call(...args);
}

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
    // 这是因为不同类型的 Hook 最终编译出的执行函数是不同的形式，
    // 所以这里以一种抽象方法的方式将 compile 方法交给了子类进行实现。
    compile(options) {
        throw new Error('Abstract: this method should be overridden');
    }

  /**
   * 
   * @param {*} type 注册的类型 promise、async、sync
   * @param {*} options 注册时传递的第一个参数对象
   * @param {*} fn 注册时传入监听的事件函数
   */
    _tap(type, options, fn) {
        if (typeof options === 'string') {
            options = {
                name: options.trim(),
            };
        } else if (typeof options !== 'object' || options === null) {
            throw new Error('Invalid tap options!');
        }
        // object type
        if (typeof options.name !== 'string' || options.name === '') {
            throw new Error('Missing name for tap');
        }
        // 合并参数
        options = Object.assign({ type, fn }, options);
        // 基于合并后options去 insert fn
        this._insert(options);
    }
    _insert(item) {
        this._resetCompilation();
        this.taps.push(item);
    }
    // 每次tap都会调用_resetCompilation 重新赋值this.call
    _resetCompilation() {
        this.call = this._call;
    }

    // 编译最终生成的执行函数的方法
    // compile是一个抽象方法 需要在继承Hook类的子类方法中进行实现
    _createCall(type) {
        return this.compile({
            taps: this.taps,
            interceptors: this.interceptors,
            args: this._args,
            type: type
        });
    }
    
    tap(options, fn) {
        // 这里额外多做了一层封装 是因为this._tap是一个通用方法
        // 这里我们使用的是同步 所以第一参数表示类型传入 sync
        // 如果是异步同理为sync、promise同理为 promise 这样就很好的区分了三种注册方式
        this._tap('sync', options, fn);
    }
}

module.exports = Hook;