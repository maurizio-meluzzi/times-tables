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
import { loadSettings } from './settings.js';
import { appendAnswer } from './answers.js';

// Game state
let currentOperation = null;
let givenDigits = 0;
let sessionTickDuration = 1000;
let sessionWeighted = false;
let questionStartTime = 0;

/**
 * Initialize the game.
 */
export function init() {
    // Load settings from localStorage
    const settings = loadSettings();
    sessionTickDuration = settings.tickDuration;

    // Initialise the operation engine for this session
    engine.initEngine({ tables: settings.tables, maxFactor: settings.maxFactor, weighted: settings.weighted });

    // Store weighted flag for use in answer recording
    sessionWeighted = settings.weighted;

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
    
    // Record question start time for response-time tracking
    questionStartTime = Date.now();

    // Start countdown (10 ticks, tickDuration ms each)
    countdown.start(10, handleCountdownTick, handleCountdownExpire, sessionTickDuration);
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
    const isCorrect = userAnswer == currentOperation.result;
    const responseMs = Date.now() - questionStartTime;

    if (sessionWeighted) {
        appendAnswer({
            ts: questionStartTime,
            a:  currentOperation.x,
            b:  currentOperation.y,
            ua: Number(userAnswer),
            ok: isCorrect,
            ms: responseMs,
        });
    }

    if (isCorrect) {
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
    const responseMs = Date.now() - questionStartTime;

    if (sessionWeighted) {
        appendAnswer({
            ts: questionStartTime,
            a:  currentOperation.x,
            b:  currentOperation.y,
            ua: -1,
            ok: false,
            ms: responseMs,
        });
    }

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
