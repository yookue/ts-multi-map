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


type MapEntry<K, V> = [K, V[]];
type MapEntries<K, V> = readonly (readonly [K, V[]])[] | null;


/**
 * Map with entries that contains a single key and multiple values
 *
 * @implements {Omit<Map<K, Array<V>>>}
 */
export class MultiValueMap<K, V> implements Omit<Map<K, V[]>, 'get' | 'set' | 'push' | 'clear' | 'delete' | 'has' | 'keys' | 'values' | 'entries' | 'forEach'> {
    private readonly map = new Map<K, V[]>();

    /**
     * Construct a multi value map instance
     *
     * @param {MapEntries<K, V>} entries the map entries that represented with [K, V[]][]
     * @constructor
     *
     * @example
     * const map = new MultiValueMap([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     */
    public constructor(entries?: MapEntries<K, V>) {
        entries?.forEach(entry => {
            const [key, values] = entry;
            this.set(key, values);
        });
    }

    /**
     * Returns the values of the given key
     *
     * @param {K} key the key to retrieve
     * @return {Array<V>|undefined} the values of the given key
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.get('color');    // ['red', 'green', 'blue']
     */
    public get(key: K): V[] | undefined {
        return this.map.get(key);
    }

    /**
     * Sets the values of the given key
     *
     * @param {K} key the key to set
     * @param {Array<V>} values the values to set
     *
     * @example
     * map.set('color', ['red', 'green', 'blue']);
     */
    public set(key: K, values: V[]): void {
        this.map.set(key, values);
    }

    /**
     * Push values onto the given key, the values will be appended to the given key
     *
     * @param {K} key the key to operate
     * @param {Array<V>} values the values to push
     *
     * @example
     * map.push('color', ['yellow', 'black']);
     */
    public push(key: K, values: V[]): void {
        const array = this.get(key) || [];
        array.push(...values);
        this.map.set(key, array);
    }

    /**
     * Clears the map
     */
    public clear(): void {
        this.map.clear();
    }

    /**
     * Returns the keys of the map
     *
     * @return {Array<K>} the keys of the map
     */
    public keys(): K[] {
        return [...this.map.keys()];
    }

    /**
     * Returns the values array of the map
     *
     * @return {Array<Array<V>>} the values array of the map
     */
    public values(): V[][] {
        return [...this.map.values()];
    }

    /**
     * Returns the key/values entries of the map
     *
     * @return {Array<K, Array<V>>} the key/values entries of the map
     */
    public entries(): [K, V[]][] {
        return [...this.map.entries()];
    }

    /**
     * Deletes the entry with the given key
     *
     * @param {K} key the key to delete
     * @return {boolean} whether the entry has been deleted
     *
     * @example
     * map.deleteByKey('color');
     */
    public deleteByKey(key: K): boolean {
        return this.map.delete(key);
    }

    /**
     * Deletes all the entries with any of the given keys
     *
     * @param {Array<K>} keys the keys to delete
     * @return {boolean} whether any of the entries has been deleted
     *
     * @example
     * map.deleteByKeys('color', 'position');
     */
    public deleteByKeys(...keys: K[]): boolean {
        if (keys?.length === 0 || this.map.size === 0) {
            return false;
        }
        let result = false;
        for (const key of keys) {
            result = result || this.map.delete(key);
        }
        return result;
    }

    /**
     * Deletes the entry/entries with the given value
     *
     * @param {V} value the value to delete
     * @return {boolean} whether the entry/entries has been deleted
     *
     * @example
     * map.deleteByValue('red');
     */
    public deleteByValue(value: V): boolean {
        if (this.map.size === 0) {
            return false;
        }
        let result = false;
        for (const [key, values] of this.entries()) {
            if (values?.includes(value)) {
                result = result || this.map.delete(key);
            }
        }
        return result;
    }

    /**
     * Deletes all the entries with any of the given values
     *
     * @param {Array<V>} values the values to delete
     * @return {boolean} whether any of the entries has been deleted
     *
     * @example
     * map.deleteByValues('green', 'blue');
     */
    public deleteByValues(...values: V[]): boolean {
        if (values?.length === 0 || this.map.size === 0) {
            return false;
        }
        let result = false;
        for (const value of values) {
            result = result || this.deleteByValue(value);
        }
        return result;
    }

