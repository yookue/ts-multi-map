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
import {MultiValueMap} from './MultiValueMap';


type MapEntry<K, V> = [K[], V];
type MapEntries<K, V> = readonly (readonly [K[], V])[] | null;


/**
 * Map with entries that contains multiple keys and a single value
 *
 * @implements {Omit<Map<Array<K>, V>>}
 */
export class MultiKeyMap<K, V> implements Omit<Map<K[], V>, 'get' | 'set' | 'push' | 'clear' | 'delete' | 'has' | 'keys' | 'values' | 'entries' | 'forEach'> {
    private readonly keysMap = new MultiValueMap<string, K>();
    private readonly valueMap = new Map<string, V>();

    /**
     * Construct a multi key map instance
     *
     * @param {MapEntries<K, V>} entries the map entries that represented with [K[], V][]
     * @constructor
     *
     * @example
     * const map = new MultiKeyMap([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     */
    public constructor(entries?: MapEntries<K, V>) {
        entries?.forEach(entry => {
            const [keys, value] = entry;
            this.set(keys, value);
        });
    }

    /**
     * Returns the value of the given keys
     *
     * @param {Array<K>} keys the keys to retrieve
     * @return {V|undefined} the value of the given keys
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.get(['row1', 'col1']);    // 'LiLei'
     */
    public get(keys: K[]): V | undefined {
        if (keys?.length == 0) {
            return undefined;
        }
        const hash = objectHash(keys);
        return this.valueMap.get(hash);
    }

    /**
     * Sets the value of the given keys
     *
     * @param {Array<K>} keys the keys to set
     * @param {V} value the value to set
     *
     * @example
     * map.set(['row1', 'col1'], 'HanMeimei');
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
        if (this.valueMap.size === 0) {
            return [];
        }
        const result: [K[], V][] = [];
        for (const [k, value] of this.valueMap) {
            result.push([this.keysMap.get(k) || [], value]);
        }
        return result;
    }

    /**
     * Deletes the entry with the given keys
     *
     * @param {Array<K>} keys the keys to delete
     * @return {boolean} whether the entry has been deleted
     *
     * @example
     * map.deleteByKey('row1', 'col1');
     */
    public deleteByKey(...keys: K[]): boolean {
        if (keys?.length === 0) {
            return false;
        }
        const hash = objectHash(keys);
        if (!this.valueMap.has(hash)) {
            return false;
        }
        this.keysMap.deleteByKey(hash);
        this.valueMap.delete(hash);
        return true;
    }

