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


import {ReadonlyRangeMap} from '@unikue/ts-multi-map';


describe('ReadonlyRangeMap', () => {
    test('Testing of method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.size).toBe(4);
    });

    test('Testing constructor args', () => {
        const map = new ReadonlyRangeMap([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.size).toBe(4);
    });

    test('Testing get method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.get([1, 30])).toBe('green');
        expect(map.get([30, 60])).toBe('blue');
    });

    test('Testing getByDigit method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        expect(map.getByDigit(25)).toBe('white');
        expect(map.getByDigit(50)).toBe('white');
        expect(map.getByDigit(51)).toBeUndefined();
        expect(map.getByDigit(52)).toBe('black');
        expect(map.getByDigit(200)).toBeUndefined();
    });

    test('Testing keys method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        expect(map.keys().length).toBe(2);
    });

    test('Testing values method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        expect(map.values()).toStrictEqual(['white', 'black']);
    });

    test('Testing forEachIndexing method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        const array = [];
        map.forEachIndexing((value) => {
            // @ts-ignore
            array.push(value);
        });
        expect(array.length).toBe(map.size);
    });

    test('Testing forEachBreakable method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        const array = [];
        map.forEachBreakable((value) => {
            if (value === 'black') {
                return false;
            }
            // @ts-ignore
            array.push(value);
            return true;
        });
        expect(array.length).toBe(1);
    });

    test('Testing hasKeyValue method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasKeyValue([1, 30], 'green')).toBeTruthy();
    });

    test('Testing hasAnyKeys method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasAnyKeys([[1, 30], [40, 60]])).toBeTruthy();
    });

    test('Testing hasAllKeys method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasAllKeys([[1, 30], [30, 60]])).toBeTruthy();
        expect(map.hasAllKeys([[1, 30], [40, 60]])).toBeFalsy();
    });

    test('Testing hasValue method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasValue('green')).toBeTruthy();
        expect(map.hasValue('foobar')).toBeFalsy();
    });

    test('Testing hasAnyValues method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasAnyValues(['green', 'blue'])).toBeTruthy();
        expect(map.hasAnyValues(['orange', 'foobar'])).toBeTruthy();
    });

    test('Testing hasAllValues method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        expect(map.hasAllValues(['green', 'blue'])).toBeTruthy();
        expect(map.hasAllValues(['orange', 'foobar'])).toBeFalsy();
    });

    test('Testing Symbol.iterator method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 30], 'green'],
            [[30, 60], 'blue'],
            [[60, 90], 'orange'],
            [[90, 100, true, true], 'red']
        ]);
        const array = [];
        for (const [key] of map) {
            // @ts-ignore
            array.push(key);
        }
        expect(array.length).toBe(map.size);
    });

    test('Testing Symbol.toStringTag method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        expect(map[Symbol.toStringTag]).toBeDefined();
    });

    test('Testing toString method', () => {
        const map = ReadonlyRangeMap.of([
            [[1, 50, true, true], 'white'],
            [[51, 100, false, true], 'black']
        ]);
        expect(map.toString()).toEqual('[start:1,end:50,startInclusive:true,endInclusive:true]:white;[start:51,end:100,startInclusive:false,endInclusive:true]:black');
    });

    test('Testing range-conflict error', () => {
        expect(() => {
            ReadonlyRangeMap.of([
                [[60, 100, true, false], 'white'],
                [[30, 60, false, false], 'black'],
            ]);
        }).toBeDefined();

        expect(() => {
            ReadonlyRangeMap.of([
                [[60, 100, true, false], 'white'],
                [[30, 60, false, true], 'black'],
            ]);
        }).toThrow(RangeError);

        expect(() => {
            ReadonlyRangeMap.of([
                [[60, 100, true, false], 'white'],
                [[30, 100, false, false], 'black'],
            ]);
        }).toThrow(RangeError);
    });
});
