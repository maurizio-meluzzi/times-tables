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
 * weightEngine.js
 * Exponential-decay weight computation for the weighted deck mode.
 *
 * This module has no imports — it receives all data as arguments.
 * It is safe to use in isolation (statistics screens, unit tests).
 *
 * Weight formula for a pair (a, b):
 *   weight = Σ [ contribution_i × e^(-λ × Δdays_i) ]
 *
 * contribution_i per record:
 *   ok === true              → config.reward_correct   (negative — reduces weight)
 *   ok === false, ua === -1  → config.penalty_timeout  (positive — increases weight)
 *   ok === false, ua !== -1  → config.penalty_wrong    (positive — increases weight)
 *
 * Records older than config.max_history_days are ignored.
 * A weight ≤ 0 means the pair is "healed" — it maps to 1 copy in the deck.
 */

const WEIGHT_CONFIG_KEY = 'tt-weight-config';

const DEFAULT_WEIGHT_CONFIG = Object.freeze({
    lambda:           0.15,  // decay rate (per day)
    penalty_wrong:    1.0,   // contribution for wrong answer
    penalty_timeout:  1.2,   // contribution for timeout
    reward_correct:  -0.4,   // contribution for correct answer (negative)
    k_linear:         2.0,   // linear scaling factor for copies
    max_copies:       6,     // upper bound for copies per pair in the deck
    max_history_days: 60,    // records older than this are ignored
});

/**
 * Read the weight configuration from localStorage.
 * If absent or malformed, writes defaults and returns them.
 * Never throws.
 * @returns {{lambda:number, penalty_wrong:number, penalty_timeout:number,
 *            reward_correct:number, k_linear:number, max_copies:number,
 *            max_history_days:number}}
 */
export function getWeightConfig() {
    try {
        const raw = localStorage.getItem(WEIGHT_CONFIG_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            // Merge with defaults so new fields added in future always have a value
            const config = { ...DEFAULT_WEIGHT_CONFIG, ...parsed };
            return config;
        }
    } catch {
        // fall through to write defaults
    }
    // Write defaults to localStorage so future reads find them
    try {
        localStorage.setItem(WEIGHT_CONFIG_KEY, JSON.stringify(DEFAULT_WEIGHT_CONFIG));
    } catch {
        // localStorage unavailable — silently ignore
    }
    return { ...DEFAULT_WEIGHT_CONFIG };
}

/**
 * Compute the exponential-decay weight for a single pair (a, b).
 *
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @param {Array<{ts:number, a:number, b:number, ua:number, ok:boolean, ms:number}>} answers
 *   Full or pre-filtered answer log. Only records matching (a,b) are used.
 * @param {{lambda:number, penalty_wrong:number, penalty_timeout:number,
 *          reward_correct:number, max_history_days:number}} config
 * @returns {number} Weight value. ≤ 0 means the pair is "healed".
 */
export function computeWeight(a, b, answers, config) {
    const now = Date.now();
    const maxAgeMs = config.max_history_days * 86_400_000;
    let weight = 0;

    for (const record of answers) {
        // Match only this pair (no commutation — (a,b) and (b,a) are distinct)
        if (record.a !== a || record.b !== b) continue;

        const ageMs = now - record.ts;
        if (ageMs > maxAgeMs) continue;

        const deltaDays = ageMs / 86_400_000;
        const decay = Math.exp(-config.lambda * deltaDays);

        let contribution;
        if (record.ok) {
            contribution = config.reward_correct;
        } else if (record.ua === -1) {
            contribution = config.penalty_timeout;
        } else {
            contribution = config.penalty_wrong;
        }

        weight += contribution * decay;
    }

    return weight;
}

/**
 * Compute the number of copies to insert in the deck for pair (a, b).
 * Applies linear mapping with clamp: copies = clamp(round(1 + weight × k_linear), 1, max_copies)
 * A weight ≤ 0 always returns 1 (minimum guaranteed).
 *
 * @param {number} a
 * @param {number} b
 * @param {Array} answers
 * @param {{lambda:number, penalty_wrong:number, penalty_timeout:number,
 *          reward_correct:number, k_linear:number, max_copies:number,
 *          max_history_days:number}} config
 * @returns {number} Integer in [1, config.max_copies]
 */
export function computeCopiesForPair(a, b, answers, config) {
    const weight = computeWeight(a, b, answers, config);
    if (weight <= 0) return 1;
    const copies = Math.round(1 + weight * config.k_linear);
    return Math.min(Math.max(copies, 1), config.max_copies);
}
