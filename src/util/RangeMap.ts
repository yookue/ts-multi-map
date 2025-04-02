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
import {type RangeMapKey} from '@';


/**
 * Map with entries that contains a range key and a value
 *
 * @implements Map<RangeMapKey, V>
 *
 * @author David Hsing
 */
// noinspection JSUnusedGlobalSymbols
export class RangeMap<V> implements Omit<Map<RangeMapKey, V>, 'delete' | 'forEach' | 'get' | 'has' | 'set' | 'entries' | 'keys' | 'values' | 'push'> {
    private readonly keyMap = new Map<string, RangeMapKey>();
    private readonly valueMap = new Map<string, V>();

    /**
     * Construct a range map instance
     *
     * @param entries the map entries
     * @param validation whether to compare the ranges to all the ranges previously, to determine if there are any conflicts
     *
     * @returns a range map instance
     *
     * @example
     * ```ts
     * const map = RangeMap.of([
     *     [[1, 30], 'green'],
     *     [[30, 60], 'blue'],
     *     [[60, 90], 'orange'],
     *     [[90, 100, true, true], 'red']
     * ]);
     * ```
     */
    public static of<V>(entries?: [RangeMapKey | [number, number] | [number, number, boolean, boolean], V][], validation: boolean = true): RangeMap<V> {
        return new RangeMap(entries, validation);
    }

