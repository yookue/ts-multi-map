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


import objectHash from 'object-hash';
import {MultiValueMap, type MultiKeyMapEntry, type MultiKeyMapEntries} from '@';


/**
 * Map with entries that contains multiple keys and a single value
 *
 * @author David Hsing
 */
// noinspection JSUnusedGlobalSymbols
export class MultiKeyMap<K, V> implements Omit<Map<K[], V>, 'delete' | 'forEach' | 'get' | 'has' | 'set' | 'entries' | 'keys' | 'values' | 'push'> {
    private readonly keyMap = new MultiValueMap<string, K>();
    private readonly valueMap = new Map<string, V>();

    /**
     * Construct a multi key map instance
     *
     * @param entries the map entries that represented as [K[], V][]
     *
     * @returns a multi key map instance
     *
     * @example
     * ```ts
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * ```
     */
    public static of<K, V>(entries?: MultiKeyMapEntries<K, V>): MultiKeyMap<K, V> {
        return new MultiKeyMap(entries);
    }

    /**
     * Construct a multi key map instance
     *
     * @param entries the map entries that represented as [K[], V][]
     *
     * @example
     * ```ts
     * const map = new MultiKeyMap([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * ```
     */
    public constructor(entries?: MultiKeyMapEntries<K, V>) {
        entries?.forEach(entry => {
            const [ks, v] = entry;
            this.set(ks, v);
        });
    }

    /**
     * Returns the value of the given keys
     *
     * @param keys the keys to retrieve
     * @param defaults the default value if not found
     *
     * @returns the value of the given keys
     *
     * @example
     * ```ts
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.get(['row1', 'col1']);    // 'foo'
     * map.get(['row2', 'col2'], 'bar');    // 'bar'
     * ```
     */
    public get(keys: K[], defaults?: V): V | undefined {
        if (keys.length == 0 || this.isEmpty()) {
            return defaults;
        }
        const hash = objectHash(keys);
        return this.valueMap.get(hash) ?? defaults;
    }

    /**
     * Sets the value of the given keys
     *
     * @param keys the keys to set
     * @param value the value to set
     *
     * @example
     * ```ts
     * map.set(['row1', 'col1'], 'bar');
     * ```
     */
    public set(keys: K[], value: V): void {
        if (keys.length == 0) {
            return;
        }
        const hash = objectHash(keys);
        this.keyMap.set(hash, [...keys]);
        this.valueMap.set(hash, value);
    }

    /**
     * Clears the map
     */
    public clear(): void {
        this.keyMap.clear();
        this.valueMap.clear();
    }

    /**
     * Returns the keys array of the map
     *
     * @returns the keys array of the map
     */
    public keys(): K[][] {
        return [...this.keyMap.values()];
    }

    /**
     * Returns the values of the map
     *
     * @returns the values of the map
     */
    public values(): V[] {
        return [...this.valueMap.values()];
    }

    /**
     * Returns the keys/value entries of the map
     *
     * @returns the keys/value entries of the map
     */
    public entries(): [K[], V][] {
        if (this.isEmpty()) {
            return [];
        }
        if (this.keyMap.size !== this.valueMap.size) {
            throw EvalError(`Internal maps size mismatch!`);
        }
        const result: [K[], V][] = [];
        for (const [k, v] of this.valueMap) {
            result.push([this.keyMap.get(k) ?? [], v]);
        }
        return result;
    }

    /**
     * Deletes the entry with the given key
     *
     * @param key the key to delete
     *
     * @returns whether the entry has been deleted
     *
     * @example
     * ```ts
     * map.deleteByKey(['row1', 'col1']);
     * ```
     */
    public deleteByKey(key: K[]): boolean {
        if (!key.length || this.isEmpty()) {
            return false;
        }
        const hash = objectHash(key);
        return this.keyMap.deleteByKey(hash) && this.valueMap.delete(hash);
    }

