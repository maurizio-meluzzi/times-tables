/**
 * ui.js
 * Manages all DOM updates: modals, calc-box, res-box, countdown cells.
 * Exposes specific functions for each UI operation.
 */

// DOM element references
const calcBox = document.getElementById('calc-box');
const resBox = document.getElementById('res-box');

const modalOk = document.getElementById("modal-ok");
const modalOkRes = document.getElementById("ok-row-02");
const modalNok = document.getElementById("modal-nok");
const modalNokRes = document.getElementById("nok-row-02");
const modalTimeEnded = document.getElementById("modal-time-ended");
const modalTimeEndedRes = document.getElementById("te-row-02");
const modalWelcome = document.getElementById("modal-welcome");

/**
 * Display the current operation in the calc-box.
 * @param {number} x - First factor
 * @param {number} y - Second factor
 */
export function showOperation(x, y) {
    calcBox.innerHTML = x + ' x ' + y;
}

/**
 * Update the result box by appending a digit.
 * @param {string} digit - Digit to append
 */
export function appendDigitToResult(digit) {
    resBox.innerHTML += digit;
}

/**
 * Clear the result box.
 */
export function clearResult() {
    resBox.innerHTML = '';
}

/**
 * Get the current value in the result box.
 * @returns {string} - Current result value
 */
export function getResultValue() {
    return resBox.innerHTML;
}

/**
 * Show the OK modal with the operation result.
 * @param {number} x - First factor
 * @param {number} y - Second factor
 * @param {number} result - Operation result
 */
export function showOkModal(x, y, result) {
    modalOkRes.innerHTML = x + 'x' + y + '=' + result;
    modalOk.style.display = "block";
}

/**
 * Show the NOK modal with the operation result.
 * @param {number} x - First factor
 * @param {number} y - Second factor
 * @param {number} result - Operation result
 */
export function showNokModal(x, y, result) {
    modalNokRes.innerHTML = x + 'x' + y + '=' + result;
    modalNok.style.display = "block";
}

/**
 * Show the time ended modal with the operation result.
 * @param {number} x - First factor
 * @param {number} y - Second factor
 * @param {number} result - Operation result
 */
export function showTimeEndedModal(x, y, result) {
    modalTimeEndedRes.innerHTML = x + 'x' + y + '=' + result;
    modalTimeEnded.style.display = "block";
}

/**
 * Show the welcome modal.
 */
export function showWelcomeModal() {
    modalWelcome.style.display = "block";
}

/**
 * Hide all modals.
 */
export function hideAllModals() {
    modalOk.style.display = "none";
    modalNok.style.display = "none";
    modalTimeEnded.style.display = "none";
    modalWelcome.style.display = "none";
}

/**
 * Reset countdown cells to initial state (background color).
 */
export function resetCountdownCells() {
    const countDownTds = document.querySelectorAll('.time-counter');
    countDownTds.forEach(element => {
        element.style.backgroundColor = '#FADECB';
    });
}

/**
 * Update a specific countdown cell.
 * @param {number} cellNumber - Cell number (1-10)
 */
export function updateCountdownCell(cellNumber) {
    const tdId = 'time-counter-' + cellNumber;
    const cell = document.getElementById(tdId);
    if (cell) {
        cell.style.backgroundColor = '#F4C2DF';
    }
}

/**
 * Bind click handlers to all modals for closing.
 * @param {Function} onModalClose - Callback invoked when any modal is closed
 */
export function bindModalClose(onModalClose) {
    modalOk.addEventListener("click", onModalClose);
    modalNok.addEventListener("click", onModalClose);
    modalTimeEnded.addEventListener("click", onModalClose);
    modalWelcome.addEventListener("click", onModalClose);
}
