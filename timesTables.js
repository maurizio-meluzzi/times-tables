const calcBox = document.getElementById('calc-box');
const resBox = document.getElementById('res-box');

const lastTimesTable = 5;

let result = 0;
let resultDigits = 0;

let givenDigits = 0;


let digitBtns = document.getElementsByClassName('digit');
for (let i = 0; i < digitBtns.length; i++) {
    digitBtns[i].addEventListener("click", function() {
        keyPressed(digitBtns[i].innerHTML);
    });
//    digitBtns[i].addEventListener('touchstart', function() {
//        keyPressed(digitBtns[i].innerHTML);
//    });
}

function keyPressed(digitValue){
    console.log('---- digitValue: '  + digitValue);
    console.log('---- givenDigits: ' + givenDigits);
    console.log('---- resultDigits: ' + resultDigits);

    incrementDigits();
    showDigits(digitValue);
    
    if (givenDigits == resultDigits) {
    	checkResult();
        resetDigits();
        generateCalc();
		console.log('-');
    }
}

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
        alert('GIUSTO!!!!');
    }
    else {
        // console.log('SBAGLIATO');
        alert('SBAGLIATO');
    }
}

function resetDigits() {
	resBox.innerHTML = '';
	givenDigits = 0;
}

function generateCalc() {
	// GET RAND <= 4 (>=0)
    let x = Math.floor(Math.random() * (lastTimesTable))+1;
    // GET RAND <= 10 (>=0)
    let y = Math.floor(Math.random() * 11);

    calcBox.innerHTML = x + ' x ' + y;
    result = '' + (x*y);
    resultDigits = result.length;
}

generateCalc();
