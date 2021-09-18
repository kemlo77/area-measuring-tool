const path = require('path');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 5600
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'style.css' })
    ],
    module: {
        rules: [
            {
                test: /.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ],
    }

});