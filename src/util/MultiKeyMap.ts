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


import objectHash from 'object-hash';
import {MultiValueMap, type MultiKeyMapEntry, type MultiKeyMapEntries} from '@';


/**
 * Map with entries that contains multiple keys and a single value
 *
 * @implements {Omit<Map<Array<K>, V>>}
 */
export class MultiKeyMap<K, V> implements Omit<Map<K[], V>, 'delete' | 'forEach' | 'get' | 'has' | 'set' | 'entries' | 'keys' | 'values' | 'push'> {
    private readonly keysMap = new MultiValueMap<string, K>();
    private readonly valueMap = new Map<string, V>();

    /**
     * Construct a multi key map instance
     *
     * @param {MultiKeyMapEntries<K, V>} entries the map entries that represented as [K[], V][]
     *
     * @return {MultiKeyMap} a multi key map instance
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     */
    public static of(entries?: MultiKeyMapEntries<any, any>): MultiKeyMap<any, any> {
        return new MultiKeyMap<any, any>(entries);
    }

    /**
     * Construct a multi key map instance
     *
     * @param {MultiKeyMapEntries<K, V>} entries the map entries that represented as [K[], V][]
     *
     * @constructor
     *
     * @example
     * const map = new MultiKeyMap([
     *     [['row1', 'col1'], 'foo']
     * ]);
     */
    public constructor(entries?: MultiKeyMapEntries<K, V>) {
        entries?.forEach(entry => {
            const [keys, value] = entry;
            this.set(keys, value);
        });
    }

    /**
     * Returns the value of the given keys
     *
     * @param {Array<K>} keys the keys to retrieve
     * @param {V} defaults the default value if not found
     *
     * @return {V} the value of the given keys
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.get(['row1', 'col1']);    // 'foo'
     * map.get(['row2', 'col2'], 'bar');    // 'bar'
     */
    public get(keys: K[], defaults?: V): V | undefined {
        if (keys?.length == 0 || this.isEmpty()) {
            return defaults;
        }
        const hash = objectHash(keys);
        return this.valueMap.get(hash) ?? defaults;
    }

    /**
     * Sets the value of the given keys
     *
     * @param {Array<K>} keys the keys to set
     * @param {V} value the value to set
     *
     * @example
     * map.set(['row1', 'col1'], 'bar');
     */
    public set(keys: K[], value: V): void {
        if (keys?.length == 0) {
            return;
        }
        const hash = objectHash(keys);
        this.keysMap.set(hash, [...keys]);
        this.valueMap.set(hash, value);
    }

    /**
     * Clears the map
     */
    public clear(): void {
        this.keysMap.clear();
        this.valueMap.clear();
    }

    /**
     * Returns the keys array of the map
     *
     * @return {Array<Array<K>>} the keys array of the map
     */
    public keys(): K[][] {
        return [...this.keysMap.values()];
    }

    /**
     * Returns the values of the map
     *
     * @return {Array<V>} the values of the map
     */
    public values(): V[] {
        return [...this.valueMap.values()];
    }

    /**
     * Returns the keys/value entries of the map
     *
     * @return {Array<Array<K>, V>} the keys/value entries of the map
     */
    public entries(): [K[], V][] {
        if (this.isEmpty()) {
            return [];
        }
        const result: [K[], V][] = [];
        for (const [k, value] of this.valueMap) {
            result.push([this.keysMap.get(k) ?? [], value]);
        }
        return result;
    }

    /**
     * Deletes the entry with the given key
     *
     * @param {Array<K>} key the key to delete
     *
     * @return {boolean} whether the entry has been deleted
     *
     * @example
     * map.deleteByKey(['row1', 'col1']);
     */
    public deleteByKey(key: K[]): boolean {
        if (key?.length === 0) {
            return false;
        }
        const hash = objectHash(key);
        if (!this.valueMap.has(hash)) {
            return false;
        }
        this.keysMap.deleteByKey(hash);
        this.valueMap.delete(hash);
        return true;
    }

    /**
     * Deletes all the entries with the given keys
     *
     * @param {Array<Array<K>>} keys the keys to delete
     *
     * @return {boolean} whether any of the entries has been deleted
     *
     * @example
     * map.deleteByKey([['row1', 'col1'], ['row2', 'col2']]);
     */
    public deleteByKeys(keys: K[][]): boolean {
        if (keys?.length === 0 || this.isEmpty()) {
            return false;
        }
        let result = false;
        for (const key of keys) {
            if (this.deleteByKey(key)) {
                result = true;
            }
        }
        return result;
    }

    /**
     * Deletes the entry/entries with the given value
     *
     * @param {V} value the value to delete
     *
     * @return {boolean} whether the entry/entries has been deleted
     *
     * @example
     * map.deleteByValue('foo');
     */
    public deleteByValue(value: V): boolean {
        if (this.isEmpty()) {
            return false;
        }
        let result = false;
        for (const [k, v] of this.valueMap.entries()) {
            if (v === value) {
                this.keysMap.deleteByKey(k);
                this.valueMap.delete(k);
                result = true;
            }
        }
        return result;
    }

