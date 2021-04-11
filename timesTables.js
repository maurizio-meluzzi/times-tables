const calcBox     = document.getElementById('calc-box');
const resBox      = document.getElementById('res-box');
const modalOk     = document.getElementById("modal-ok");
const modalNok    = document.getElementById("modal-nok");
const modalOkRes  = document.getElementById("ok-row-02");
const modalNokRes = document.getElementById("nok-row-02");

const lastTimesTable = 5;

let result       = '';
let resultDigits = 0;

let givenDigits  = 0;

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
    if (resBox.innerHTML == result) {
        // console.log('GIUSTO!!!!');
        // alert('GIUSTO!!!!');
        modalOk.style.display = "block";
    }
    else {
        // console.log('SBAGLIATO');
        // alert('SBAGLIATO');
        modalNok.style.display = "block";
    }

    //resetDigits();
    //generateCalc();
}

function resetDigits() {
	resBox.innerHTML = '';
	givenDigits = 0;
}

function closeModal() {
    modalOk.style.display  = "none";
    modalNok.style.display = "none";
    resetDigits();
    generateCalc();
}


// ----------------------------------------------------------------
// question generator
function generateCalc() {
	// GET RAND <= 4 (>=0)
    let x = Math.floor(Math.random() * (lastTimesTable))+1;
    // GET RAND <= 10 (>=0)
    let y = Math.floor(Math.random() * 11);

    calcBox.innerHTML = x + ' x ' + y;
    result = '' + (x*y);
    resultDigits = result.length;

    modalOkRes.innerHTML  = x + 'x' + y + '=' + result;
    modalNokRes.innerHTML = x + 'x' + y + '=' + result;
}


// ----------------------------------------------------------------
// ENTRY POINT
generateCalc();
