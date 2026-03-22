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
 * game.js
 * Game orchestrator: imports all modules, manages game state, coordinates flow.
 */

import * as engine from './engine.js';
import * as countdown from './countdown.js';
import * as input from './input.js';
import * as ui from './ui.js';

// Tables included in the current session (any subset of 1–12)
const sessionTables = [1, 2, 3, 4];
// Max second factor: 10 for beginners, 11 or 12 for full tables
const sessionMaxFactor = 10;

// Game state
let currentOperation = null;
let givenDigits = 0;

/**
 * Initialize the game.
 */
export function init() {
    // Initialise the operation engine for this session
    engine.initEngine({ tables: sessionTables, maxFactor: sessionMaxFactor });

    // Bind input handlers
    input.init(handleDigitPress);
    
    // Bind modal close handlers
    ui.bindModalClose(handleModalClose);

    // Bind exit button
    ui.bindExitButton(exitGame);
    
    // Start immediately — no welcome screen here, landing page is index.html
    startNewQuestion();
}

/**
 * Start a new question.
 */
function startNewQuestion() {
    // Generate new operation
    currentOperation = engine.generateOperation();
    
    // Reset given digits counter
    givenDigits = 0;
    
    // Update UI
    ui.showOperation(currentOperation.x, currentOperation.y);
    ui.clearResult();
    ui.resetCountdownCells();
    
    // Start countdown (10 ticks, 1 second each)
    countdown.start(10, handleCountdownTick, handleCountdownExpire);
}

/**
 * Handle digit button press.
 * @param {string} digit - Pressed digit value
 */
function handleDigitPress(digit) {
    // Increment given digits counter
    givenDigits++;
    
    // Show digit in result box
    ui.appendDigitToResult(digit);
    
    // Check if answer is complete
    if (givenDigits === currentOperation.resultDigits) {
        checkAnswer();
    }
}

/**
 * Check the user's answer.
 */
function checkAnswer() {
    // Stop countdown
    countdown.stop();
    
    // Get user answer
    const userAnswer = ui.getResultValue();
    
    // Compare with correct result
    if (userAnswer == currentOperation.result) {
        ui.showOkModal(currentOperation.x, currentOperation.y, currentOperation.result);
    } else {
        ui.showNokModal(currentOperation.x, currentOperation.y, currentOperation.result);
    }
}

/**
 * Handle countdown tick.
 * @param {number} remaining - Remaining ticks
 */
function handleCountdownTick(remaining) {
    ui.updateCountdownCell(remaining);
}

/**
 * Handle countdown expiration.
 */
function handleCountdownExpire() {
    ui.showTimeEndedModal(currentOperation.x, currentOperation.y, currentOperation.result);
}

/**
 * Exit the game and return to the landing page.
 */
function exitGame() {
    countdown.stop();
    ui.hideAllModals();
    window.location.href = 'index.html';
}

/**
 * Handle modal close.
 */
function handleModalClose() {
    ui.hideAllModals();
    startNewQuestion();
}
