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
// showWelcomeModal removed — welcome screen is now the landing page (index.html)

/**
 * Hide all modals.
 */
export function hideAllModals() {
    modalOk.style.display = "none";
    modalNok.style.display = "none";
    modalTimeEnded.style.display = "none";
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
}

/**
 * Bind the exit button to navigate back to the landing page.
 * @param {Function} onExit - Callback invoked when the exit button is clicked
 */
export function bindExitButton(onExit) {
    const btnExit = document.getElementById('btn-exit');
    if (btnExit) {
        btnExit.addEventListener('click', onExit);
    }
}