    /**
     * Deletes all the entries with the given keys
     *
     * @param keys the keys to delete
     *
     * @returns whether any of the entries has been deleted
     *
     * @example
     * ```ts
     * map.deleteByKey([['row1', 'col1'], ['row2', 'col2']]);
     * ```
     */
    public deleteByKeys(keys: K[][]): boolean {
        if (!keys.length || this.isEmpty()) {
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
     * ```ts
     * map.deleteByValue('foo');
     * ```
     */
    public deleteByValue(value: V): boolean {
        if (this.isEmpty()) {
            return false;
        }
        let result = false;
        for (const [k, v] of this.valueMap.entries()) {
            if (v === value && this.keyMap.deleteByKey(k) && this.valueMap.delete(k)) {
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
     * ```ts
     * map.deleteByValues(['foo', 'bar']);
     * ```
     */
    public deleteByValues(values: V[]): boolean {
        if (!values.length || this.isEmpty()) {
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
     * @param callback a callback function that processes each entry
     * @param thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * ```ts
     * map.forEach((value, keys) => {
     *     console.log(value);
     * });
     * ```
     */
    public forEach(callback: (value?: V, keys?: K[]) => void, thisArg?: any): void {
        this.entries().forEach(entry => {
            const [ks, v] = entry;
            callback(v, ks);
        }, thisArg);
    }

    /**
     * Processes each entry in the map with index capability
     *
     * @param callback a callback function that processes each entry
     * @param thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * ```ts
     * map.forEachIndexing((value, keys, index) => {
     *     console.log(index);
     * });
     * ```
     */
    public forEachIndexing(callback: (value?: V, keys?: K[], index?: number) => void, thisArg?: any): void {
        let index = 0;
        this.entries().forEach(entry => {
            const [ks, v] = entry;
            callback(v, ks, index++);
        }, thisArg);
    }

    /**
     * Processes each entry in the map with breakable capability
     *
     * @param callback a callback function that processes each entry. Returning false indicates to break the map iteration
     * @param thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * ```ts
     * map.forEachBreakable((value, keys) => {
     *     return true;
     * });
     * ```
     */
    public forEachBreakable(callback: (value?: V, keys?: K[]) => boolean, thisArg?: any): void {
        this.entries().forEach(entry => {
            const [ks, v] = entry;
            if (!callback(v, ks)) {
                return;
            }
        }, thisArg);
    }

    /**
     * Returns whether the map contains the given keys
     *
     * @param keys the keys to check
     * @param exact whether matching entry values exactly
     *
     * @returns whether the map contains the given key
     *
     * @example
     * ```ts
     * map.hasKey(['row1', 'col1']);
     * ```
     */
    public hasKey(keys: K[], exact: boolean = true): boolean {
        return this.isNotEmpty() && keys.length > 0 && this.keyMap.hasValue(keys, exact);
    }

    /**
     * Returns whether the map contains the given keys/value pair
     *
     * @param keys the keys to check
     * @param value the value to check
     *
     * @returns whether the map contains the given keys/value pair
     *
     * @example
     * ```ts
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasKeyValue(['row1', 'col1'], 'foo');    // true
     * map.hasKeyValue(['row1', 'col1'], 'bar');    // false
     * ```
     */
    public hasKeyValue(keys: K[], value: V): boolean {
        return this.isNotEmpty() && keys.length > 0 && this.get(keys) === value;
    }

    /**
     * Returns whether the map contains any of the given keys
     *
     * @param keys the keys to check
     * @param exact whether matching entry values exactly
     *
     * @returns whether the map contains any of the given keys
     *
     * @example
     * ```ts
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasAnyKeys([['row1', 'col1'], ['row2', 'col2']]);    // true
     * ```
     */
    public hasAnyKeys(keys: K[][], exact: boolean = true): boolean {
        return this.isNotEmpty() && keys.length > 0 && keys.some(item => this.hasKey(item, exact));
    }

    /**
     * Returns whether the map contains all the given keys
     *
     * @param keys the keys to check
     * @param exact whether matching entry values exactly
     *
     * @returns whether the map contains all the given keys
     *
     * @example
     * ```ts
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasAllKeys([['row1', 'col1'], ['row2', 'col2']]);    // false
     * ```
     */
    public hasAllKeys(keys: K[][], exact: boolean = true): boolean {
        return this.isNotEmpty() && keys.length > 0 && keys.every(item => this.hasKey(item, exact));
    }

    /**
     * Returns whether the map contains the given value
     *
     * @param value the value to check
     *
     * @returns whether the map contains the given value
     *
     * @example
     * ```ts
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasValue('foo');    // true
     * map.hasValue('bar');    // false
     * ```
     */
    public hasValue(value: V): boolean {
        return this.values().includes(value);
    }

    /**
     * Returns whether the map contains any of the given values
     *
     * @param values the values to check
     *
     * @returns whether the map contains any of the given values
     *
     * @example
     * ```ts
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasAnyValues(['foo', 'bar']);    // true
     * ```
     */
    public hasAnyValues(values: V[]): boolean {
        return this.isNotEmpty() && values.length > 0 && values.some(item => this.hasValue(item));
    }

    /**
     * Returns whether the map contains all the given values
     *
     * @param values the values to check
     *
     * @returns whether the map contains all the given values
     *
     * @example
     * ```ts
     * map.hasAllValues(['foo']);
     * ```
     */
    public hasAllValues(values: V[]): boolean {
        return this.isNotEmpty() && values.length > 0 && values.every(item => this.hasValue(item));
    }

    /**
     * Returns whether the map is empty
     *
     * @returns whether the map is empty
     */
    public isEmpty(): boolean {
        return !this.valueMap.size;
    }

    /**
     * Returns whether the map is not empty
     *
     * @returns whether the map is not empty
     */
    public isNotEmpty(): boolean {
        return this.valueMap.size > 0;
    }

    /**
     * Returns the keys with the given value
     *
     * @param value the value to inspect
     * @param defaults the default keys if nothing matches the given value
     *
     * @returns the keys with the given value
     *
     * @example
     * ```ts
     * map.getKey('bar');
     * ```
     */
    public getKey(value: V, defaults?: K[]): K[] | undefined {
        if (this.isEmpty()) {
            return defaults;
        }
        for (const [k, v] of this.valueMap.entries()) {
            if (v === value) {
                return this.keyMap.get(k, defaults);
            }
        }
        return defaults;
    }

    /**
     * Response for returning the list of keys/value to iterate
     *
     * @example
     * ```ts
     * for (const [keys, value] of map) {
     *     console.log(value);
     * }
     * ```
     */
    // @ts-ignore
    public [Symbol.iterator](): IterableIterator<[K[], V]> {
        return this.entries()[Symbol.iterator]();
    }

    /**
     * Returns the size of map
     *
     * @returns the size of map
     */
    public get size(): number {
        return this.valueMap.size;
    }

    /**
     * Returns the string representation of the map identifier ('MultiKeyMap')
     *
     * @returns the string representation of the map identifier
     */
    public get [Symbol.toStringTag](): string {
        return 'MultiKeyMap';
    }

    /**
     * Returns the string representation of the map elements
     *
     * @returns the string representation of the map elements
     *
     * @example
     * ```ts
     * const map = MultiKeyMap.of([
     *     [['row1', 'col1'], 'foo'],
     *     [['row2', 'col2'], 'bar']
     * ]);
     * console.log(map.toString());    // '[row1,col1]:foo;[row2,col2]:bar'
     * ```
     */
    public toString(): string {
        return [...this].map(entry => {
            const [ks, v] = (
                (entry.length <= 1) ? [[], entry[0]] : [entry.slice(0, -1), entry[entry.length - 1]]
            ) as MultiKeyMapEntry<K, V>;
            return `[${ks.join()}]:${v}`;
        }).join(';');
    }
}