    /**
     * Construct a range map instance
     *
     * @param entries the map entries
     * @param validation whether to compare the ranges to all the ranges previously, to determine if there are any conflicts
     *
     * @constructor
     *
     * @example
     * ```ts
     * const map = new RangeMap([
     *     [[1, 30], 'green'],
     *     [[30, 60], 'blue'],
     *     [[60, 90], 'orange'],
     *     [[90, 100, true, true], 'red']
     * ]);
     * ```
     */
    public constructor(entries?: [RangeMapKey | [number, number] | [number, number, boolean, boolean], V][], validation: boolean = true) {
        entries?.forEach(entry => {
            const [k, v] = entry;
            this.set(k, v, validation);
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
     * ```ts
     * const map = RangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * map.get([1, 50, true, true]);    // 'white'
     * map.get([51, 100, false, true]);    // 'black'
     * ```
     */
    public get(key: RangeMapKey | [number, number] | [number, number, boolean, boolean], defaults?: V): V | undefined {
        const hash = objectHash(this.toInternalKey(key));
        return this.valueMap.get(hash) ?? defaults;
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
     * ```ts
     * const map = RangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * map.getByDigit(25);    // 'white'
     * map.getByDigit(50);    // 'white'
     * map.getByDigit(51);    // undefined
     * map.getByDigit(52);    // 'black'
     * map.getByDigit(200);    // undefined
     * ```
     */
    public getByDigit(digit: number, defaults?: V): V | undefined {
        if (this.isEmpty()) {
            return defaults;
        }
        for (const [k, v] of this.keyMap.entries()) {
            if ((v.startInclusive ? (digit >= v.start) : (digit > v.start)) && (v.endInclusive ? (digit <= v.end) : (digit < v.end))) {
                return this.valueMap.get(k);
            }
        }
        return defaults;
    }

    /**
     * Sets the value of the given key
     *
     * @param key the key to set
     * @param value the value to set
     * @param validation whether to compare the range to all the ranges previously, to determine if there are any conflicts
     *
     * @example
     * ```ts
     * map.set([60, 80, true, true], 'volcano');
     * ```
     */
    public set(key: RangeMapKey | [number, number] | [number, number, boolean, boolean], value: V, validation: boolean = true): void {
        const alias = this.toInternalKey(key);
        if (alias.start > alias.end || (alias.start === alias.end && !alias.startInclusive && !alias.endInclusive)) {
            throw RangeError(`Range start ${alias.start} must be less than or equal to it's end ${alias.end}`);
        }
        if (validation) {
            this.checkRangeConflict(alias);
        }
        const hash = objectHash(alias);
        this.keyMap.set(hash, alias);
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
     * Returns the keys of the map
     *
     * @returns the keys of the map
     */
    public keys(): RangeMapKey[] {
        return [...this.keyMap.values()];
    }

    /**
     * Returns the value array of the map
     *
     * @returns the value array of the map
     */
    public values(): V[] {
        return [...this.valueMap.values()];
    }

    /**
     * Returns the key/value entries of the map
     *
     * @returns the key/value entries of the map
     */
    public entries(): [RangeMapKey, V][] {
        if (this.isEmpty()) {
            return [];
        }
        if (this.keyMap.size !== this.valueMap.size) {
            throw EvalError(`Internal maps size mismatch!`);
        }
        const result: [RangeMapKey, V][] = [];
        for (const [k, v] of this.valueMap) {
            result.push([this.keyMap.get(k) as RangeMapKey, v]);
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
     * map.deleteByKey([1, 50]);
     * ```
     */
    public deleteByKey(key: RangeMapKey | [number, number] | [number, number, boolean, boolean]): boolean {
        if (this.isEmpty()) {
            return false;
        }
        const hash = objectHash(this.toInternalKey(key));
        return this.keyMap.delete(hash) && this.valueMap.delete(hash);
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
     * map.deleteByKeys([[1, 30], [30, 50]]);
     * ```
     */
    public deleteByKeys(keys: Array<RangeMapKey | [number, number] | [number, number, boolean, boolean]>): boolean {
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
     * map.deleteByValue('red');
     * ```
     */
    public deleteByValue(value: V): boolean {
        if (this.isEmpty()) {
            return false;
        }
        let result = false;
        for (const [k, v] of this.valueMap.entries()) {
            if (v === value && this.keyMap.delete(k) && this.valueMap.delete(k)) {
                result = true;
            }
        }
        return result;
    }

    /**
     * Deletes all the entries with the given values
     *
     * @param values the values to delete
     *
     * @returns whether any of the entries has been deleted
     *
     * @example
     * ```ts
     * map.deleteByValues(['green', 'blue']);
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
     * map.forEach((value, key) => {
     *     console.log(value);
     * });
     * ```
     */
    public forEach(callback: (value?: V, key?: RangeMapKey) => void, thisArg?: any): void {
        this.entries().forEach(entry => {
            const [k, v] = entry;
            callback(v, k);
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
     * map.forEachIndexing((value, key, index) => {
     *     console.log(index);
     * });
     * ```
     */
    public forEachIndexing(callback: (value?: V, key?: RangeMapKey, index?: number) => void, thisArg?: any): void {
        let index = 0;
        this.entries().forEach(entry => {
            const [k, v] = entry;
            callback(v, k, index++);
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
     * map.forEachBreakable((value, key) => {
     *     return true;
     * });
     * ```
     */
    public forEachBreakable(callback: (value?: V, key?: RangeMapKey) => boolean, thisArg?: any): void {
        this.entries().forEach(entry => {
            const [k, v] = entry;
            if (!callback(v, k)) {
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
     * ```ts
     * map.hasKey([1, 30]);
     * ```
     */
    public hasKey(key: RangeMapKey | [number, number] | [number, number, boolean, boolean]): boolean {
        return this.isNotEmpty() && this.keyMap.has(objectHash(this.toInternalKey(key)));
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
     * const map = RangeMap.of([
     *     [[1, 50], 'white']
     * ]);
     * map.hasKeyValue([1, 50], 'white');    // true
     * map.hasKeyValue([1, 50], 'black');    // false
     * ```
     */
    public hasKeyValue(key: RangeMapKey | [number, number] | [number, number, boolean, boolean], value: V): boolean {
        return this.isNotEmpty() && this.get(key) === value;
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
     * const map = RangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * map.hasAnyKeys([[1, 50, true, true], [20, 60]]);    // true
     * ```
     */
    public hasAnyKeys(keys: Array<RangeMapKey | [number, number] | [number, number, boolean, boolean]>): boolean {
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
     * ```ts
     * map.hasAllKeys([[1, 50], [51, 100]]);
     * ```
     */
    public hasAllKeys(keys: Array<RangeMapKey | [number, number] | [number, number, boolean, boolean]>): boolean {
        return this.isNotEmpty() && keys.length > 0 && keys.every(item => this.hasKey(item));
    }

    /**
     * Returns whether any entries of the map that contains the given values
     *
     * @param value the value to check
     *
     * @returns whether any entries of the map that contains the given values
     *
     * @example
     * ```ts
     * const map = RangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * map.hasValue('white');    // true
     * map.hasValue('blue');    // false
     * ```
     */
    public hasValue(value: V): boolean {
        return this.isNotEmpty() && this.values().includes(value);
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
     * const map = RangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * map.hasAnyValues(['red', 'black']);    // true
     * map.hasAnyValues(['top', 'right']);    // false
     * ```
     */
    public hasAnyValues(values: V[]): boolean {
        return this.isNotEmpty() && values.length > 0 && values.some(item => this.hasValue(item));
    }

    /**
     * Returns whether the map contains all the given values, matching exactly
     *
     * @param values the values to check
     *
     * @returns whether the map contains all the given values, matching exactly
     *
     * @example
     * ```ts
     * map.hasAllValues(['red', 'green', 'blue']);
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
     * Response for returning the list of key/value to iterate
     *
     * @example
     * ```ts
     * for (const [key, value] of map) {
     *     console.log(value);
     * }
     * ```
     */
    public [Symbol.iterator](): IterableIterator<[RangeMapKey, V]> {
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
     * Returns the string representation of the map identifier ('RangeMap')
     *
     * @returns the string representation of the map identifier
     */
    public get [Symbol.toStringTag](): string {
        return 'RangeMap';
    }

    /**
     * Returns the string representation of the map elements
     *
     * @returns the string representation of the map elements
     *
     * @example
     * ```ts
     * const map = RangeMap.of([
     *     [[1, 50, true, true], 'white'],
     *     [[51, 100, false, true], 'black']
     * ]);
     * console.log(map.toString());    // '[start:1,end:50,startInclusive:true,endInclusive:true]:white;[start:51,end:100,startInclusive:false,endInclusive:true]:black'
     * ```
     */
    public toString(): string {
        return [...this].map(entry => {
            const [k, v] = entry as [RangeMapKey, V];
            // @ts-ignore
            const ks = Object.keys(k).map(item => `${item}:${k[item]}`).join();
            return `[${ks}]:${v}`;
        }).join(';');
    }

    /**
     * Converts the given key to internal one, for storage
     *
     * @param key the key to convert
     *
     * @returns the converted key
     */
    private toInternalKey(key: RangeMapKey | [number, number] | [number, number, boolean, boolean]): RangeMapKey {
        return !Array.isArray(key) ? key : {
            start: (key.length > 0) ? key[0] : 0,
            end: (key.length > 1) ? key[1] : 0,
            startInclusive: (key.length > 2) ? key[2] : true,
            endInclusive: (key.length > 3) ? key[3] : false,
        };
    }

    /**
     * Checks the given key is conflicting with the ranges previously
     *
     * @param key the key to inspect
     */
    private checkRangeConflict(key: RangeMapKey): void {
        if (this.isEmpty()) {
            return;
        }
        const keyExpress = `${key.startInclusive ? '[' : '('}${key.start},${key.end}${key.endInclusive ? ']' : ')'}`;
        for (const k of this.keyMap.values()) {
            const kExpress = `${k.startInclusive ? '[' : '('}${k.start},${k.end}${k.endInclusive ? ']' : ')'}`;
            if (key.start <= k.start && key.end >= k.end) {
                throw RangeError(`Range ${keyExpress} must not override the range ${kExpress}`);
            }
            const badStart = (key.startInclusive ? (key.start >= k.start) : (key.start > k.start)) && ((key.startInclusive && k.endInclusive) ? (key.start <= k.end) : (key.start < k.end));
            const badEnd = ((key.endInclusive && k.startInclusive) ? (key.end >= k.start) : (key.end > k.start)) && (key.end <= k.end);
            if (badStart || badEnd) {
                throw RangeError(`Range ${keyExpress} must not intersect the range ${kExpress}`);
            }
        }
    }
}
