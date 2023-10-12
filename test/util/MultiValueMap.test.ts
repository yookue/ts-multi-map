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


import {MultiValueMap} from '@yookue/ts-multi-map';


describe('MultiValueMap', () => {
    test('Testing constructor args', () => {
        const map = new MultiValueMap([
            ['color', ['red', 'green', 'blue']]
        ]);
        expect(map.get('color')).toContain('red');
    });

    test('Testing of method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']]
        ]);
        expect(map.get('color')).toContain('green');
    });

    test('Testing size method', () => {
        const map = new MultiValueMap();
        map.set('color', ['red', 'green', 'blue']);
        expect(map.size).toBe(1);
    });

    test('Testing push method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']]
        ]);
        map.push('color', ['yellow', 'black']);
        expect(map.get('color')).toContain('yellow');
    });

    test('Testing deleteByKey method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']]
        ]);
        map.deleteByKey('color');
        expect(map.size).toBe(0);
    });

    test('Testing deleteValueOfKey method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue', 'blue']]
        ]);
        map.deleteValueOfKey('color', 'blue');
        expect(map.get('color')?.length).toBe(2);
    });

    test('Testing deleteByValues method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']]
        ]);
        map.deleteByValues('red');
        expect(map.size).toBe(0);
    });

    test('Testing undefined key value', () => {
        const map = MultiValueMap.of([
            [undefined, [undefined]]
        ]);
        expect(map.size).toBe(1);
        map.deleteByValues(undefined);
        expect(map.size).toBe(0);
    });

    test('Testing forEachIndexing method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']],
            ['position', ['top', 'right', 'bottom', 'left']]
        ]);
        const array = [];
        map.forEachIndexing((values, key, index) => {
            array.push(key);
        });
        expect(array.length).toBe(map.size);
    });

    test('Testing forEachBreakable method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']],
            ['position', ['top', 'right', 'bottom', 'left']]
        ]);
        const array = [];
        map.forEachBreakable((values, key) => {
            if (key === 'position') {
                return false;
            }
            array.push(key);
            return true;
        });
        expect(array.length).toBe(1);
    });

    test('Testing hasKeyValue method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']]
        ]);
        expect(map.hasKeyValue('color', 'red')).toBeTruthy();
    });

    test('Testing hasAnyKeys method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']],
            ['position', ['top', 'right', 'bottom', 'left']]
        ]);
        expect(map.hasAnyKeys('color')).toBeTruthy();
    });

    test('Testing hasAllKeys method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']],
            ['position', ['top', 'right', 'bottom', 'left']]
        ]);
        expect(map.hasAllKeys('color', 'position')).toBeTruthy();
    });

    test('Testing hasValue method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']],
            ['position', ['top', 'right', 'bottom', 'left']]
        ]);
        expect(map.hasValue(['red', 'black'], true)).toBeFalsy();
        expect(map.hasValue(['top', 'right'], true)).toBeFalsy();
        expect(map.hasValue(['top', 'right'], false)).toBeTruthy();
    });

    test('Testing hasAnyValues method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']],
            ['position', ['top', 'right', 'bottom', 'left']]
        ]);
        expect(map.hasAnyValues(['red', 'black'], ['green', 'blue'])).toBeFalsy();
        expect(map.hasAnyValues(['top', 'right'], ['top', 'right', 'bottom', 'left'])).toBeTruthy();
    });

    test('Testing hasAllValues method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']],
            ['position', ['top', 'right', 'bottom', 'left']]
        ]);
        expect(map.hasAllValues(['red', 'black'], ['red', 'green', 'blue'])).toBeFalsy();
        expect(map.hasAllValues(['red', 'green', 'blue'], ['top', 'right', 'bottom', 'left'])).toBeTruthy();
    });

    test('Testing Symbol.iterator method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']],
            ['position', ['top', 'right', 'bottom', 'left']]
        ]);
        const array = [];
        for (const [key, values] of map) {
            array.push(key);
        }
        expect(array.length).toBe(map.size);
    });

    test('Testing Symbol.toStringTag method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']]
        ]);
        expect(map[Symbol.toStringTag]).toBeDefined();
    });

    test('Testing toString method', () => {
        const map = MultiValueMap.of([
            ['color', ['red', 'green', 'blue']],
            ['position', ['top', 'right', 'bottom', 'left']]
        ]);
        expect(map.toString()).toEqual('color:[red,green,blue];position:[top,right,bottom,left]');
    });
});
