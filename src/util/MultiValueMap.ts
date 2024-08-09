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


import {type MultiValueMapEntry, type MultiValueMapEntries} from '@';


/**
 * Map with entries that contains a single key and multiple values
 *
 * @implements Map<K, V[]>
 *
 * @author David Hsing
 */
// noinspection JSUnusedGlobalSymbols
export class MultiValueMap<K, V> implements Omit<Map<K, V[]>, 'delete' | 'forEach' | 'get' | 'has' | 'set' | 'entries' | 'keys' | 'values' | 'push'> {
    private readonly map = new Map<K, V[]>();

    /**
     * Construct a multi value map instance
     *
     * @param entries the map entries that represented as [K, V[]][]
     *
     * @returns a multi value map instance
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     */
    public static of<K, V>(entries?: MultiValueMapEntries<K, V>): MultiValueMap<K, V> {
        return new MultiValueMap(entries);
    }

    /**
     * Construct a multi value map instance
     *
     * @param entries the map entries that represented as [K, V[]][]
     *
     * @constructor
     *
     * @example
     * const map = new MultiValueMap([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     */
    public constructor(entries?: MultiValueMapEntries<K, V>) {
        entries?.forEach(entry => {
            const [key, values] = entry;
            this.set(key, values);
        });
    }

    /**
     * Returns the values of the given key
     *
     * @param key the key to retrieve
     * @param defaults the default values if not found
     *
     * @returns the values of the given key
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.get('color');    // ['red', 'green', 'blue']
     * map.get('foobar', ['foo', 'bar']);    // ['foo', 'bar']
     */
    public get(key: K, defaults?: V[]): V[] | undefined {
        return this.map.get(key) ?? defaults;
    }

    /**
     * Sets the values of the given key
     *
     * @param key the key to set
     * @param values the values to set
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
     * @param key the key to operate
     * @param values the values to push
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
     * @returns the keys of the map
     */
    public keys(): K[] {
        return [...this.map.keys()];
    }

    /**
     * Returns the values array of the map
     *
     * @returns the values array of the map
     */
    public values(): V[][] {
        return [...this.map.values()];
    }

    /**
     * Returns the key/values entries of the map
     *
     * @returns the key/values entries of the map
     */
    public entries(): [K, V[]][] {
        return [...this.map.entries()];
    }

