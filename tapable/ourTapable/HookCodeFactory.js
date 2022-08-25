
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
                        onDone: () => '',
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

    args({ before, after }) {
        let allArgs = this._args;
        if (before) allArgs = [ before ].concat(allArgs);
        if (after) allArgs = allArgs.concat(after);
        if (allArgs.length === 0) {
            return '';
        } else {
            return allArgs.join(', ');
        }
        // ...
    }
    header() {
        let code;
        code += 'var _context;\n';
        code += 'var _x = this._x;\n';
        return code;
    }
    contentWithInterceptors() {

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