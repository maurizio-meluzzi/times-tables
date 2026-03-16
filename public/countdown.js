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
