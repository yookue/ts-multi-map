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


import {MultiKeyMap, type MultiKeyMapEntries} from '@';


/**
 * Map with entries that contains multiple keys and a single value
 *
 * @implements {Omit<Map<Array<K>, V>>}
 */
export class ReadonlyMultiKeyMap<K, V> implements Omit<ReadonlyMap<K[], V>, 'forEach' | 'get' | 'has' | 'entries' | 'keys' | 'values'> {
    private readonly map = new MultiKeyMap<K, V>();

    /**
     * Construct a multi key map instance
     *
     * @param {MultiKeyMapEntries<K, V>} entries the map entries that represented with [K[], V][]
     *
     * @constructor
     *
     * @example
     * const map = new ReadonlyMultiKeyMap([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     */
    public constructor(entries?: MultiKeyMapEntries<K, V>) {
        entries?.forEach(entry => {
            const [keys, value] = entry;
            this.map.set(keys, value);
        });
    }

    /**
     * Returns the value of the given keys
     *
     * @param {Array<K>} keys the keys to retrieve
     * @param {V} defaults the default value if not found
     *
     * @return {V|undefined} the value of the given keys
     *
     * @example
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.get(['row1', 'col1']);    // 'LiLei'
     * map.get(['row2', 'col2'], 'HanMeimei');    // 'HanMeimei'
     */
    public get(keys: K[], defaults?: V): V | undefined {
        return this.map.get(keys, defaults);
    }

    /**
     * Returns the keys array of the map
     *
     * @return {Array<Array<K>>} the keys array of the map
     */
    public keys(): K[][] {
        return this.map.keys();
    }

    /**
     * Returns the values of the map
     *
     * @return {Array<V>} the values of the map
     */
    public values(): V[] {
        return this.map.values();
    }

    /**
     * Returns the keys/value entries of the map
     *
     * @return {Array<Array<K>, V>} the keys/value entries of the map
     */
    public entries(): [K[], V][] {
        return this.map.entries();
    }

    /**
     * Processes each entry in the map
     *
     * @param {function} callback a callback function that processes each entry
     * @param {*} thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEach((value, keys) => {
     *     console.log(value);
     * });
     */
    public forEach(callback: (value?: V, keys?: K[]) => void, thisArg?: any): void {
        this.map.forEach(callback, thisArg);
    }

    /**
     * Processes each entry in the map with index capability
     *
     * @param {function} callback a callback function that processes each entry
     * @param {*} thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEachIndexing((value, keys, index) => {
     *     console.log(index);
     * });
     */
    public forEachIndexing(callback: (value?: V, keys?: K[], index?: number) => void, thisArg?: any): void {
        this.map.forEachIndexing(callback, thisArg);
    }

    /**
     * Processes each entry in the map with breakable capability
     *
     * @param {function} callback a callback function that processes each entry. Returning false indicates to break the map iteration
     * @param {*} thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEachBreakable((value, keys) => {
     *     return true;
     * });
     */
    public forEachBreakable(callback: (value?: V, keys?: K[]) => boolean, thisArg?: any): void {
        this.map.forEachBreakable(callback, thisArg);
    }

    /**
     * Returns whether the map contains the given keys
     *
     * @param {Array<K>} keys the keys to check
     * @return {boolean} whether the map contains the given key
     *
     * @example
     * map.hasKey('row1', 'col1');
     */
    public hasKey(keys: K[]): boolean {
        return this.map.hasKey(keys)
    }

    /**
     * Returns whether the map contains the given keys/value pair
     *
     * @param {Array<K>} keys the keys to check
     * @param {V} value the value to check
     *
     * @return {boolean} whether the map contains the given keys/value pair
     *
     * @example
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.hasKeyValue(['row1', 'col1'], 'LiLei');    // true
     * map.hasKeyValue(['row1', 'col1'], 'HanMeimei');    // false
     */
    public hasKeyValue(keys: K[], value: V): boolean {
        return this.map.hasKeyValue(keys, value);
    }

