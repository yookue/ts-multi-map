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


import {MultiValueMap, type MultiValueMapEntries} from '@';


/**
 * Readonly map with entries that contains a single key and multiple values
 *
 * @implements {ReadonlyMap<Map<K, Array<V>>>}
 */
export class ReadonlyMultiValueMap<K, V> implements Omit<ReadonlyMap<K, V[]>, 'forEach' | 'get' | 'has' | 'entries' | 'keys' | 'values'> {
    private readonly map = new MultiValueMap<K, V>();

    /**
     * Construct a multi value map instance
     *
     * @param {MultiValueMapEntries<K, V>} entries the map entries that represented with [K, V[]][]
     *
     * @constructor
     *
     * @example
     * const map = new ReadonlyMultiValueMap([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     */
    public constructor(entries?: MultiValueMapEntries<K, V>) {
        entries?.forEach(entry => {
            const [key, values] = entry;
            this.map.set(key, values);
        });
    }

    /**
     * Returns the values of the given key
     *
     * @param {K} key the key to retrieve
     * @param {Array<V>} defaults defaults the default values if not found
     *
     * @return {Array<V>|undefined} the values of the given key
     *
     * @example
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.get('color');    // ['red', 'green', 'blue']
     * map.get('foobar', ['foo', 'bar']);    // ['foo', 'bar']
     */
    public get(key: K, defaults?: V[]): V[] | undefined {
        return this.map.get(key, defaults);
    }

    /**
     * Returns the keys of the map
     *
     * @return {Array<K>} the keys of the map
     */
    public keys(): K[] {
        return this.map.keys();
    }

    /**
     * Returns the values array of the map
     *
     * @return {Array<Array<V>>} the values array of the map
     */
    public values(): V[][] {
        return this.map.values();
    }

    /**
     * Returns the key/values entries of the map
     *
     * @return {Array<K, Array<V>>} the key/values entries of the map
     */
    public entries(): [K, V[]][] {
        return this.map.entries();
    }

    /**
     * Processes each entry in the map
     *
     * @param {function} callback a callback function that processes each entry
     * @param {*} thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEach((values, key) => {
     *     console.log(key);
     * });
     */
    public forEach(callback: (values?: V[], key?: K) => void, thisArg?: any): void {
        this.map.forEach(callback, thisArg);
    }

    /**
     * Processes each entry in the map with index capability
     *
     * @param {function} callback a callback function that processes each entry
     * @param {*} thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEachIndexing((values, key, index) => {
     *     console.log(index);
     * });
     */
    public forEachIndexing(callback: (values?: V[], key?: K, index?: number) => void, thisArg?: any): void {
        this.map.forEachIndexing(callback, thisArg);
    }

    /**
     * Processes each entry in the map with breakable capability
     *
     * @param {function} callback a callback function that processes each entry. Returning false indicates to break the map iteration
     * @param {*} thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEachBreakable((values, key) => {
     *     return true;
     * });
     */
    public forEachBreakable(callback: (values?: V[], key?: K) => boolean, thisArg?: any): void {
        this.map.forEachBreakable(callback, thisArg);
    }

    /**
     * Returns whether the map contains the given key
     *
     * @param {K} key the key to check
     *
     * @return {boolean} whether the map contains the given key
     *
     * @example
     * map.hasKey('color');
     */
    public hasKey(key: K): boolean {
        return this.map.hasKey(key);
    }

    /**
     * Returns whether the map contains the given key/value pair
     *
     * @param {K} key the key to check
     * @param {V} value the value to check
     *
     * @return {boolean} whether the map contains the given key/value pair
     *
     * @example
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.hasKeyValue('color', 'red');    // true
     * map.hasKeyValue('color', 'black');    // false
     */
    public hasKeyValue(key: K, value: V): boolean {
        return this.map.hasKeyValue(key, value);
    }