    /**
     * Deletes the entry/entries with the given value
     *
     * @param {V} value the value to delete
     * @return {boolean} whether the entry/entries has been deleted
     *
     * @example
     * map.deleteByValue('LiLei');
     */
    public deleteByValue(value: V): boolean {
        if (this.valueMap.size === 0) {
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
     * @return {boolean} whether any of the entries has been deleted
     *
     * @example
     * map.deleteByValues('LiLei', 'HanMeimei');
     */
    public deleteByValues(...values: V[]): boolean {
        if (values?.length === 0 || this.valueMap.size === 0) {
            return false;
        }
        let result = false;
        for (const value of values) {
            result = result || this.deleteByValue(value);
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
     * map.forEach((keys, value) => {
     *     console.log(value);
     * });
     */
    public forEach(callback: (value?: V, keys?: K[], map?: MultiKeyMap<K, V>) => void, thisArg?: any): void {
        this.entries().forEach(entry => {
            const [keys, value] = entry;
            callback(value, keys, this);
        }, thisArg);
    }

    /**
     * Processes each entry in the map with index capability
     *
     * @param {function} callback a callback function that processes each entry
     * @param {*} thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEachIndexing((keys, value, index) => {
     *     console.log(index);
     * });
     */
    public forEachIndexing(callback: (value?: V, keys?: K[], index?: number, map?: MultiKeyMap<K, V>) => void, thisArg?: any): void {
        let index = 0;
        this.entries().forEach(entry => {
            const [keys, value] = entry;
            callback(value, keys, index++, this);
        }, thisArg);
    }

    /**
     * Processes each entry in the map with breakable capability
     *
     * @param {function} callback a callback function that processes each entry. Returning false indicates to break the map iteration
     * @param {*} thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEachBreakable((keys, value) => {
     *     return true;
     * });
     */
    public forEachBreakable(callback: (value?: V, keys?: K[], map?: MultiKeyMap<K, V>) => boolean, thisArg?: any): void {
        this.entries().forEach(entry => {
            const [keys, value] = entry;
            if (!callback(value, keys, this)) {
                return;
            }
        }, thisArg);
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
        return keys?.length > 0 && this.keysMap.hasValue(keys);
    }

    /**
     * Returns whether the map contains the given keys/value pair
     *
     * @param {Array<K>} keys the keys to check
     * @param {V} value the value to check
     * @return {boolean} whether the map contains the given keys/value pair
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.hasKeyValue(['row1', 'col1'], 'LiLei');    // true
     * map.hasKeyValue(['row1', 'col1'], 'HanMeimei');    // false
     */
    public hasKeyValue(keys: K[], value: V): boolean {
        return keys?.length > 0 && this.get(keys) === value;
    }

    /**
     * Returns whether the map contains any of the given keys
     *
     * @param {Array<V>} keys the keys to check
     * @return {boolean} whether the map contains any of the given keys
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.hasAnyKeys(['row1', 'col1']);    // true
     * map.hasAnyKeys(['row2', 'col2']);    // false
     */
    public hasAnyKeys(...keys: K[][]): boolean {
        if (keys?.length === 0 || this.keysMap.size === 0) {
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
     * @param {Array<V>} keys the keys to check
     * @return {boolean} whether the map contains all the given keys
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.hasAllKeys(['row1', 'col1']);    // true
     * map.hasAllKeys(['row2', 'col2']);    // false
     */
    public hasAllKeys(...keys: K[][]): boolean {
        if (keys?.length === 0 || this.keysMap.size === 0) {
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
     * Returns whether the map contains the given value
     *
     * @param {V} value the value to check
     * @return {boolean} whether the map contains the given value
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.hasValue('LiLei');    // true
     * map.hasValue('HanMeimei');    // false
     */
    public hasValue(value: V): boolean {
        return this.values().includes(value);
    }

    /**
     * Returns whether the map contains any of the given values
     *
     * @param {Array<V>} values the values to check
     * @return {boolean} whether the map contains any of the given values
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     * map.hasAnyValues('LiLei', 'HanMeimei');    // true
     */
    public hasAnyValues(...values: V[]): boolean {
        if (values?.length === 0 || this.valueMap.size === 0) {
            return false;
        }
        for (const value of values) {
            if (this.hasValue(value)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns whether the map contains all the given values
     *
     * @param {Array<V>} values the values to check
     * @return {boolean} whether the map contains all the given values
     *
     * @example
     * map.hasAllValues('LiLei');
     */
    public hasAllValues(...values: V[]): boolean {
        if (values?.length === 0 || this.valueMap.size === 0) {
            return false;
        }
        for (const value of values) {
            if (!this.hasValue(value)) {
                return false;
            }
        }
        return true;
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
     * @returns {string} the string representation of the map identifier
     */
    public get [Symbol.toStringTag](): string {
        return 'MultiKeyMap';
    }

    /**
     * Returns the string representation of the map elements
     *
     * @returns {string} the string representation of the map elements
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei'],
     *     [['row2', 'col2'], 'HanMeimei']
     * ]);
     * console.log(map.toString());    // [row1,col1]:LiLei;[row2,col2]:HanMeimei
     */
    public toString(): string {
        return [...this].map(entry => {
            const [keys, value] = (
                (entry.length <= 1) ? [[], entry[0]] : [entry.slice(0, -1), entry[entry.length - 1]]
            ) as MapEntry<K, V>;
            return `[${keys.join()}]:${value}`;
        }).join(';');
    }

    /**
     * Construct a multi key map instance
     *
     * @param {MapEntries<K, V>} entries the map entries that represented with [K[], V][]
     * @return {MultiKeyMap} a multi key map instance
     *
     * @example
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'LiLei']
     * ]);
     */
    public static of(entries?: MapEntries<any, any>): MultiKeyMap<any, any> {
        return new MultiKeyMap<any, any>(entries);
    }
}
