module App {

    export class Calculator {
        constructor(calcinput) {
            this.calcInput(calcinput);
        }


        calcInput = ko.observable<string>();
        parsedInput: App.ParsedEquation;
        isValid = ko.observable<boolean>();
        calcOutput = ko.observable<number>();
        calcError = ko.observable<string>();
        isCalculating = ko.observable<boolean>(false);
        hasCalculated = ko.observable<boolean>(false);

        calculate() {
            this.isCalculating(true);
            this.hasCalculated(false);

            this.parseInput(); // This checks for invalid characters and some syntax checking, whilst converting the input into a parsed equation.

            if (this.isValid() && this.parsedInput.parsedEquation.length > 0) {
                this.validateInput(); // This performs further syntax checking on the parsed equation as a whole.
            }

            let evaluatedInput: ParsedEquation;
            if (this.isValid()) {
                let parsedInput = new ParsedEquation(this.parsedInput.parsedEquation)
                evaluatedInput = this.evaluateInput(parsedInput); // This evaluates the parsed equation into a single number.
            }
            if (this.isValid()) {
                // evaluateInput should always output a parsed equation of length 1 consisting of a single number, so this should never be called.
                if (evaluatedInput.parsedEquation.length !== 1) {
                    this.isValid(false);
                    this.calcError('Unexpected error');
                }
                else {
                    this.calcOutput(
                        Number(evaluatedInput.parsedEquation[0].equationTerm)
                    );

                }
            }
            this.isCalculating(false);
            this.hasCalculated(true);
        }

        parseInput() {
            let bracketCount = 0;

            this.parsedInput = new ParsedEquation([]);
            this.isValid(true);

            for (var char of this.calcInput()) {
                if (!this.isValid()) {
                    break;
                }

                if (/[(]/.test(char)) {
                    this.parsedInput.addNewEquationComponent(new EquationComponent(char, TermTypes.OpenBracket));
                    bracketCount++;
                }
                else if (/[)]/.test(char)) {
                    this.parsedInput.addNewEquationComponent(new EquationComponent(char, TermTypes.CloseBracket));
                    bracketCount--;
                }
                else if (/[-*+/^]/.test(char)) {
                    this.parsedInput.addNewEquationComponent(new EquationComponent(char, TermTypes.Operation));
                }
                else if (/[0-9]/.test(char)) {
                    if (this.parsedInput.recentType === TermTypes.Number) {
                        this.parsedInput.appendRecent(char);
                    }
                    else {
                        this.parsedInput.addNewEquationComponent(new EquationComponent(char, TermTypes.Number));
                    }
                }
                else if (/[.]/.test(char)) {
                    // A decimal point with no number preceding it will be assumed to have an implicit 0; i.e. .5 is intended to represent 0.5.
                    // The second term in the if statement tests whether the existing parsed number already contains a decimal point.
                    // In that situation, it will error rather than adding a second decimal point to a number.
                    if (this.parsedInput.recentType === TermTypes.Number) {
                        if (!(/[.]/.test(this.parsedInput.parsedEquation[this.parsedInput.parsedEquation.length - 1].equationTerm))) {
                            this.parsedInput.appendRecent(char);
                        }
                        else {
                            this.calcError('Invalid usage of decimal point');
                            this.isValid(false);
                        }

                    }
                    else {
                        this.parsedInput.addNewEquationComponent(new EquationComponent('0.', TermTypes.Number));
                    }
                }
                else if (/[ ]/.test(char)) {
                    // Ignore white space
                }
                else if (/[A-Za-z]/.test(char)) {
                    // Any alphabetic input is assumed to be a function.
                    char = char.toLowerCase();
                    if (this.parsedInput.recentType === TermTypes.Function) {
                        this.parsedInput.appendRecent(char);
                    }
                    else {
                        this.parsedInput.addNewEquationComponent(new EquationComponent(char, TermTypes.Function))
                    }

                }

                else {
                    this.calcError('Invalid character: ' + char);
                    this.isValid(false);
                }

                if (bracketCount < 0) {
                    // In this case more brackets have been closed than opened at this point in the input, which is never allowed.
                    this.calcError('Mismatching brackets')
                    this.isValid(false);
                }
            }

            if (bracketCount !== 0) {
                // Differing numbers of open and close brackets.
                this.calcError('Mismatching brackets')
                this.isValid(false);
            }
        }



