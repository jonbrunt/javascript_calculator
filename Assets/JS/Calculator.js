//targets all keys and output fields
const keys = document.querySelectorAll('.keys');
const display = document.querySelector('h3');
const smallDisplay = document.querySelector('h5');
//declares global variables
let current = ''; //logs current string of operations
let displayValue = ''; //logs current entry field
let clearAvailable = false; //controls availability of "clear entry" key
let operatorRequired = false; //controls operator input requirement after "clear entry" of an operator
//initializes the program
main();
//main operation that detects and manipulates key input and controls process flow
function main() {
	//iteraties over all key targets to select key clicked
	for (let i = 0; i <= 18; i++) {
		keys[i].addEventListener('click', function () {
	    	sound(); //triggers key tone mp3
	    	//assigns variable for use in keys that do not have a value attribute
	    	let inner = this.innerText.replace(/\s+/g,'');
	    	//assigns variable for all other keys based on specific value attribute
	    	let val = this.value
	    	if (inner === 'AC') {reset();} //if AC key, resets calculator/progran
	    	else if (inner === 'CE') {clearEntry();} //if CE key, calls clearEntry()
	    	else if (inner === '+/-') {posNeg();} //if +/- key, calls function that controls action
	    	else if (val === '.') {decimalPoint(val)} //if decimal key, calls function that controls action
	    	else if (val === '0') {zero(val);} //if 0 key, calls specific function for zero
	    	else if (val === '=') {solve();} //if = key, solves current string of operation
	    	else if (/^[\*|\/|\-|\+]$/.test(val)) {updateOperator(val);} //if an operator key, calls operater function
			else {updateNumber(val);} //else is number between 1-9 and updates number via updateNumber()
		});
	}
}
//invokes key click mp3
function sound() {
	let audio = new Audio('Assets/Sounds/multimedia_button_click_010.mp3');
	audio.play();
}
//function that resets calculator/program
function reset() {
	//sets all global variables and output displays to initial values
	current = '';
	displayValue = ''; 
	display.innerText = '0';
	smallDisplay.innerText = '0';
	clearAvailable = false;
	operatorRequired = false;
}
//function controlling CE key
function clearEntry() {
	if (clearAvailable === true) { //executes if use of key is allowed
		display.innerText = '0'; //clears main display
		let arr = current.trim().split(' '); //splits current operation string for analysis
		if (arr.length === 1) {reset();} //invokes reset function if current operation consists of one number and no operator
		else if (/^[\*|\/|\-|\+]$/.test(arr[arr.length - 1])) { //regex detecting presence of operator in final operation entry
			displayValue = arr[arr.length - 2]; //assigns new displayValue as last number in operation
			current = current.trim().split(' ').slice(0, -1).join(' '); //removes operator
			smallDisplay.innerText = current; //updates chain display
			operatorRequired = true; //requires entry of new operator immediately
		}
		else { //else if not an operator (is number)
			displayValue = ''; //resets display
			current = current.trim().split(' ').slice(0, -1).join(' ') + ' '; //removes number
		}
	}
	clearAvailable = false; //deactivates clear entry button until new number entered
}
//adds number to string of operation
function updateNumber(val) {
	//invokes if output display does not exceed max chars and if operator key not required
	if (displayValue.length < 15 && operatorRequired === false) {
		current += val; //concatenates current key clicked to current number data
		if (displayValue === '') {displayValue = val;} //if initial number in entry, displays single number
		else {displayValue += val;} //else displays multiple digit number
		display.innerText = displayValue; //updates main display
	}
	clearAvailable = true; //reactivates clear entry button
}
//adds operator to operation chain
function updateOperator(val) { 
	//invokes if a current number is in chain 
	if (displayValue !== '') {
		current += (' ' + val + ' '); //adds operator to chain with leading and trailing whitespace
		display.innerText = val; //updates display
		smallDisplay.innerText = current; //updates chain display
		displayValue = ''; //clears display value
	}
	clearAvailable = true; //allows CE key to be used
	operatorRequired = false; //reverses requirement of operator entry
}
//toggles positive and negative function for current number 
function posNeg() {
	//invokes if operator not required and number is present
	if (operatorRequired === false && displayValue !== '') {
		if (/^[\-]/.test(displayValue)) { //detects if current number is negative
			displayValue = displayValue.split('').slice(1).join(''); // removes "-"
		}
		else {displayValue = '-' + displayValue;} //else adds negative
		display.innerText = displayValue; //updates display
		//updates current operation chain
		current = current.split(' ').slice(0, -1).join(' ') + ' ' + displayValue;
	}
}
//function controlling decimal operation
function decimalPoint(val) {
	//invokes if decimal is currently not in entry, and if operator is not required
	if (/^[0-9]+[\.][0-9]*$/.test(displayValue) === false && operatorRequired === false) {
		//if current entry is blank, adds a zero and trailing decimal, updates string, and display
		if (displayValue === '') {displayValue = '0.'; current += displayValue; display.innerText = displayValue;}
		//else adds decimal unless entry char count is one below limit
		else {if (displayValue.length < 14) {updateNumber(val);}}
	}
	clearAvailable = true; //makes CE key available
}
//special function for 0 key
function zero(val) {
	//invokes if current number exists and operator is not required
	if (displayValue !== '' && operatorRequired === false) {
		//adds zero if current character limit is not exceeded
		if (displayValue.length < 15) {updateNumber(val);}
	}
}
//solves operation string obeying order of operation
function solve() {
	//invokes if number present and operator is not required
	if (displayValue !== '' && operatorRequired === false) {
		let solution = round(math.eval(current), 4); //evaluates answer for rounding 
		//limits any answer to under 10 billion
		if (solution <= 9999999999.9999) {
			display.innerText = solution; //updates display
			smallDisplay.innerText = '0'; //clears string display
			current = solution.toString(); //updates current string to string of answer
			displayValue = solution; //updates current display value variable
		}
		else {// else if answer exceeds limit displays error message on both displays
			display.innerText = 'ERROR';
			smallDisplay.innerText = 'ERROR';
			setTimeout(function() { //resets calculator/program on 1.5 sec delay
				reset();
			}, 1500);
		}
	}
	clearAvailable = false; //allows use of CE key
}
//accurately rounds numbers over four decimal places
function round(num, precision) { //accepts number to be evaluated for rounding and default degree of precion (4)
  return Number(Math.round(num + 'e' + precision) + 'e-' + precision);
}