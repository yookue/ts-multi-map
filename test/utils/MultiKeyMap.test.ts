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
    test('Testing constructor args', () => {
        const map = new MultiKeyMap([
            [['row1', 'col1'], 'LiLei']
        ]);
        expect(map.get('row1', 'col1')).toBe('LiLei');
    });

    test('Testing of method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei']
        ]);
        expect(map.get('row1', 'col1')).toBe('LiLei');
    });

    test('Testing size method', () => {
        const map = new MultiKeyMap();
        map.set(['row1', 'col1'], 'LiLei');
        expect(map.size).toBe(1);
    });

    test('Testing set method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei']
        ]);
        map.set(['row1', 'col1'], 'HanMeimei');
        expect(map.get('row1', 'col1')).toBe('HanMeimei');
    });

    test('Testing deleteByKey method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei']
        ]);
        map.deleteByKey('row1', 'col1');
        expect(map.size).toBe(0);
    });

    test('Testing deleteByValues method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei']
        ]);
        map.deleteByValues('LiLei');
        expect(map.size).toBe(0);
    });

    test('Testing undefined key value', () => {
        const map = MultiKeyMap.of([
            [[undefined], undefined],
        ]);
        expect(map.size).toBe(1);
        map.deleteByValues(undefined);
        expect(map.size).toBe(0);
    });

    test('Testing forEachIndexing method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei'],
            [['row2', 'col2'], 'HanMeimei']
        ]);
        const array = [];
        map.forEachIndexing((value, keys, index) => {
            array.push(value);
        });
        expect(array.length).toBe(map.size);
    });

    test('Testing forEachBreakable method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei'],
            [['row2', 'col2'], 'HanMeimei']
        ]);
        const array = [];
        map.forEachBreakable((value, keys) => {
            if (value === 'HanMeimei') {
                return false;
            }
            array.push(value);
            return true;
        });
        expect(array.length).toBe(1);
    });

    test('Testing hasKeyValue method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei']
        ]);
        expect(map.hasKeyValue(['row1', 'col1'], 'LiLei')).toBeTruthy();
    });

    test('Testing hasAnyValues method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei'],
            [['row2', 'col2'], 'HanMeimei']
        ]);
        expect(map.hasAnyValues('LiLei', 'Poly')).toBeTruthy();
    });

    test('Testing hasAllValues method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei'],
            [['row2', 'col2'], 'HanMeimei']
        ]);
        expect(map.hasAllValues('LiLei', 'HanMeimei')).toBeTruthy();
    });

    test('Testing Symbol.iterator method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei'],
            [['row2', 'col2'], 'HanMeimei']
        ]);
        const array = [];
        for (const [keys, value] of map) {
            array.push(value);
        }
        expect(array.length).toBe(map.size);
    });

    test('Testing Symbol.toStringTag method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei']
        ]);
        expect(map[Symbol.toStringTag]).not.toBeUndefined();
    });

    test('Testing toString method', () => {
        const map = MultiKeyMap.of([
            [['row1', 'col1'], 'LiLei'],
            [['row2', 'col2'], 'HanMeimei']
        ]);
        expect(map.toString()).toEqual('[row1,col1]:LiLei;[row2,col2]:HanMeimei');
    });
});
