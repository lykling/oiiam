/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file webpack.config.js
 * @author Pride Leong<lykling.lyk@gmail.com>
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        signup: './sense/signup.jsx',
        ui: ['@material-ui/core', '@material-ui/icons'],
        react: ['react']
    },
    output: {
        path: path.resolve(__dirname, 'build/sense'),
        filename: '[name].[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: 'babel-loader'
            },
            {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    'css-loader?modules',
                    'stylus-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'SignUp',
            filename: 'signup.html',
            chunks: ['signup', 'ui', 'react']
        })
    ]
};
