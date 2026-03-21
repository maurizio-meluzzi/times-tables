/*
 * Le Tabelline - Times Tables learning game for children
 * Copyright (C) 2025  Maurizio Meluzzi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * engine.js
 * Arithmetic operations generator for times tables.
 * Pure module with no DOM dependencies.
 *
 * Usage:
 *   1. initEngine(2, 3, 5, 7) — call once at the start of each game session,
 *      passing the table numbers to include (any subset of 1–12).
 *   2. generateOperation() — call each time a new question is needed;
 *      returns the same { x, y, result, resultDigits } object as before.
 *
 * Randomisation strategy: shuffled-deck (Fisher-Yates).
 * The full list of operations is shuffled and served one by one.
 * When the deck is exhausted it is reshuffled, guaranteeing that every
 * operation appears with equal frequency before any repeats.
 */

// Module-level state
let _operationList = [];   // all operations for the current session
let _shuffledQueue = [];   // working deck — items are popped from the end

/**
 * Build the flat list of all operations for the given tables.
 * For each table t, generates t×1 … t×maxFactor.
 * @param {number[]} tables
 * @param {number} maxFactor - Upper bound for the second factor (10, 11, or 12)
 * @returns {Array<{x,y,result,resultDigits}>}
 */
function _buildOperationList(tables, maxFactor) {
    const list = [];
    for (const t of tables) {
        for (let factor = 1; factor <= maxFactor; factor++) {
            const result = t * factor;
            list.push({
                x: t,
                y: factor,
                result,
                resultDigits: String(result).length
            });
        }
    }
    return list;
}

/**
 * Fisher-Yates shuffle — returns a new shuffled copy of the array.
 * @param {Array} arr
 * @returns {Array}
 */
function _shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a;
}

/**
 * Initialise the engine for a new game session.
 * Call once per session before the first generateOperation() call.
 *
 * @param {Object} config
 * @param {number[]} config.tables         - Table numbers to include (any subset of 1–12).
 * @param {number}  [config.maxFactor=12]  - Upper bound for the second factor: 10, 11, or 12.
 *                                           Use 10 for beginners, 12 for full tables.
 */
export function initEngine({ tables, maxFactor = 12 }) {
    const clampedMax = [10, 11, 12].includes(maxFactor) ? maxFactor : 12;
    _operationList = _buildOperationList(tables, clampedMax);
    _shuffledQueue = _shuffle(_operationList);
}

/**
 * Return the next operation for the current session.
 * Transparent to the caller: same return shape as before.
 *
 * @returns {{x: number, y: number, result: number, resultDigits: number}}
 */
export function generateOperation() {
    // Refill and reshuffle when the deck runs out
    if (_shuffledQueue.length === 0) {
        _shuffledQueue = _shuffle(_operationList);
    }
    return _shuffledQueue.pop();
}
