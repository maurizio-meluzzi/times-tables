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
 * answers.js
 * Persistence module for answer records (tt-answers).
 * Append-only log: each answer is stored as an independent record.
 *
 * Record shape:
 *   ts  {number}  — Unix timestamp in milliseconds
 *   a   {number}  — first operand
 *   b   {number}  — second operand
 *   ua  {number}  — user answer (-1 if timeout, no answer given)
 *   ok  {boolean} — true if correct; false if wrong or timeout
 *   ms  {number}  — response time in milliseconds
 *
 * Callers are responsible for deciding whether to call these functions
 * (e.g. only when weighted mode is active). This module has no policy.
 */

const STORAGE_KEY = 'tt-answers';

/**
 * Load the full answer log from localStorage.
 * Never throws — returns empty array on any error.
 * @returns {Array<{ts:number, a:number, b:number, ua:number, ok:boolean, ms:number}>}
 */
export function loadAnswers() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

/**
 * Append a single answer record to the log.
 * Never throws.
 * @param {{ts:number, a:number, b:number, ua:number, ok:boolean, ms:number}} record
 */
export function appendAnswer(record) {
    try {
        const answers = loadAnswers();
        answers.push(record);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
        // localStorage unavailable (private browsing quota, etc.) — silently ignore
    }
}

/**
 * Clear the full answer log.
 * Never throws.
 */
export function clearAnswers() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // silently ignore
    }
}
