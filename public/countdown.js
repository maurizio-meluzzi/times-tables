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
 * countdown.js
 * Countdown timer with audio tick support.
 * Manages audio internally, no DOM dependencies except for audio element.
 */

// Create and configure audio element
const clockSound = document.createElement("audio");
clockSound.src = 'sound/singleTick.mp3';
clockSound.setAttribute("preload", "auto");
clockSound.setAttribute("controls", "none");
clockSound.style.display = "none";
document.body.appendChild(clockSound);

let intervalId = null;

/**
 * Start a countdown timer.
 * @param {number} duration - Duration in ticks (number of intervals)
 * @param {Function} onTick - Callback invoked each tick with remaining time (remainingTicks)
 * @param {Function} onExpire - Callback invoked when countdown reaches zero
 * @param {number} tickDuration - Duration of each tick in milliseconds (default: 1000)
 */
export function start(duration, onTick, onExpire, tickDuration = 1000) {
    // Stop any existing countdown
    stop();
    
    let remaining = duration;
    
    intervalId = setInterval(() => {
        if (remaining === 0) {
            stop();
            if (onExpire) {
                onExpire();
            }
        } else {
            // Play tick sound
            clockSound.play();
            
            // Invoke tick callback with remaining time
            if (onTick) {
                onTick(remaining);
            }
            
            remaining--;
        }
    }, tickDuration);
}

/**
 * Stop the current countdown.
 */
export function stop() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}
