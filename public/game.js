/**
 * game.js
 * Game orchestrator: imports all modules, manages game state, coordinates flow.
 */

import * as engine from './engine.js';
import * as countdown from './countdown.js';
import * as input from './input.js';
import * as ui from './ui.js';

// Game state
let currentOperation = null;
let givenDigits = 0;

/**
 * Initialize the game.
 */
export function init() {
    // Bind input handlers
    input.init(handleDigitPress);
    
    // Bind modal close handlers
    ui.bindModalClose(handleModalClose);
    
    // Show welcome modal
    ui.showWelcomeModal();
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
 * Handle modal close.
 */
function handleModalClose() {
    ui.hideAllModals();
    startNewQuestion();
}