        validateInput() {
            let parsedEquation = this.parsedInput.parsedEquation;

            // Must start an equation with an open bracket, number or function
            // Unless the first operation is a + or -, in which case this can be absorbed into the first number.
            if (
                (parsedEquation[0].termType !== TermTypes.Number) &&
                (parsedEquation[0].termType !== TermTypes.OpenBracket) &&
                (parsedEquation[0].termType !== TermTypes.Function)
            ) {
                if (
                    (parsedEquation[0].termType === TermTypes.Operation) &&
                    ((parsedEquation[0].equationTerm === "+") || (parsedEquation[0].equationTerm === "-"))
                ) {
                    // Add an implicit zero to the start of the parsed input
                    let implicitZero = new EquationComponent("0", TermTypes.Number);
                    parsedEquation.unshift(implicitZero);
                    this.parsedInput.parsedEquation = parsedEquation;
                }
                else {
                    this.isValid(false);
                    this.calcError('Invalid syntax at start of expression');
                }
            }

            for (let index: number = 1; index < parsedEquation.length; index++) {
                let firstType = parsedEquation[index - 1].termType;
                let secondType = parsedEquation[index].termType;
                let firstTerm = parsedEquation[index - 1].equationTerm;
                let secondTerm = parsedEquation[index].equationTerm;

                if ((firstType === TermTypes.Number) || (firstType === TermTypes.CloseBracket)) {
                    // Numbers and close brackets can be followed by an operation or a close bracket
                    if ((secondType !== TermTypes.Operation) && (secondType !== TermTypes.CloseBracket)) {
                        this.isValid(false);
                        this.calcError('Invalid syntax');
                        return;
                    }
                    continue;

                }
                else if (
                    (firstType === TermTypes.Operation) ||
                    (firstType === TermTypes.OpenBracket)
                ) {
                    // Operations and open brackets can be followed by a number, open bracket or function
                    // Unless an operation or open bracket is followed by a + or - and then a number, in which case this can be absorbed into the next number.
                    if (
                        (secondType === TermTypes.Operation) && (
                            (parsedEquation[index].equationTerm === "+") ||
                            (parsedEquation[index].equationTerm === "-")
                        ) &&
                        (
                            (parsedEquation.length !== index+1) && //Check that the + or - operation isn't the last entry in the string.
                            (parsedEquation[index + 1].termType === TermTypes.Number) 
                        )
                    ) {
                        // Append the symbol of the secondType to the start of the following number. 
                        let newTerm = parsedEquation[index].equationTerm.concat(parsedEquation[index + 1].equationTerm);
                        parsedEquation[index + 1].equationTerm = newTerm;

                        // Remove secondType from the parsed equation.
                        parsedEquation.splice(index, 1);
                        this.parsedInput.parsedEquation = parsedEquation; // I think this line is unnecessary; the previous line and splice does this already.

                        // Since the parsed equation has now changed, we start parsing again from the start.
                        this.validateInput();
                        return;


                    }
                    if (
                        (secondType !== TermTypes.Number) &&
                        (secondType !== TermTypes.OpenBracket) &&
                        (secondType !== TermTypes.Function)
                    ) {
                        this.isValid(false);
                        this.calcError('Invalid syntax');
                        return;
                    }
                    continue;
                }
                else if (firstType === TermTypes.Function) {
                    // The function name must be on the allowed list AllowedFunctions
                    // A function must be followed by an open bracket
                    if (AllowedFunctions.indexOf(firstTerm) === -1) {
                        // pi is incorrectly identified as a function; here we replace it with a number and its Javascript value
                        if (firstTerm === "pi") {
                            this.parsedInput.parsedEquation[index - 1].termType = TermTypes.Number;
                            this.parsedInput.parsedEquation[index - 1].equationTerm = String(Math.PI);
                            this.validateInput();
                            return;
                        }
                        this.isValid(false);
                        this.calcError('Unrecognised function ' + firstTerm);
                        return;
                    }
                    else if (secondType !== TermTypes.OpenBracket) {
                        this.isValid(false);
                        this.calcError('Invalid syntax');
                        return;
                    }

                    continue;
                }
            }

            // Must end an equation with a number or a close bracket (or pi)
            let lastIndex = parsedEquation.length - 1;
            if ((parsedEquation[lastIndex].termType !== TermTypes.Number) && (parsedEquation[lastIndex].termType !== TermTypes.CloseBracket)) {
                if ((parsedEquation[lastIndex].termType === TermTypes.Function) && (parsedEquation[lastIndex].equationTerm === "pi")) {
                    this.parsedInput.parsedEquation[lastIndex].termType = TermTypes.Number;
                    this.parsedInput.parsedEquation[lastIndex].equationTerm = String(Math.PI);
                    // Since pi as a number is a valid way to end the equation, we do not need to revalidate the string here.
                }
                else {
                    this.isValid(false);
                    this.calcError('Invalid syntax at end of expression');
                    return;
                }

            }
        }