    /**
     * Deletes all the entries with any of the given values
     *
     * @param {Array<V>} values the values to delete
     *
     * @return {boolean} whether any of the entries has been deleted
     *
     * @example
     * map.deleteByValues(['foo', 'bar']);
     */
    public deleteByValues(values: V[]): boolean {
        if (values?.length === 0 || this.isEmpty()) {
            return false;
        }
        let result = false;
        for (const value of values) {
            if (this.deleteByValue(value)) {
                result = true;
            }
        }
        return result;
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
        this.entries().forEach(entry => {
            const [keys, value] = entry;
            callback(value, keys);
        }, thisArg);
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
        let index = 0;
        this.entries().forEach(entry => {
            const [keys, value] = entry;
            callback(value, keys, index++);
        }, thisArg);
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
        this.entries().forEach(entry => {
            const [keys, value] = entry;
            if (!callback(value, keys)) {
                return;
            }
        }, thisArg);
    }

    /**
     * Returns whether the map contains the given keys
     *
     * @param {Array<K>} keys the keys to check
     * @param {boolean} exact whether matching entry values exactly
     *
     * @return {boolean} whether the map contains the given key
     *
     * @example
     * map.hasKey(['row1', 'col1']);
     */
    public hasKey(keys: K[], exact: boolean = true): boolean {
        return keys?.length > 0 && this.keysMap.hasValue(keys, exact);
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
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasKeyValue(['row1', 'col1'], 'foo');    // true
     * map.hasKeyValue(['row1', 'col1'], 'bar');    // false
     */
    public hasKeyValue(keys: K[], value: V): boolean {
        return keys?.length > 0 && this.get(keys) === value;
    }

    /**
     * Returns whether the map contains any of the given keys
     *
     * @param {Array<V>} keys the keys to check
     * @param {boolean} exact whether matching entry values exactly
     *
     * @return {boolean} whether the map contains any of the given keys
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasAnyKeys([['row1', 'col1'], ['row2', 'col2']]);    // true
     */
    public hasAnyKeys(keys: K[][], exact: boolean = true): boolean {
        return this.isNotEmpty() && keys?.length > 0 && keys.some(item => this.hasKey(item, exact));
    }

    /**
     * Returns whether the map contains all the given keys
     *
     * @param {Array<V>} keys the keys to check
     * @param {boolean} exact whether matching entry values exactly
     *
     * @return {boolean} whether the map contains all the given keys
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasAllKeys([['row1', 'col1'], ['row2', 'col2']]);    // false
     */
    public hasAllKeys(keys: K[][], exact: boolean = true): boolean {
        return this.isNotEmpty() && keys?.length > 0 && keys.every(item => this.hasKey(item, exact));
    }

    /**
     * Returns whether the map contains the given value
     *
     * @param {V} value the value to check
     *
     * @return {boolean} whether the map contains the given value
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasValue('foo');    // true
     * map.hasValue('bar');    // false
     */
    public hasValue(value: V): boolean {
        return this.values().includes(value);
    }

    /**
     * Returns whether the map contains any of the given values
     *
     * @param {Array<V>} values the values to check
     *
     * @return {boolean} whether the map contains any of the given values
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasAnyValues(['foo', 'bar']);    // true
     */
    public hasAnyValues(values: V[]): boolean {
        return this.isNotEmpty() && values?.length > 0 && values.some(item => this.hasValue(item));
    }

    /**
     * Returns whether the map contains all the given values
     *
     * @param {Array<V>} values the values to check
     *
     * @return {boolean} whether the map contains all the given values
     *
     * @example
     * map.hasAllValues(['foo']);
     */
    public hasAllValues(values: V[]): boolean {
        return this.isNotEmpty() && values?.length > 0 && values.every(item => this.hasValue(item));
    }

    /**
     * Returns whether the map is empty
     *
     * @return {boolean} whether the map is empty
     */
    public isEmpty(): boolean {
        return this.valueMap.size === 0;
    }

    /**
     * Returns whether the map is not empty
     *
     * @return {boolean} whether the map is not empty
     */
    public isNotEmpty(): boolean {
        return this.valueMap.size > 0;
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
        return this.entries()[Symbol.iterator]();
    }

    /**
     * Returns the size of map
     *
     * @return {number} the size of map
     */
    public get size(): number {
        return this.valueMap.size;
    }

    /**
     * Returns the string representation of the map identifier ('MultiKeyMap')
     *
     * @return {string} the string representation of the map identifier
     */
    public get [Symbol.toStringTag](): string {
        return 'MultiKeyMap';
    }

    /**
     * Returns the string representation of the map elements
     *
     * @return {string} the string representation of the map elements
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo'],
     *     [['row2', 'col2'], 'bar']
     * ]);
     * console.log(map.toString());    // '[row1,col1]:foo;[row2,col2]:bar'
     */
    public toString(): string {
        return [...this].map(entry => {
            const [keys, value] = (
                (entry.length <= 1) ? [[], entry[0]] : [entry.slice(0, -1), entry[entry.length - 1]]
            ) as MultiKeyMapEntry<K, V>;
            return `[${keys.join()}]:${value}`;
        }).join(';');
    }
}
