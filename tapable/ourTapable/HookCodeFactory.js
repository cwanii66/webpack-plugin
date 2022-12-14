
class HookCodeFactory {
    constructor(config) {
        this.config = config;
        this.options = undefined;
        this._args = undefined;
    }
    // 初始化参数
    setup(instance, options) {
        instance._x = options.taps.map(i => i.fn);
    }
    // 编译最终需要生成的函数
    create(options) {
        this.init(options);
        // 最终编译生成的方法fn
        let fn;
        switch (this.options.type) {
            case 'sync':
                fn = new Function(
                    this.args(),
                    '"use strict"; \n' +
                    this.header() +
                    this.contentWithInterceptors({
                        onError: (err) => `throw ${err};\n`,
                        onResult: (res) => `return ${res};\n`,
                        resultReturns: true,
                        onDone: () => 'console.log("倒序遍历开始...");\n',
                        rethrowIfPossible: true,
                    })
                );
                break;
            // 其他钩子类型
            default:
                break;
        }
        return fn;
    }

    args(/*{ before, after }*/) {
        let allArgs = this._args;
        // if (before) allArgs = [ before ].concat(allArgs);
        // if (after) allArgs = allArgs.concat(after);
        if (allArgs.length === 0) {
            return '';
        } else {
            return allArgs.join(', ');
        }
        // ...
    }
    header() {
        let code = '';
        code += 'var _context;\n';
        code += 'var _x = this._x;\n';
        return code;
    }
    contentWithInterceptors(options) {
        // 有拦截器
        if (this.options.interceptors.length) {
            // ...
        } else {
            // content() 作为基类的content生成方法是抽象的，所以具体生成需要委托到子类
            return this.content(options);
        }
        // ...
    }

    // 基类方法，所以不需要子类额外定义，更好地解耦各个模块
    // 根据this._x生成整体函数内容
    callTapsSeries({ onError, onDone, rethrowIfPossible }) {
        let code = '';
        const _taps = this.options.taps;
        let current = onDone;
        // 没有注册事件则直接返回
        if (_taps.length === 0) return onDone();
        // 遍历taps注册的函数 编译生成需要执行的函数
        for (let i = _taps.length - 1; i >= 0; i--) {
            // 当前函数编译完成？
            const done = current;
            // 一个一个地创建对应函数调用
            const content = this.callTap(i, { onDone: done });
            current = () => content;
        }
        code += current();
        return code;
    }
    // 编译生成单个注册的函数并调用: fn1 = this._x[0]; fn1(...args)
    callTap(tapIndex, { onDone }) {
        let code = '';
        // 无论什么类型都要先通过下标获取内容var fn1 = _x[0]
        code += `var _fn${tapIndex} = ${this.getTapFn(tapIndex)};\n`;
        // 不同类型的调用方式不同
        // 生成调用代码 fn1(arg1, arg2, ...)
        const tap = this.options.taps[tapIndex];
        switch (tap.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});\n`;
                break;
            // 其他类型
            default:
                break;
        }
        if(onDone) {
            code += onDone();
        }
        return code;
    }
    // 从this._x 中获取函数内容 this._x[index]
    getTapFn(index) {
        return `_x[${index}]`;
    }

    /**
     * @param {{ type: "sync" | "promise" | "async", taps: Array<Tap>, interceptors: Array<Interceptor> }}
     */
    init(options) {
        this.options = options;
        // 保存初始化Hook时的参数
        this._args = options.args.slice();
    }
    deinit() {
        this.options = undefined;
        this._args = undefined;
    }
}

module.exports = HookCodeFactory;