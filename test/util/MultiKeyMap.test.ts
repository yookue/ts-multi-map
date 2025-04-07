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


import {MultiKeyMap} from '@yookue/ts-multi-map';


describe('MultiKeyMap', () => {
    test('Testing of method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.get(['row1', 'col1'])).toBe('foo');
    });

    test('Testing constructor args', () => {
        const map = new MultiKeyMap([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.get(['row1', 'col1'])).toBe('foo');
    });

    test('Testing size method', () => {
        const map = new MultiKeyMap();
        map.set(['row1', 'col1'], 'foo');
        expect(map.size).toBe(1);
    });

    test('Testing get method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.get(['row1', 'col1'])).toBe('foo');
        expect(map.get(['row2', 'col2'], 'bar')).toBe('bar');
    });

    test('Testing set method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        map.set(['row1', 'col1'], 'bar');
        expect(map.get(['row1', 'col1'])).toBe('bar');
    });

    test('Testing keys method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.keys()).toStrictEqual([['row1', 'col1']]);
    });

    test('Testing values method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.values()).toStrictEqual(['foo']);
    });

    test('Testing deleteByKey method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        map.deleteByKey(['row1', 'col1']);
        expect(map.size).toBe(0);
    });

    test('Testing deleteByKeys method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar'],
        ]);
        map.deleteByKeys([['row1', 'col1'], ['row2', 'col2']]);
        expect(map.size).toBe(0);
    });

    test('Testing deleteByValues method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        map.deleteByValues(['foo']);
        expect(map.size).toBe(0);
    });

    test('Testing undefined key value', () => {
        const map = MultiKeyMap.of([
            [[undefined], undefined],
        ]);
        expect(map.size).toBe(1);
        map.deleteByValues([undefined]);
        expect(map.size).toBe(0);
    });

    test('Testing forEachIndexing method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        const array = [];
        map.forEachIndexing((value) => {
            array.push(value);
        });
        expect(array.length).toBe(map.size);
    });

    test('Testing forEachBreakable method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        const array = [];
        map.forEachBreakable((value, keys) => {
            if (value === 'bar') {
                return false;
            }
            array.push(value);
            return true;
        });
        expect(array.length).toBe(1);
    });

    test('Testing hasKeyValue method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.hasKeyValue(['row1', 'col1'], 'foo')).toBeTruthy();
    });

    test('Testing hasAnyKeys method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.hasAnyKeys([['row1', 'col1'], ['row2', 'col2']])).toBeTruthy();
    });

    test('Testing hasAllKeys method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.hasAllKeys([['row1', 'col1'], ['row2', 'col2']])).toBeFalsy();
    });

    test('Testing hasAnyValues method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        expect(map.hasAnyValues(['foo', 'world'])).toBeTruthy();
    });

    test('Testing hasAllValues method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        expect(map.hasAllValues(['foo', 'bar'])).toBeTruthy();
    });

    test('Testing getKey method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        expect(map.getKey('bar')).toStrictEqual(['row2', 'col2']);
    });

    test('Testing Symbol.iterator method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        const array = [];
        for (const [_keys, value] of map) {
            array.push(value);
        }
        expect(array.length).toBe(map.size);
    });

    test('Testing Symbol.toStringTag method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map[Symbol.toStringTag]).toBeDefined();
    });

    test('Testing toString method', () => {
        expect(new MultiKeyMap().toString()).toEqual('');
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        expect(map.toString()).toEqual('[row1,col1]:foo;[row2,col2]:bar');
    });
});