    /**
     * Returns whether the map contains any of the given keys
     *
     * @param {Array<K>} keys the keys to check
     *
     * @return {boolean} whether the map contains any of the given keys
     *
     * @example
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.hasAnyKeys('color', 'position');    // true
     */
    public hasAnyKeys(...keys: K[]): boolean {
        return this.map.hasAnyKeys(...keys);
    }

    /**
     * Returns whether the map contains all the given keys
     *
     * @param {Array<K>} keys the keys to check
     *
     * @return {boolean} whether the map contains all the given keys
     *
     * @example
     * map.hasAllKeys('color', 'position');
     */
    public hasAllKeys(...keys: K[]): boolean {
        return this.map.hasAllKeys(...keys);
    }

    /**
     * Returns whether any entries of the map that contains the given values
     *
     * @param {Array<V>} values the values to check
     * @param {boolean} exact whether matching entry values exactly
     *
     * @return {boolean} whether any entries of the map that contains the given values
     *
     * @example
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']],
     *     ['position', ['top', 'right', 'bottom', 'left']]
     * ]);
     * map.hasValue(['red', 'black'], true);    // false
     * map.hasValue(['top', 'right'], true);    // false
     * map.hasValue(['top', 'right'], false);    // true
     */
    public hasValue(values: V[], exact: boolean = true): boolean {
        return this.map.hasValue(values, exact);
    }

    /**
     * Returns whether the map contains any of the given values, matching exactly
     *
     * @param {Array<V>} values the values to check
     *
     * @return {boolean} whether the map contains any of the given values, matching exactly
     *
     * @example
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']],
     *     ['position', ['top', 'right', 'bottom', 'left']]
     * ]);
     * map.hasAnyValues(['red', 'black'], ['green', 'blue']);    // false
     * map.hasAnyValues(['top', 'right'], ['top', 'right', 'bottom', 'left']);    // true
     */
    public hasAnyValues(...values: V[][]): boolean {
        return this.map.hasAnyValues(...values);
    }

    /**
     * Returns whether the map contains all the given values, matching exactly
     *
     * @param {Array<V>} values the values to check
     *
     * @return {boolean} whether the map contains all the given values, matching exactly
     *
     * @example
     * map.hasAllValues(['red', 'green', 'blue'], ['top', 'right', 'bottom', 'left']);
     */
    public hasAllValues(...values: V[][]): boolean {
        return this.map.hasAllValues(...values);
    }

    /**
     * Returns whether the map is empty
     *
     * @return {boolean} whether the map is empty
     */
    public isEmpty(): boolean {
        return this.map.size === 0;
    }

    /**
     * Returns whether the map is not empty
     *
     * @return {boolean} whether the map is not empty
     */
    public isNotEmpty(): boolean {
        return this.map.size > 0;
    }

    /**
     * Response for returning the list of key/values to iterate
     *
     * @example
     * for (const [key, values] of map) {
     *     console.log(key);
     * }
     */
    public [Symbol.iterator](): IterableIterator<[K, V[]]> {
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
     * Returns the string representation of the map identifier ('ReadonlyMultiValueMap')
     *
     * @returns {string} the string representation of the map identifier
     */
    public get [Symbol.toStringTag](): string {
        return 'ReadonlyMultiValueMap';
    }

    /**
     * Returns the string representation of the map elements
     *
     * @returns {string} the string representation of the map elements
     *
     * @example
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']],
     *     ['position', ['top', 'right', 'bottom', 'left']]
     * ]);
     * console.log(map.toString());    // color:[red,green,blue];position:[top,right,bottom,left]
     */
    public toString(): string {
        return this.map.toString();
    }

    /**
     * Construct a multi value map instance
     *
     * @param {MultiValueMapEntries<K, V>} entries the map entries that represented with [K, V[]][]
     *
     * @return {ReadonlyMultiValueMap} a readonly multi value map instance
     *
     * @example
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     */
    public static of(entries?: MultiValueMapEntries<any, any>): ReadonlyMultiValueMap<any, any> {
        return new ReadonlyMultiValueMap<any, any>(entries);
    }
}