        evaluateInput(inputToEvaluate: ParsedEquation, evaluatingBrackets = true): ParsedEquation {

            let inputLength = inputToEvaluate.parsedEquation.length;

            // Brackets
            // The evaluatingBrackets flag omits this step if explicitly told there are no brackets to evaluate.
            // (For instance from calls to evaluateInput from inside _evaluateBrackets)

            if (evaluatingBrackets) {
                inputToEvaluate = this._evaluateBrackets(inputToEvaluate);
            }

            // Once all brackets have been removed, every function should be immediately followed by its argument

            inputToEvaluate = this._evaluateFunction(inputToEvaluate);

            // Operations, performed in order using BODMAS.

            // Exponentiation
            inputToEvaluate = this._evaluateOperation("^", inputToEvaluate);

            // Multiplication and division (left to right)
            inputToEvaluate = this._evaluateOperation("/*", inputToEvaluate);

            // Addition and subtraction
            inputToEvaluate = this._evaluateOperation("+-", inputToEvaluate);


            // Check if all evaluations have been done

            if (inputLength === 0) {
                // The empty array evaluates to 0.
                inputToEvaluate.parsedEquation.push(new EquationComponent('0', TermTypes.Number));
            }
            else if (inputLength === 1) {
                if (!(inputToEvaluate.parsedEquation[0].termType === TermTypes.Number)) {
                    this.calcError('Unexpected error in evaluation process');
                    this.isValid(false);
                }
            }
            else {

                // Check that some simplification of the problem has occured (to avoid infinite loops)
                if (inputToEvaluate.parsedEquation.length < inputLength) {
                    inputToEvaluate = this.evaluateInput(inputToEvaluate, evaluatingBrackets);
                }
                else {
                    this.calcError('Unexpected error - no operations performed')
                    this.isValid(false);
                }
            }

            return inputToEvaluate;

        }


        private _evaluateBrackets(bracketedInputToEvaluate: ParsedEquation) {

            let bracketsFlag = true;
            while (bracketsFlag) {
                let [openBracketIndex, closeBracketIndex] = bracketedInputToEvaluate.locateBracketPair();
                if (openBracketIndex !== -1) {
                    let bracketLength = closeBracketIndex - openBracketIndex + 1;

                    let bracketedComponents = bracketedInputToEvaluate.parsedEquation.slice(openBracketIndex + 1, closeBracketIndex);

                    let bracketedEquation = new ParsedEquation(bracketedComponents);
                    let replacedComponent = this.evaluateInput(bracketedEquation, false);

                    bracketedInputToEvaluate.replaceEquationComponent(openBracketIndex, bracketLength, replacedComponent.parsedEquation[0]);
                }
                else {
                    bracketsFlag = false;
                }
            }

            return bracketedInputToEvaluate;
        }

