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
        signin: './sense/signin.jsx',
        consent: './sense/consent.jsx',
        ui: ['@material-ui/core', '@material-ui/icons'],
        react: ['react']
    },
    output: {
        path: path.resolve(__dirname, 'build/sense'),
        filename: '[name].[hash].js'
    },
    mode: 'production',
    devtool: 'eval-source-map',
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
        }),
        new HtmlWebpackPlugin({
            title: 'SignIn',
            filename: 'signin.html',
            chunks: ['signin', 'ui', 'react']
        }),
        new HtmlWebpackPlugin({
            title: 'Consent',
            filename: 'consent.html',
            chunks: ['consent', 'ui', 'react']
        })
    ]
};
