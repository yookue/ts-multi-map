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
 * @implements ReadonlyMap<K[], V>
 *
 * @author David Hsing
 */
// noinspection JSUnusedGlobalSymbols
export class ReadonlyMultiKeyMap<K, V> implements Omit<ReadonlyMap<K[], V>, 'forEach' | 'get' | 'has' | 'entries' | 'keys' | 'values'> {
    private readonly map = new MultiKeyMap<K, V>();

    /**
     * Construct a readonly multi key map instance
     *
     * @param entries the map entries that represented as [K[], V][]
     *
     * @returns a readonly multi key map instance
     *
     * @example
     * ```ts
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * ```
     */
    public static of<K, V>(entries?: MultiKeyMapEntries<K, V>): ReadonlyMultiKeyMap<K, V> {
        return new ReadonlyMultiKeyMap(entries);
    }

    /**
     * Construct a readonly multi key map instance
     *
     * @param entries the map entries that represented as [K[], V][]
     *
     * @constructor
     *
     * @example
     * ```ts
     * const map = new ReadonlyMultiKeyMap([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * ```
     */
    public constructor(entries?: MultiKeyMapEntries<K, V>) {
        entries?.forEach(entry => {
            const [ks, v] = entry;
            this.map.set(ks, v);
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
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.get(['row1', 'col1']);    // 'foo'
     * map.get(['row2', 'col2'], 'bar');    // 'bar'
     * ```
     */
    public get(keys: K[], defaults?: V): V | undefined {
        return this.map.get(keys, defaults);
    }

    /**
     * Returns the keys array of the map
     *
     * @returns the keys array of the map
     */
    public keys(): K[][] {
        return this.map.keys();
    }

    /**
     * Returns the values of the map
     *
     * @returns the values of the map
     */
    public values(): V[] {
        return this.map.values();
    }

    /**
     * Returns the keys/value entries of the map
     *
     * @returns the keys/value entries of the map
     */
    public entries(): [K[], V][] {
        return this.map.entries();
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
    public forEach(callback: (value: V, keys: K[]) => void, thisArg?: any): void {
        this.map.forEach(callback, thisArg);
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
    public forEachIndexing(callback: (value: V, keys: K[], index: number) => void, thisArg?: any): void {
        this.map.forEachIndexing(callback, thisArg);
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
    public forEachBreakable(callback: (value: V, keys: K[]) => boolean, thisArg?: any): void {
        this.map.forEachBreakable(callback, thisArg);
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
        return this.map.hasKey(keys, exact)
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
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasKeyValue(['row1', 'col1'], 'foo');    // true
     * map.hasKeyValue(['row1', 'col1'], 'bar');    // false
     * ```
     */
    public hasKeyValue(keys: K[], value: V): boolean {
        return this.map.hasKeyValue(keys, value);
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
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasAnyKeys([['row1', 'col1'], ['row2', 'col2']]);    // true
     * ```
     */
    public hasAnyKeys(keys: K[][], exact: boolean = true): boolean {
        return this.map.hasAnyKeys(keys, exact);
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
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasAllKeys([['row1', 'col1'], ['row2', 'col2']]);    // false
     * ```
     */
    public hasAllKeys(keys: K[][], exact: boolean = true): boolean {
        return this.map.hasAllKeys(keys, exact);
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
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasValue('foo');    // true
     * map.hasValue('bar');    // false
     * ```
     */
    public hasValue(value: V): boolean {
        return this.map.hasValue(value);
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
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'foo']
     * ]);
     * map.hasAnyValues(['foo', 'bar']);    // true
     * ```
     */
    public hasAnyValues(values: V[]): boolean {
        return this.map.hasAnyValues(values);
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
     * map.hasAllValues(['foo', 'bar']);
     * ```
     */
    public hasAllValues(values: V[]): boolean {
        return this.map.hasAllValues(values);
    }

    /**
     * Returns whether the map is empty
     *
     * @returns whether the map is empty
     */
    public isEmpty(): boolean {
        return this.map.isEmpty();
    }

    /**
     * Returns whether the map is not empty
     *
     * @returns whether the map is not empty
     */
    public isNotEmpty(): boolean {
        return this.map.isNotEmpty();
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
        return this.map.getKey(value, defaults);
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
    public [Symbol.iterator](): IterableIterator<[K[], V]> {
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
     * Returns the string representation of the map identifier ('ReadonlyMultiKeyMap')
     *
     * @returns the string representation of the map identifier
     */
    public get [Symbol.toStringTag](): string {
        return 'ReadonlyMultiKeyMap';
    }

    /**
     * Returns the string representation of the map elements
     *
     * @returns the string representation of the map elements
     *
     * @example
     * ```ts
     * const map = ReadonlyMultiKeyMap.of([
     *     [['row1', 'col1'], 'foo'],
     *     [['row2', 'col2'], 'bar']
     * ]);
     * console.log(map.toString());    // '[row1,col1]:foo;[row2,col2]:bar'
     * ```
     */
    public toString(): string {
        return this.map.toString();
    }
}
