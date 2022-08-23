const path = require('path');
const { FileListPlugin } = require('./plugins/FileListPlugin.js');

module.exports = {
    mode: 'development',
    entry: {
        index: path.resolve(__dirname, 'index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'file-list-plugin.bundle.js'
    },

    plugins: [
        // add custom plugin, use default option
        new FileListPlugin(),
    ]
};