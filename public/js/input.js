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
 * input.js
 * Manages digit button binding (touch and click support).
 * Handles visual feedback and invokes callback on digit press.
 */

/**
 * Initialize digit button bindings.
 * @param {Function} onDigitPressed - Callback invoked when a digit is pressed, receives digit value as string
 */
export function init(onDigitPressed) {
    const digitBtns = document.getElementsByClassName('digit');
    
    for (let i = 0; i < digitBtns.length; i++) {
        const btn = digitBtns[i];
        
        // Touch start: add visual feedback and block the synthetic mouse/click event
        btn.addEventListener("touchstart", function(e) {
            e.preventDefault();
            btn.classList.add('pressed');
        }, { passive: false });
        
        // Touch end: remove visual feedback and trigger callback.
        // preventDefault() here prevents any residual synthetic click in edge cases.
        btn.addEventListener("touchend", function(e) {
            e.preventDefault();
            btn.classList.remove('pressed');
            if (onDigitPressed) {
                onDigitPressed(btn.innerHTML);
            }
        });
        
        // Touch cancel: finger left the element — remove pressed state, no callback
        btn.addEventListener("touchcancel", function() {
            btn.classList.remove('pressed');
        });
        
        // Click: trigger callback for mouse and keyboard only.
        // After a touch interaction, preventDefault() on touchstart suppresses this event.
        btn.addEventListener("click", function() {
            if (onDigitPressed) {
                onDigitPressed(btn.innerHTML);
            }
        });
    }
}
