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
 */

/**
 * Generates a new multiplication operation.
 * @param {number} min - Minimum value for factors (default: 3)
 * @param {number} max - Maximum value for factors (default: 8)
 * @returns {Object} - { x, y, result, resultDigits }
 */
export function generateOperation(min = 3, max = 8) {
    // Calculate the range
    const range = max - min + 1;
    
    // Get random number between min and max (inclusive)
    const x = Math.floor(Math.random() * range) + min;
    const y = Math.floor(Math.random() * range) + min;
    
    const result = x * y;
    const resultDigits = String(result).length;
    
    return {
        x,
        y,
        result,
        resultDigits
    };
}