        private _evaluateFunction(inputToEvaluate: ParsedEquation) {
            let functionFlag = true;
            while (functionFlag) {
                let functionIndex = inputToEvaluate.locateFunction();
                if (functionIndex !== -1) {
                    let functionName = inputToEvaluate.parsedEquation[functionIndex].equationTerm;
                    if (AllowedFunctions.indexOf(functionName) === -1) {
                        this.isValid(false);
                        this.calcError('Unexpected call to invalid function name: ' + functionName)
                    }
                    if (
                        (inputToEvaluate.parsedEquation.length === functionIndex - 1) ||
                        (inputToEvaluate.parsedEquation[functionIndex + 1].termType !== TermTypes.Number)
                    ) {
                        this.isValid(false);
                        this.calcError('Function ' + functionName + ' called with an invalid argument');
                    }
                    let argument = Number(inputToEvaluate.parsedEquation[functionIndex + 1].equationTerm);
                    let result: number;
                    if (functionName === "sin") {
                        result = Math.sin(argument);
                    }
                    else if (functionName === "cos") {
                        result = Math.cos(argument);
                    }
                    else if (functionName === "tan") {
                        result = Math.tan(argument);
                    }
                    else if (functionName === "e") {
                        result = Math.exp(argument);
                    }
                    else {
                        this.isValid(false);
                        this.calcError('No method supplied to evaluate function: ' + functionName);
                    }

                    inputToEvaluate.replaceEquationComponent(functionIndex, 2, new EquationComponent(String(result), TermTypes.Number));

                }
                else {
                    functionFlag = false;
                }
            }

            return inputToEvaluate;

        }


        private _evaluateOperation(operationList: string, inputToEvaluate: ParsedEquation) {
            // This should only be called with a string containing arguments +, -, *,/ or ^.
            // This will evaluate all occurrences of the selected operations in the parsed input.


            for (let char of operationList) {
                // Prevents function being claled with an invalid operation; this should never happen.
                if (!(/[-*+/^]/.test(char))) {
                    this.isValid(false);
                    this.calcError('Unexpected error - invalid call to evaluation operation');
                    return inputToEvaluate;
                }
            }


            let operationsFlag = true;
            while (operationsFlag) {
                let operation: string;
                let operationIndex = -1;

                // Select the allowed operation furthest to the left of the expression
                for (let char of operationList) {
                    let tempOperationIndex = inputToEvaluate.operationExists(char);
                    if (tempOperationIndex !== -1) {
                        if ((operationIndex === -1) || (tempOperationIndex < operationIndex)) {
                            // If an operation corresponding to char exists, we add this as our selected operation if no operation has been found yet.
                            // Otherwise we overwrite the currently selected operation if this operation occurs first.
                            operation = char;
                            operationIndex = tempOperationIndex;
                        }
                    }

                }
                // operationExists returns -1 if there are no instances of the specified operation.
                // Otherwise it returns the index of the parsed equation where such an operation should occur.
                if (operationIndex !== -1) {
                    // Check terms either side of the operation are numbers.
                    // This should have already been valided, so failing this would constitute an unexpected error.
                    if (
                        (inputToEvaluate.parsedEquation[operationIndex - 1].termType !== TermTypes.Number) ||
                        (inputToEvaluate.parsedEquation[operationIndex + 1].termType !== TermTypes.Number)
                    ) {
                        this.isValid(false);
                        this.calcError('Unexpected error - attempting to perform operation not on a number');
                    }
                    let firstOperand = Number(inputToEvaluate.parsedEquation[operationIndex - 1].equationTerm);
                    let secondOperand = Number(inputToEvaluate.parsedEquation[operationIndex + 1].equationTerm);
                    let operationResult: string;
                    if (operation === "+") {
                        operationResult = String(firstOperand + secondOperand);
                    }
                    else if (operation === "-") {
                        operationResult = String(firstOperand - secondOperand);
                    }
                    else if (operation === "*") {
                        operationResult = String(firstOperand * secondOperand);
                    }
                    else if (operation === "/") {
                        if (secondOperand !== 0) {
                            operationResult = String(firstOperand / secondOperand);
                        }
                        else {
                            this.calcError('Attempted division by 0');
                            this.isValid(false);
                        }
                    }
                    else if (operation === "^") {
                        operationResult = String(Math.pow(firstOperand, secondOperand));
                    }

                    inputToEvaluate.replaceEquationComponent(operationIndex - 1, 3, new EquationComponent(operationResult, TermTypes.Number));
                }
                else {
                    // If there are no occurrences of the chosen operation left, we exit the while loop.
                    operationsFlag = false;
                }
            }

            return inputToEvaluate;
        }


    }
}