/*
 * Copyright (c) 2023 Unikue Ltd. All rights reserved.
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


import {ReadonlyMultiKeyMap} from '@unikue/ts-multi-map';


describe('ReadonlyMultiKeyMap', () => {
    test('Testing of method', () => {
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.get(['row1', 'col1'])).toBe('foo');
    });

    test('Testing constructor args', () => {
        const map = new ReadonlyMultiKeyMap([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.get(['row1', 'col1'])).toBe('foo');
    });

    test('Testing get method', () => {
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.get(['row1', 'col1'])).toBe('foo');
        expect(map.get(['row2', 'col2'], 'bar')).toBe('bar');
    });

    test('Testing keys method', () => {
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.keys()).toStrictEqual([['row1', 'col1']]);
    });

    test('Testing values method', () => {
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.values()).toStrictEqual(['foo']);
    });

    test('Testing undefined key value', () => {
        const map = ReadonlyMultiKeyMap.of([
            [[undefined], undefined],
        ]);
        expect(map.size).toBe(1);
    });

    test('Testing forEachIndexing method', () => {
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        const array = [];
        map.forEachIndexing((value, keys, index) => {
            array.push(value);
        });
        expect(array.length).toBe(map.size);
    });

    test('Testing forEachBreakable method', () => {
        const map = ReadonlyMultiKeyMap.of([
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
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.hasKeyValue(['row1', 'col1'], 'foo')).toBeTruthy();
    });

    test('Testing hasAnyKeys method', () => {
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.hasAnyKeys([['row1', 'col1'], ['row2', 'col2']])).toBeTruthy();
    });

    test('Testing hasAllKeys method', () => {
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map.hasAllKeys([['row1', 'col1'], ['row2', 'col2']])).toBeFalsy();
    });

    test('Testing hasAnyValues method', () => {
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        expect(map.hasAnyValues(['foo', 'world'])).toBeTruthy();
    });

    test('Testing hasAllValues method', () => {
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        expect(map.hasAllValues(['foo', 'bar'])).toBeTruthy();
    });

    test('Testing getKey method', () => {
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        expect(map.getKey('bar')).toStrictEqual(['row2', 'col2']);
    });

    test('Testing Symbol.iterator method', () => {
        const map = ReadonlyMultiKeyMap.of([
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
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo']
        ]);
        expect(map[Symbol.toStringTag]).toBeDefined();
    });

    test('Testing toString method', () => {
        expect(ReadonlyMultiKeyMap.of().toString()).toEqual('');
        const map = ReadonlyMultiKeyMap.of([
            [['row1', 'col1'], 'foo'],
            [['row2', 'col2'], 'bar']
        ]);
        expect(map.toString()).toEqual('[row1,col1]:foo;[row2,col2]:bar');
    });
});
