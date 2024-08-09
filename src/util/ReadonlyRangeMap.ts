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


import {RangeMap, RangeMapKey} from '@';


/**
 * Readonly map with entries that contains a range key and a value
 *
 * @implements ReadonlyMap<RangeMapKey, V>
 *
 * @author David Hsing
 */
// noinspection JSUnusedGlobalSymbols
export class ReadonlyRangeMap<V> implements Omit<ReadonlyMap<RangeMapKey, V>, 'forEach' | 'get' | 'has' | 'entries' | 'keys' | 'values'> {
    private readonly map = new RangeMap<V>();

    /**
     * Construct a readonly range map instance
     *
     * @param entries the map entries
     * @param validation whether to compare the ranges to all the ranges previously, to determine if there are any conflicts
     *
     * @returns a readonly multi value map instance
     *
     * @example
     * const map = ReadonlyRangeMap.of([
     *    [[1, 30], 'green'],
     *     [[30, 60], 'blue'],
     *     [[60, 90], 'orange'],
     *     [[90, 100, true, true], 'red']
     * ]);
     */
    public static of<V>(entries?: [RangeMapKey | [number, number] | [number, number, boolean, boolean], V][], validation: boolean = true): ReadonlyRangeMap<V> {
        return new ReadonlyRangeMap(entries, validation);
    }

    /**
     * Construct a readonly range map instance
     *
     * @param entries the map entries
     * @param validation whether to compare the ranges to all the ranges previously, to determine if there are any conflicts
     *
     * @constructor
     *
     * @example
     * const map = new ReadonlyRangeMap([
     *     [[1, 30], 'green'],
     *     [[30, 60], 'blue'],
     *     [[60, 90], 'orange'],
     *     [[90, 100, true, true], 'red']
     * ]);
     */
    public constructor(entries?: [RangeMapKey | [number, number] | [number, number, boolean, boolean], V][], validation: boolean = true) {
        entries?.forEach(entry => {
            const [k, v] = entry;
            this.map.set(k, v, validation);
        });
    }

    /**
     * Returns the value of the given key
     *
     * @param key the key to retrieve
     * @param defaults the default value if not found
     *
     * @returns the value of the given key
     *
     * @example
     * const map = ReadonlyRangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * map.get([1, 50, true, true]);    // 'white'
     * map.get([51, 100, false, true]);    // 'black'
     */
    public get(key: RangeMapKey | [number, number] | [number, number, boolean, boolean], defaults?: V): V | undefined {
        return this.map.get(key, defaults);
    }

    /**
     * Returns the value that associated to the number, by determining which bound contains the given number
     *
     * @param digit the number to retrieve
     * @param defaults the default value if not found
     *
     * @returns the value that associated to the number, by determining which bound contains the given number
     *
     * @example
     * const map = ReadonlyRangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * map.get(25);    // 'white'
     * map.get(200);    // undefined
     */
    public getByDigit(digit: number, defaults?: V): V | undefined {
        return this.map.getByDigit(digit, defaults);
    }

    /**
     * Returns the keys of the map
     *
     * @returns the keys of the map
     */
    public keys(): RangeMapKey[] {
        return this.map.keys();
    }

    /**
     * Returns the value array of the map
     *
     * @returns the value array of the map
     */
    public values(): V[] {
        return this.map.values();
    }

    /**
     * Returns the key/value entries of the map
     *
     * @returns the key/value entries of the map
     */
    public entries(): [RangeMapKey, V][] {
        return this.map.entries();
    }

    /**
     * Processes each entry in the map
     *
     * @param callback a callback function that processes each entry
     * @param thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEach((value, key) => {
     *     console.log(value);
     * });
     */
    public forEach(callback: (value: V, key: RangeMapKey) => void, thisArg?: any): void {
        this.map.forEach(callback, thisArg);
    }

    /**
     * Processes each entry in the map with index capability
     *
     * @param callback a callback function that processes each entry
     * @param thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEachIndexing((value, key, index) => {
     *     console.log(index);
     * });
     */
    public forEachIndexing(callback: (value: V, key: RangeMapKey, index: number) => void, thisArg?: any): void {
        this.map.forEachIndexing(callback, thisArg);
    }

    /**
     * Processes each entry in the map with breakable capability
     *
     * @param callback a callback function that processes each entry. Returning false indicates to break the map iteration
     * @param thisArg any instance to retrieve 'this' reference in the callback function
     *
     * @example
     * map.forEachBreakable((value, key) => {
     *     return true;
     * });
     */
    public forEachBreakable(callback: (value: V, key: RangeMapKey) => boolean, thisArg?: any): void {
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
     * map.hasKey([1, 30]);
     */
    public hasKey(key: RangeMapKey | [number, number] | [number, number, boolean, boolean]): boolean {
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
     * const map = ReadonlyRangeMap.of([
     *     [[1, 50], 'white']
     * ]);
     * map.hasKeyValue([1, 50], 'white');    // true
     * map.hasKeyValue([1, 50], 'black');    // false
     */
    public hasKeyValue(key: RangeMapKey | [number, number] | [number, number, boolean, boolean], value: V): boolean {
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
     * const map = ReadonlyRangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * map.hasAnyKeys([[1, 50, true, true], [20, 60]]);    // true
     */
    public hasAnyKeys(keys: Array<RangeMapKey | [number, number] | [number, number, boolean, boolean]>): boolean {
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
     * map.hasAllKeys([[1, 50], [51, 100]]);
     */
    public hasAllKeys(keys: Array<RangeMapKey | [number, number] | [number, number, boolean, boolean]>): boolean {
        return this.map.hasAllKeys(keys);
    }

    /**
     * Returns whether any entries of the map that contains the given values
     *
     * @param value the value to check
     *
     * @returns whether any entries of the map that contains the given values
     *
     * @example
     * const map = ReadonlyRangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * map.hasValue('white');    // true
     * map.hasValue('blue');    // false
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
     * const map = ReadonlyRangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * map.hasAnyValues(['red', 'black']);    // true
     * map.hasAnyValues(['top', 'right']);    // false
     */
    public hasAnyValues(values: V[]): boolean {
        return this.map.hasAnyValues(values);
    }

    /**
     * Returns whether the map contains all the given values, matching exactly
     *
     * @param values the values to check
     *
     * @returns whether the map contains all the given values, matching exactly
     *
     * @example
     * map.hasAllValues(['red', 'green', 'blue']);
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
     * Response for returning the list of key/value to iterate
     *
     * @example
     * for (const [key, value] of map) {
     *     console.log(value);
     * }
     */
    public [Symbol.iterator](): IterableIterator<[RangeMapKey, V]> {
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
     * Returns the string representation of the map identifier ('ReadonlyRangeMap')
     *
     * @returns the string representation of the map identifier
     */
    public get [Symbol.toStringTag](): string {
        return 'ReadonlyRangeMap';
    }

    /**
     * Returns the string representation of the map elements
     *
     * @returns the string representation of the map elements
     *
     * @example
     * const map = ReadonlyRangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * console.log(map.toString());    // '[start:1,end:50,startInclusive:true,endInclusive:true]:white;[start:51,end:100,startInclusive:false,endInclusive:true]:black'
     */
    public toString(): string {
        return this.map.toString();
    }
}
