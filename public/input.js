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
        
        // Touch start: add visual feedback
        btn.addEventListener("touchstart", function(e) {
            e.preventDefault();
            btn.classList.add('pressed');
        });
        
        // Touch end: remove visual feedback and trigger callback
        btn.addEventListener("touchend", function() {
            btn.classList.remove('pressed');
            if (onDigitPressed) {
                onDigitPressed(btn.innerHTML);
            }
        });
        
        // Click: trigger callback
        btn.addEventListener("click", function() {
            if (onDigitPressed) {
                onDigitPressed(btn.innerHTML);
            }
        });
    }
}
