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


import {RangeMap} from '@yookue/ts-multi-map';


describe('RangeMap', () => {
    test('Testing of method', () => {
        const map = RangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.size).toBe(4);
    });

    test('Testing constructor args', () => {
        const map = new RangeMap([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.size).toBe(4);
    });

    test('Testing size method', () => {
        const map = new RangeMap();
        map.set([1, 30], 'green');
        expect(map.size).toBe(1);
    });

    test('Testing get method', () => {
        const map = RangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.get([1, 30])).toBe('green');
        expect(map.get([30, 60])).toBe('blue');
    });

    test('Testing getByDigit method', () => {
        const map = RangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        expect(map.getByDigit(25)).toBe('white');
        expect(map.getByDigit(50)).toBe('white');
        expect(map.getByDigit(51)).toBeUndefined;
        expect(map.getByDigit(52)).toBe('black');
        expect(map.getByDigit(200)).toBeUndefined();
    });

    test('Testing set method', () => {
        const map = RangeMap.of([
            [[1, 30], 'green']
        ]);
        map.set([60, 90], 'orange');
        expect(map.get([60, 90])).toBe('orange');
    });

    test('Testing keys method', () => {
        const map = RangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        expect(map.keys().length).toBe(2);
    });

    test('Testing values method', () => {
        const map = RangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        expect(map.values()).toStrictEqual(['white', 'black']);
    });

    test('Testing deleteByKey method', () => {
        const map = RangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        map.deleteByKey([1, 50, true, true]);
        expect(map.size).toBe(1);
    });

    test('Testing deleteByKeys method', () => {
        const map = RangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        map.deleteByKeys([[1, 50, true, true], [51, 100, false, true]]);
        expect(map.size).toBe(0);
    });

    test('Testing deleteByValue method', () => {
        const map = RangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        map.deleteByValue('white');
        expect(map.size).toBe(1);
    });

    test('Testing deleteByValues method', () => {
        const map = RangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        map.deleteByValues(['white', 'black']);
        expect(map.size).toBe(0);
    });

    test('Testing forEachIndexing method', () => {
        const map = RangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        const array = [];
        map.forEachIndexing((value, keys, index) => {
            array.push(value);
        });
        expect(array.length).toBe(map.size);
    });

    test('Testing forEachBreakable method', () => {
        const map = RangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        const array = [];
        map.forEachBreakable((value) => {
            if (value === 'black') {
                return false;
            }
            array.push(value);
            return true;
        });
        expect(array.length).toBe(1);
    });

    test('Testing hasKeyValue method', () => {
        const map = RangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasKeyValue([1, 30], 'green')).toBeTruthy();
    });

    test('Testing hasAnyKeys method', () => {
        const map = RangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasAnyKeys([[1, 30], [40, 60]])).toBeTruthy();
    });

    test('Testing hasAllKeys method', () => {
        const map = RangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasAllKeys([[1, 30], [30, 60]])).toBeTruthy();
        expect(map.hasAllKeys([[1, 30], [40, 60]])).toBeFalsy();
    });

    test('Testing hasValue method', () => {
        const map = RangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasValue('green')).toBeTruthy();
        expect(map.hasValue('foobar')).toBeFalsy();
    });

    test('Testing hasAnyValues method', () => {
        const map = RangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasAnyValues(['green', 'blue'])).toBeTruthy();
        expect(map.hasAnyValues(['orange', 'foobar'])).toBeTruthy();
    });

    test('Testing hasAllValues method', () => {
        const map = RangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasAllValues(['green', 'blue'])).toBeTruthy();
        expect(map.hasAllValues(['orange', 'foobar'])).toBeFalsy();
    });

    test('Testing Symbol.iterator method', () => {
        const map = RangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        const array = [];
        for (const [key, values] of map) {
            array.push(key);
        }
        expect(array.length).toBe(map.size);
    });

    test('Testing Symbol.toStringTag method', () => {
        const map = RangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        expect(map[Symbol.toStringTag]).toBeDefined();
    });

    test('Testing toString method', () => {
        const map = RangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        expect(map.toString()).toEqual('[start:1,end:50,startInclusive:true,endInclusive:true]:white;[start:51,end:100,startInclusive:false,endInclusive:true]:black');
    });

    test('Testing range-conflict error', () => {
        expect(() => {
            RangeMap.of([
                [[60, 100, true, false], 'white'],
                [[30, 60, false, false], 'black'],
            ]);
        }).toBeDefined();

        expect(() => {
            RangeMap.of([
                [[60, 100, true, false], 'white'],
                [[30, 60, false, true], 'black'],
            ]);
        }).toThrow(RangeError);

        expect(() => {
            RangeMap.of([
                [[60, 100, true, false], 'white'],
                [[30, 100, false, false], 'black'],
            ]);
        }).toThrow(RangeError);
    });
});
