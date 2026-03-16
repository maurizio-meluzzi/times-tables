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
    // Calculate the range: max is 8, min is 3, so range = 6
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
