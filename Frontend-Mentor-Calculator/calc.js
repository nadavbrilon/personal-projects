
/* Variables */
let currOperator = "";
let prevOperator = "";
let currDigit = "";
let currExpression = "";
let leftNumber = "";
let rightNumber = "";
let disableClick = false;

const numberButton = document.querySelectorAll('.button-number')
const opButton = document.querySelectorAll('.button-op')
const display = document.querySelector('.calc-display')


const math = {
    '+': function (x, y) { return parseFloat(x + y) },
    '-': function (x, y) { return parseFloat(x - y) },
    'x': function (x, y) { return parseFloat((x * y).toFixed(8)) },
    '/': function (x, y) {
        const value = parseFloat((x / y).toFixed(8));
        if (isNaN(value) || value === Infinity) {
            console.log(value);
            currExpression = "Math Error";
            updateDisplay(currExpression, "");
            return currExpression;
        }
        return value;
    }
};

function isSyntaxCorrect(syntax) {
    const operators = ['+', '-', 'x', '/'];
    syntax = String(syntax);    // this enables iteration over multiple expressions 
    isSyntaxValid = [...syntax].every(letter => operators.includes(letter) === false);

    console.log(isSyntaxValid);
    return isSyntaxValid;
}


/* Calculator function handling */
function updateDisplay(currExpresion, currButton = "") {
    const legalAfterInitZero = ['.', '+', '-', 'x', '/']

    if (currExpresion !== '0' || legalAfterInitZero.indexOf(currButton) !== -1) {   //edge case - multiple zeros before other digits
        currExpresion += currButton;
        display.innerText = currExpresion;
    }

    return currExpresion;
}

function calculate(leftNumber, rightNumber, currOperator) {

    const syntaxCorrect = isSyntaxCorrect(leftNumber) && isSyntaxCorrect(rightNumber);  //todo: valid right left is number

    if (syntaxCorrect === false) {
        currExpression = "Syntax Error";
        updateDisplay(currExpression, "");

        disableClick = true;
        return currExpression;
    }

    /* calc expression */
    currExpression = math[currOperator](Number(leftNumber), Number(rightNumber));   // todo: Number is object, use parseInt instead
    display.innerText = currExpression;


    resetCalc(currExpression);
}

// resetCalc resets entire calculator - but can keep the current display
function resetCalc(expressionValue) {
    leftNumber = "";
    rightNumber = "";
    currDigit = "";
    prevOperator = "";
    currOperator = "";
    currExpression = expressionValue
    updateDisplay(expressionValue, "");

    disableClick = false;
}
// for 'DEL' function on calc
function deleteChar(currExpression) {
    lastChar = currExpression.charAt(currExpression.length - 1);
    if (currOperator === lastChar) {
        currOperator = "";
    }

    slicedExpression = currExpression.slice(0, -1);
    currDigit = slicedExpression.charAt(slicedExpression.length - 1);
    currExpression = updateDisplay(slicedExpression, "");
    return currExpression;
}
/* Number Button Handler */
numberButton.forEach(btn => {       // tal: closure, its better to put eventlistener in a function (init calc) to be called once.
    btn.addEventListener('click', () => {

        if (!disableClick) {
            currDigit = btn.innerText;
            currExpression = updateDisplay(currExpression, currDigit);
        }

    })
})

/* Operator Button Handler */
opButton.forEach(btn => {   //todo: same as button
    btn.addEventListener('click', () => {

        if (btn.innerText !== 'RESET' && disableClick) {
            exit;   // this ok to use?
        }

        if (btn.innerText === '=' || btn.innerText === 'DEL') {
            prevOperator = currOperator;
        }
        currOperator = btn.innerText;
        // console.log(currOperator)

        /* handle by operator type */
        switch (currOperator) {
            case ('RESET'):
                resetCalc("");
                break;

            case ('DEL'):
                currOperator = prevOperator;
                currExpression = deleteChar(currExpression);
                break;

            case ('='):
                rightNumber = currExpression.substring(currExpression.indexOf(prevOperator) + 1);
                calculate(leftNumber, rightNumber, prevOperator);
                break;

            default:
                leftNumber = currExpression;
                currExpression = updateDisplay(currExpression, currOperator);
        }
    })
})


/** Questions & Thoughts

1. Q - better to handle info during building of expression or parse at the end.
1.1. if "real time" handling - add syntax error flag? (234++)
2. Global variables definition and usage (is it okay in here?)
3. help to make this code ES6 friendly - when is best to use arrow functions. => this for window.
4. is it possible to make a function that disables the buttons ? relationship between objects/elements and functions
 */