    /**
     * Returns whether the map contains any of the given keys
     *
     * @param {Array<V>} keys the keys to check
     * @return {boolean} whether the map contains any of the given keys
     *
     * @example
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.hasAnyKeys(['row1', 'col1']);    // true
     * map.hasAnyKeys(['row2', 'col2']);    // false
     */
    public hasAnyKeys(...keys: K[][]): boolean {
        return this.map.hasAnyKeys(...keys);
    }

    /**
     * Returns whether the map contains all the given keys
     *
     * @param {Array<V>} keys the keys to check
     *
     * @return {boolean} whether the map contains all the given keys
     *
     * @example
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.hasAllKeys(['row1', 'col1']);    // true
     * map.hasAllKeys(['row2', 'col2']);    // false
     */
    public hasAllKeys(...keys: K[][]): boolean {
        return this.map.hasAllKeys(...keys);
    }

    /**
     * Returns whether the map contains the given value
     *
     * @param {V} value the value to check
     *
     * @return {boolean} whether the map contains the given value
     *
     * @example
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.hasValue('LiLei');    // true
     * map.hasValue('HanMeimei');    // false
     */
    public hasValue(value: V): boolean {
        return this.map.hasValue(value);
    }

    /**
     * Returns whether the map contains any of the given values
     *
     * @param {Array<V>} values the values to check
     *
     * @return {boolean} whether the map contains any of the given values
     *
     * @example
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.hasAnyValues('LiLei', 'HanMeimei');    // true
     */
    public hasAnyValues(...values: V[]): boolean {
        return this.map.hasAnyValues(...values);
    }

    /**
     * Returns whether the map contains all the given values
     *
     * @param {Array<V>} values the values to check
     *
     * @return {boolean} whether the map contains all the given values
     *
     * @example
     * map.hasAllValues('LiLei');
     */
    public hasAllValues(...values: V[]): boolean {
        return this.map.hasAllValues(...values);
    }

    /**
     * Returns whether the map is empty
     *
     * @return {boolean} whether the map is empty
     */
    public isEmpty(): boolean {
        return this.map.isEmpty();
    }

    /**
     * Returns whether the map is not empty
     *
     * @return {boolean} whether the map is not empty
     */
    public isNotEmpty(): boolean {
        return this.map.isNotEmpty();
    }

    /**
     * Response for returning the list of keys/value to iterate
     *
     * @example
     * for (const [keys, value] of map) {
     *     console.log(value);
     * }
     */
    public [Symbol.iterator](): IterableIterator<[K[], V]> {
        return this.map[Symbol.iterator]();
    }

    /**
     * Returns the size of map
     *
     * @return {number} the size of map
     */
    public get size(): number {
        return this.map.size;
    }

    /**
     * Returns the string representation of the map identifier ('ReadonlyMultiKeyMap')
     *
     * @returns {string} the string representation of the map identifier
     */
    public get [Symbol.toStringTag](): string {
        return 'ReadonlyMultiKeyMap';
    }

    /**
     * Returns the string representation of the map elements
     *
     * @returns {string} the string representation of the map elements
     *
     * @example
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei'],
     *     [['row2', 'col2'], 'HanMeimei']
     * ]);
     * console.log(map.toString());    // [row1,col1]:LiLei;[row2,col2]:HanMeimei
     */
    public toString(): string {
        return this.map.toString();
    }

    /**
     * Construct a multi key map instance
     *
     * @param {MultiKeyMapEntries<K, V>} entries the map entries that represented with [K[], V][]
     *
     * @return {ReadonlyMultiKeyMap} a readonly multi key map instance
     *
     * @example
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     */
    public static of(entries?: MultiKeyMapEntries<any, any>): ReadonlyMultiKeyMap<any, any> {
        return new ReadonlyMultiKeyMap<any, any>(entries);
    }
}