    /**
     * Deletes the entry with the given key
     *
     * @param key the key to delete
     *
     * @returns whether the entry has been deleted
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
     * @param keys the keys to delete
     *
     * @returns whether any of the entries has been deleted
     *
     * @example
     * map.deleteByKeys(['color', 'position']);
     */
    public deleteByKeys(keys: K[]): boolean {
        if (keys.length === 0 || this.isEmpty()) {
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
     * @param value the value to delete
     *
     * @returns whether the entry/entries has been deleted
     *
     * @example
     * map.deleteByValue('red');
     */
    public deleteByValue(value: V): boolean {
        if (this.isEmpty()) {
            return false;
        }
        let result = false;
        for (const [key, values] of this.entries()) {
            if (values?.includes(value) && this.map.delete(key)) {
                result = true;
            }
        }
        return result;
    }

    /**
     * Deletes all the entries with any of the given values
     *
     * @param values the values to delete
     *
     * @returns whether any of the entries has been deleted
     *
     * @example
     * map.deleteByValues(['green', 'blue']);
     */
    public deleteByValues(values: V[]): boolean {
        if (values.length === 0 || this.isEmpty()) {
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
     * Deletes a value for the given key from the map, keeping other values
     *
     * @param key the key to operate
     * @param value the value to delete
     *
     * @returns whether the value has been removed
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
     * @param callback a callback function that processes each entry
     * @param thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEach((values, key) => {
     *     console.log(key);
     * });
     */
    public forEach(callback: (values: V[], key: K) => void, thisArg?: any): void {
        this.map.forEach((vs, k) => {
            callback(vs, k);
        }, thisArg);
    }

    /**
     * Processes each entry in the map with index capability
     *
     * @param callback a callback function that processes each entry
     * @param thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEachIndexing((values, key, index) => {
     *     console.log(index);
     * });
     */
    public forEachIndexing(callback: (values: V[], key: K, index: number) => void, thisArg?: any): void {
        let index = 0;
        this.map.forEach((vs, k) => {
            callback(vs, k, index++);
        }, thisArg);
    }

    /**
     * Processes each entry in the map with breakable capability
     *
     * @param callback a callback function that processes each entry. Returning false indicates to break the map iteration
     * @param thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEachBreakable((values, key) => {
     *     return true;
     * });
     */
    public forEachBreakable(callback: (values: V[], key: K) => boolean, thisArg?: any): void {
        this.map.forEach((vs, k) => {
            if (!callback(vs, k)) {
                return;
            }
        }, thisArg);
    }

    /**
     * Returns whether the map contains the given key
     *
     * @param key the key to check
     *
     * @returns whether the map contains the given key
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
     * @param key the key to check
     * @param value the value to check
     *
     * @returns whether the map contains the given key/value pair
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.hasKeyValue('color', 'red');    // true
     * map.hasKeyValue('color', 'black');    // false
     */
    public hasKeyValue(key: K, value: V): boolean {
        return this.isNotEmpty() && (this.get(key) ?? []).includes(value);
    }

    /**
     * Returns whether the map contains any of the given keys
     *
     * @param keys the keys to check
     *
     * @returns whether the map contains any of the given keys
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.hasAnyKeys(['color', 'position']);    // true
     */
    public hasAnyKeys(keys: K[]): boolean {
        return this.isNotEmpty() && keys.length > 0 && keys.some(item => this.hasKey(item));
    }

    /**
     * Returns whether the map contains all the given keys
     *
     * @param keys the keys to check
     *
     * @returns whether the map contains all the given keys
     *
     * @example
     * map.hasAllKeys('color', 'position');
     */
    public hasAllKeys(keys: K[]): boolean {
        return this.isNotEmpty() && keys.length > 0 && keys.every(item => this.hasKey(item));
    }

    /**
     * Returns whether any entries of the map that contains the given values
     *
     * @param values the values to check
     * @param exact whether matching entry values exactly
     *
     * @returns whether any entries of the map that contains the given values
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
        if (values.length === 0 || this.isEmpty()) {
            return false;
        }
        for (const vs of this.map.values()) {
            const result = exact ? (values.length === vs.length && values.every(item => vs.includes(item))) : values.some(item => vs.includes(item));
            if (result) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns whether the map contains any of the given values
     *
     * @param values the values to check
     * @param exact whether matching entry values exactly
     *
     * @returns whether the map contains any of the given values
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']],
     *     ['position', ['top', 'right', 'bottom', 'left']]
     * ]);
     * map.hasAnyValues([['red', 'black'], ['green', 'blue']]);    // false
     * map.hasAnyValues([['top', 'right'], ['top', 'right', 'bottom', 'left']]);    // true
     */
    public hasAnyValues(values: V[][], exact: boolean = true): boolean {
        return this.isNotEmpty() && values.length > 0 && values.some(item => this.hasValue(item, exact));
    }

    /**
     * Returns whether the map contains all the given values
     *
     * @param values the values to check
     * @param exact whether matching entry values exactly
     *
     * @returns whether the map contains all the given values
     *
     * @example
     * map.hasAllValues(['red', 'green', 'blue'], ['top', 'right', 'bottom', 'left']);
     */
    public hasAllValues(values: V[][], exact: boolean = true): boolean {
        return this.isNotEmpty() && values.length > 0 && values.every(item => this.hasValue(item, exact));
    }

    /**
     * Returns whether the map is empty
     *
     * @returns whether the map is empty
     */
    public isEmpty(): boolean {
        return this.map.size === 0;
    }

    /**
     * Returns whether the map is not empty
     *
     * @returns whether the map is not empty
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
     * @returns the size of map
     */
    public get size(): number {
        return this.map.size;
    }

    /**
     * Returns the string representation of the map identifier ('MultiValueMap')
     *
     * @returns the string representation of the map identifier
     */
    public get [Symbol.toStringTag](): string {
        return 'MultiValueMap';
    }

    /**
     * Returns the string representation of the map elements
     *
     * @returns the string representation of the map elements
     *
     * @example
     * const map = MultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']],
     *     ['position', ['top', 'right', 'bottom', 'left']]
     * ]);
     * console.log(map.toString());    // 'color:[red,green,blue];position:[top,right,bottom,left]'
     */
    public toString(): string {
        return [...this].map(entry => {
            const [key, values] = (
                (entry.length <= 1) ? [[], entry[0]] : [entry.slice(0, -1), entry[entry.length - 1]]
            ) as MultiValueMapEntry<K, V>;
            return `${key}:[${values.join()}]`;
        }).join(';');
    }
}
