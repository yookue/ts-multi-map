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


import { MultiValueMap, type MultiValueMapEntries } from '@';


/**
 * Readonly map with entries that contains a single key and multiple values
 *
 * @author David Hsing
 */
// noinspection JSUnusedGlobalSymbols
export class ReadonlyMultiValueMap<K, V> implements Omit<ReadonlyMap<K, V[]>, 'forEach' | 'get' | 'has' | 'entries' | 'keys' | 'values'> {
    private readonly map = new MultiValueMap<K, V>();

    /**
     * Construct a readonly multi value map instance
     *
     * @param entries the map entries that represented as [K, V[]][]
     *
     * @returns a readonly multi value map instance
     *
     * @example
     * ```ts
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * ```
     */
    public static of<K, V>(entries?: MultiValueMapEntries<K, V>): ReadonlyMultiValueMap<K, V> {
        return new ReadonlyMultiValueMap(entries);
    }

    /**
     * Construct a readonly multi value map instance
     *
     * @param entries the map entries that represented as [K, V[]][]
     *
     * @example
     * ```ts
     * const map = new ReadonlyMultiValueMap([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * ```
     */
    public constructor(entries?: MultiValueMapEntries<K, V>) {
        entries?.forEach(entry => {
            const [k, vs] = entry;
            this.map.set(k, vs);
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
     * ```ts
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.get('color');    // ['red', 'green', 'blue']
     * map.get('foobar', ['foo', 'bar']);    // ['foo', 'bar']
     * ```
     */
    public get(key: K, defaults?: V[]): V[] | undefined {
        return this.map.get(key, defaults);
    }

    /**
     * Returns the keys of the map
     *
     * @returns the keys of the map
     */
    public keys(): K[] {
        return this.map.keys();
    }

    /**
     * Returns the values array of the map
     *
     * @returns the values array of the map
     */
    public values(): V[][] {
        return this.map.values();
    }

    /**
     * Returns the key/values entries of the map
     *
     * @returns the key/values entries of the map
     */
    public entries(): [K, V[]][] {
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
     * map.forEach((values, key) => {
     *     console.log(key);
     * });
     * ```
     */
    public forEach(callback: (values?: V[], key?: K) => void, thisArg?: any): void {
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
     * map.forEachIndexing((values, key, index) => {
     *     console.log(index);
     * });
     * ```
     */
    public forEachIndexing(callback: (values?: V[], key?: K, index?: number) => void, thisArg?: any): void {
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
     * map.forEachBreakable((values, key) => {
     *     return true;
     * });
     * ```
     */
    public forEachBreakable(callback: (values?: V[], key?: K) => boolean, thisArg?: any): void {
        this.map.forEachBreakable(callback, thisArg);
    }

    /**
     * Returns whether the map contains the given key
     *
     * @param key the key to check
     *
     * @returns whether the map contains the given key
     *
     * @example
     * ```ts
     * map.hasKey('color');
     * ```
     */
    public hasKey(key: K): boolean {
        return this.map.hasKey(key);
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
     * ```ts
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.hasKeyValue('color', 'red');    // true
     * map.hasKeyValue('color', 'black');    // false
     * ```
     */
    public hasKeyValue(key: K, value: V): boolean {
        return this.map.hasKeyValue(key, value);
    }

    /**
     * Returns whether the map contains any of the given keys
     *
     * @param keys the keys to check
     *
     * @returns whether the map contains any of the given keys
     *
     * @example
     * ```ts
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']]
     * ]);
     * map.hasAnyKeys(['color', 'position']);    // true
     * ```
     */
    public hasAnyKeys(keys: K[]): boolean {
        return this.map.hasAnyKeys(keys);
    }

    /**
     * Returns whether the map contains all the given keys
     *
     * @param keys the keys to check
     *
     * @returns whether the map contains all the given keys
     *
     * @example
     * ```ts
     * map.hasAllKeys(['color', 'position']);
     * ```
     */
    public hasAllKeys(keys: K[]): boolean {
        return this.map.hasAllKeys(keys);
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
     * ```ts
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']],
     *     ['position', ['top', 'right', 'bottom', 'left']]
     * ]);
     * map.hasValue(['red', 'black'], true);    // false
     * map.hasValue(['top', 'right'], true);    // false
     * map.hasValue(['top', 'right'], false);    // true
     * ```
     */
    public hasValue(values: V[], exact: boolean = true): boolean {
        return this.map.hasValue(values, exact);
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
     * ```ts
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']],
     *     ['position', ['top', 'right', 'bottom', 'left']]
     * ]);
     * map.hasAnyValues([['red', 'black'], ['green', 'blue']]);    // false
     * map.hasAnyValues([['top', 'right'], ['top', 'right', 'bottom', 'left']]);    // true
     * ```
     */
    public hasAnyValues(values: V[][], exact: boolean = true): boolean {
        return this.map.hasAnyValues(values, exact);
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
     * ```ts
     * map.hasAllValues([['red', 'green', 'blue'], ['top', 'right', 'bottom', 'left']]);
     * ```
     */
    public hasAllValues(values: V[][], exact: boolean = true): boolean {
        return this.map.hasAllValues(values, exact);
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
     * Returns the key with the given values
     *
     * @param values the values to inspect
     * @param defaults the default key if nothing matches the given value
     *
     * @returns the key with the given value
     *
     * @example
     * ```ts
     * map.getKey(['foo', 'bar']);
     * ```
     */
    public getKey(values: V[], defaults?: K): K | undefined {
        return this.map.getKey(values, defaults);
    }

    /**
     * Response for returning the list of key/values to iterate
     *
     * @example
     * ```ts
     * for (const [key, values] of map) {
     *     console.log(key);
     * }
     * ```
     */
    // @ts-ignore
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
     * Returns the string representation of the map identifier ('ReadonlyMultiValueMap')
     *
     * @returns the string representation of the map identifier
     */
    public get [Symbol.toStringTag](): string {
        return 'ReadonlyMultiValueMap';
    }

    /**
     * Returns the string representation of the map elements
     *
     * @returns the string representation of the map elements
     *
     * @example
     * ```ts
     * const map = ReadonlyMultiValueMap.of([
     *     ['color', ['red', 'green', 'blue']],
     *     ['position', ['top', 'right', 'bottom', 'left']]
     * ]);
     * console.log(map.toString());    // 'color:[red,green,blue];position:[top,right,bottom,left]'
     * ```
     */
    public toString(): string {
        return this.map.toString();
    }
}
