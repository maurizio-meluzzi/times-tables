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
 *   1. initEngine({ tables, maxFactor, weighted }) — call once per game session.
 *   2. generateOperation() — call each time a new question is needed;
 *      returns { x, y, result, resultDigits }.
 *
 * Randomisation strategy: shuffled-deck (Fisher-Yates).
 * In weighted mode, pairs with high decay-weight get extra copies in the deck.
 * When the deck is exhausted it is rebuilt with fresh weights (self-healing).
 */

import { loadAnswers } from './answers.js';
import { computeCopiesForPair, getWeightConfig } from './weightEngine.js';

// Module-level state
let _operationList = [];   // canonical list — one entry per pair, used in non-weighted mode
let _shuffledQueue = [];   // working deck — items are popped from the end
let _tables        = [];   // stored for weighted refill
let _clampedMax    = 12;   // stored for weighted refill
let _weighted      = false;

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
 * Build a weighted deck by inserting multiple copies of each operation
 * proportional to its exponential-decay weight from answer history.
 * Pairs with weight ≤ 0 always get exactly 1 copy (minimum guaranteed).
 * Only answers for pairs currently in the deck are considered.
 *
 * @param {number[]} tables
 * @param {number} maxFactor
 * @returns {Array<{x,y,result,resultDigits}>}
 */
function _buildWeightedDeck(tables, maxFactor) {
    const config = getWeightConfig();
    const allAnswers = loadAnswers();

    // Build a Set of canonical pair keys present in the current deck
    const pairKeys = new Set();
    for (const t of tables) {
        for (let f = 1; f <= maxFactor; f++) {
            pairKeys.add(`${t}x${f}`);
        }
    }

    // Filter answers to only those whose (a, b) pair is in the current deck
    const filteredAnswers = allAnswers.filter(
        r => pairKeys.has(`${r.a}x${r.b}`)
    );

    const deck = [];
    for (const t of tables) {
        for (let factor = 1; factor <= maxFactor; factor++) {
            const result = t * factor;
            const op = { x: t, y: factor, result, resultDigits: String(result).length };
            const copies = computeCopiesForPair(t, factor, filteredAnswers, config);
            for (let c = 0; c < copies; c++) {
                deck.push(op);
            }
        }
    }
    return deck;
}

/**
 * Initialise the engine for a new game session.
 * Call once per session before the first generateOperation() call.
 *
 * @param {Object} config
 * @param {number[]} config.tables              - Table numbers to include (any subset of 1–12).
 * @param {number}  [config.maxFactor=12]       - Upper bound for the second factor: 10, 11, or 12.
 * @param {boolean} [config.weighted=false]     - Whether to use weighted deck mode.
 */
export function initEngine({ tables, maxFactor = 12, weighted = false }) {
    const clampedMax = [10, 11, 12].includes(maxFactor) ? maxFactor : 12;

    // Persist for weighted refill on deck exhaustion
    _tables     = tables;
    _clampedMax = clampedMax;
    _weighted   = weighted;

    _operationList = _buildOperationList(tables, clampedMax);

    _shuffledQueue = weighted
        ? _shuffle(_buildWeightedDeck(tables, clampedMax))
        : _shuffle(_operationList);
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
        // In weighted mode, rebuild the deck with fresh weights (self-healing)
        _shuffledQueue = _weighted
            ? _shuffle(_buildWeightedDeck(_tables, _clampedMax))
            : _shuffle(_operationList);
    }
    return _shuffledQueue.pop();
}