    /**
     * Deletes a value for the given key from the map, keeping other values
     *
     * @param {K} key the key to operate
     * @param {V} value the value to delete
     * @return {boolean} whether the value has been removed
     *
     * @example
     * map.deleteValueOfKey('color', 'blue');
     */
    public deleteValueOfKey(key: K, value: V): boolean {
        let array = this.get(key) || [];
        if (!array.includes(value)) {
            return false;
        }
        array = array.filter(v => v !== value);
        this.map.set(key, array);
        return true;
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
    public forEach(callback: (values?: V[], key?: K, map?: MultiValueMap<K, V>) => void, thisArg?: any): void {
        this.map.forEach((values, key) => {
            callback(values, key, this);
        }, thisArg);
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
    public forEachIndexing(callback: (values?: V[], key?: K, index?: number, map?: MultiValueMap<K, V>) => void, thisArg?: any): void {
        let index = 0;
        this.map.forEach((values, key) => {
            callback(values, key, index++, this);
        }, thisArg);
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
    public forEachBreakable(callback: (values?: V[], key?: K, map?: MultiValueMap<K, V>) => boolean, thisArg?: any): void {
        this.map.forEach((values, key) => {
            if (!callback(values, key, this)) {
                return;
            }
        }, thisArg);
    }

    /**
     * Returns whether the map contains the given key
     *
     * @param {K} key the key to check
     * @return {boolean} whether the map contains the given key
     *
     * @example
     * map.hasKey('color');
     */
    public hasKey(key: K): boolean {
        return this.map.has(key);
    }

    /**
     * Returns whether the map contains the given key/value pair
     *
     * @param {K} key the key to check
     * @param {V} value the value to check
     * @return {boolean} whether the map contains the given key/value pair
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.hasKeyValue('color', 'red');    // true
     * map.hasKeyValue('color', 'black');    // false
     */
    public hasKeyValue(key: K, value: V): boolean {
        if (this.map.size === 0) {
            return false;
        }
        const array = this.get(key) || [];
        return array.includes(value);
    }

    /**
     * Returns whether the map contains any of the given keys
     *
     * @param {Array<K>} keys the keys to check
     * @return {boolean} whether the map contains any of the given keys
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.hasAnyKeys('color', 'position');    // true
     */
    public hasAnyKeys(...keys: K[]): boolean {
        if (keys?.length === 0 || this.map.size === 0) {
            return false;
        }
        for (const key of keys) {
            if (this.hasKey(key)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns whether the map contains all the given keys
     *
     * @param {Array<K>} keys the keys to check
     * @return {boolean} whether the map contains all the given keys
     *
     * @example
     * map.hasAllKeys('color', 'position');
     */
    public hasAllKeys(...keys: K[]): boolean {
        if (keys?.length === 0 || this.map.size === 0) {
            return false;
        }
        for (const key of keys) {
            if (!this.hasKey(key)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns whether any entries of the map that contains the given values
     *
     * @param {Array<V>} values the values to check
     * @param {boolean} exact whether matching entry values exactly
     * @return {boolean} whether any entries of the map that contains the given values
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']],
     *     ['position', ['top', 'right', 'bottom', 'left']]
     * ]);
     * map.hasValue(['red', 'black'], true);    // false
     * map.hasValue(['top', 'right'], true);    // false
     * map.hasValue(['top', 'right'], false);    // true
     */
    public hasValue(values: V[], exact: boolean = true): boolean {
        if (values?.length === 0 || this.map.size === 0) {
            return false;
        }
        for (const array of this.map.values()) {
            let result = true;
            for (const v of values) {
                result = result && array.includes(v) && (exact ? array.length === values.length : true);
                if (!result) {
                    break;
                }
            }
            if (result) {
                return true;
            }
        }
        return false;
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
     * Returns the string representation of the map identifier ('MultiValueMap')
     *
     * @returns {string} the string representation of the map identifier
     */
    public get [Symbol.toStringTag](): string {
        return 'MultiValueMap';
    }

    /**
     * Returns the string representation of the map elements
     *
     * @returns {string} the string representation of the map elements
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']],
     *     ['position', ['top', 'right', 'bottom', 'left']]
     * ]);
     * console.log(map.toString());    // color:[red,green,blue];position:[top,right,bottom,left]
     */
    public toString(): string {
        return [...this].map(entry => {
            const [key, values] = (
                (entry.length <= 1) ? [[], entry[0]] : [entry.slice(0, -1), entry[entry.length - 1]]
            ) as MapEntry<K, V>;
            return `${key}:[${values.join()}]`;
        }).join(';');
    }

    /**
     * Construct a multi value map instance
     *
     * @param {MapEntries<K, V>} entries the map entries that represented with [K, V[]][]
     * @return {MultiValueMap} a multi value map instance
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     */
    public static of(entries?: MapEntries<any, any>): MultiValueMap<any, any> {
        return new MultiValueMap<any, any>(entries);
    }
}
