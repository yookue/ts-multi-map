/*
 * Copyright (c) 2023 Yookue Ltd. All rights reserved.
 *
 * Licensed under the MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 */


import nodePath from 'node:path';
import {defineConfig} from 'father';


/**
 * @see "https://github.com/umijs/father/blob/master/docs/config.md"
 */
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    cjs: {},
    esm: {},
    umd: {
        name: 'TsMultiMap',
    },
    alias: {
        '@': nodePath.resolve(__dirname, './src'),
        '@yookue/ts-multi-map': nodePath.resolve(__dirname, './src'),
    },
    extraBabelPlugins: [
        ['babel-plugin-comments', {
            remove: 'all',
        }]
    ]
});
