const calcBox     = document.getElementById('calc-box');
const resBox      = document.getElementById('res-box');

const modalOk     = document.getElementById("modal-ok");
const modalOkRes  = document.getElementById("ok-row-02");
const modalNok    = document.getElementById("modal-nok");
const modalNokRes = document.getElementById("nok-row-02");

const modalTimeEnded    = document.getElementById("modal-time-ended");
const modalTimeEndedRes = document.getElementById("te-row-02");

const modalWelcome = document.getElementById("modal-welcome");


const clockSound = document.createElement("audio");
clockSound.src = 'sound/singleTick.mp3';
clockSound.setAttribute("preload", "auto");
clockSound.setAttribute("controls", "none");
clockSound.style.display = "none";
document.body.appendChild(clockSound);

const lastTimesTable = 9;

let result       = '';
let resultDigits = 0;

let givenDigits  = 0;

let cellShutter;

// ----------------------------------------------------------------
// get buttons and bind them
let digitBtns = document.getElementsByClassName('digit');
for (let i = 0; i < digitBtns.length; i++) {
    digitBtns[i].addEventListener("click", function() {
        keyPressed(digitBtns[i].innerHTML);
    });
}

// ----------------------------------------------------------------
// bind close modal event
modalOk.addEventListener("click",  closeModal);
modalNok.addEventListener("click", closeModal);
modalTimeEnded.addEventListener("click", closeModal);
modalWelcome.addEventListener("click", closeModal);


// ----------------------------------------------------------------
// manage key press
function keyPressed(digitValue){
//    console.log('---- digitValue: '  + digitValue);
//    console.log('---- givenDigits: ' + givenDigits);
//    console.log('---- resultDigits: ' + resultDigits);

    incrementDigits();
    showDigits(digitValue);
    
    if (givenDigits == resultDigits) {
    	checkResult();
    }
}


// ----------------------------------------------------------------
// manage given answer
function incrementDigits() {
	givenDigits++;
}

function showDigits(digitValue) {
	if (givenDigits <= resultDigits) {
    	resBox.innerHTML += digitValue;
    }
}

function checkResult() {
    clearInterval(cellShutter);
    // clockSound.load();

    if (resBox.innerHTML == result) {
        modalOk.style.display = "block";
    }
    else {
        modalNok.style.display = "block";
    }
}

function resetDigits() {
	resBox.innerHTML = '';
	givenDigits = 0;
}

function closeModal() {
    modalOk.style.display        = "none";
    modalNok.style.display       = "none";
    modalTimeEnded.style.display = "none";
    modalWelcome.style.display   = "none";

    resetDigits();
    generateCalc();
}


// ----------------------------------------------------------------
// question generator
function generateCalc() {

    // 0+3  ---- 6 + 3
    // 3    ---- 9
	// GET RAND <= 9 (>=3)
    let x = Math.floor(Math.random() * 6) + 3;
    // GET RAND <= 9 (>=3)
    let y = Math.floor(Math.random() * 6) + 3;

    calcBox.innerHTML = x + ' x ' + y;
    result = '' + (x*y);
    resultDigits = result.length;

    modalOkRes.innerHTML        = x + 'x' + y + '=' + result;
    modalNokRes.innerHTML       = x + 'x' + y + '=' + result;
    modalTimeEndedRes.innerHTML = x + 'x' + y + '=' + result;

    startCountDown();
}

function startCountDown() {
    // recover background of table
    const countDownTds = document.querySelectorAll('.time-counter');
    countDownTds.forEach( element => {
        element.style.backgroundColor = '#FADECB';
    });

    // clockSound.load();
    // clockSound.play();

    let remainingTd = 10;
    cellShutter = setInterval(
        function() {
            if (remainingTd == 0) {
                clearInterval(cellShutter);
                modalTimeEnded.style.display = "block";
            }
            else {
                let tdId = 'time-counter-' + remainingTd;
                // console.log(tdId);
                // document.getElementById('time-counter-' + remainingTd).style.backgroundColor = '#F4C2DF';
                document.getElementById(tdId).style.backgroundColor = '#F4C2DF';
                clockSound.play();
                remainingTd--;
            }
        },
        1000
    );
}

// ----------------------------------------------------------------
// ENTRY POINT
// generateCalc();
modalWelcome.style.display = "block";