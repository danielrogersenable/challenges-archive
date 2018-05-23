module App {

    export enum TermTypes {
        Number,
        Operation,
        OpenBracket,
        CloseBracket,
        Function
    }

    export var AllowedFunctions = [
        'sin',
        'cos',
        'tan',
        'e'
    ];
        
    export class EquationComponent {
        constructor(equationTerm: string, termType: TermTypes) {
            this.equationTerm = equationTerm;
            this.termType = termType;
        }

        equationTerm: string;
        termType: TermTypes;
    }

    export class ParsedEquation {
        // A parsed equation splits an inputted equation into an array of components.
        // Each component in the array corresponds to a part of the equation (such as a number or an operation).


        constructor(parsedEquation: EquationComponent[]) {
            this.parsedEquation = parsedEquation;
        }

        parsedEquation: EquationComponent[];
        recentType: TermTypes;

        addNewEquationComponent(equationComponent: EquationComponent) {
            this.parsedEquation.push(equationComponent);
            this.recentType = equationComponent.termType;
        }

        appendRecent(char: string) {
            if ((this.recentType === TermTypes.Number) || (this.recentType === TermTypes.Function)) {
                let lastEntryIndex = this.parsedEquation.length - 1;
                let lastEntry = this.parsedEquation[lastEntryIndex];
                this.parsedEquation[lastEntryIndex].equationTerm = lastEntry.equationTerm.concat(char);
            }
        }

        operationExists(operation: string) {
            let output = -1;
            for (var equationComponent of this.parsedEquation) {
                if (
                    (equationComponent.termType == TermTypes.Operation) &&
                    (equationComponent.equationTerm == operation)
                ) {
                    output = this.parsedEquation.indexOf(equationComponent);
                    break;
                }
            }
            return output;
        }

        locateFunction() {
            let output = -1;
            for (var equationComponent of this.parsedEquation) {
                if (equationComponent.termType === TermTypes.Function) {
                    output = this.parsedEquation.indexOf(equationComponent);
                    break;
                }
            }
            return output;
        }

        locateBracketPair() {
            // Finds the first pair of "non-nested" brackets:
            // (i.e. the first pair of brackets where there are no other brackets between the opening and closing bracket)
            // e.g. in the expression (2*(3+4)), the brackets around 3+4 are the only pair of non-nested brackets.
            let openBracketIndex = -1;
            let closeBracketIndex = -1;
            for (var equationComponent of this.parsedEquation) {
                if (equationComponent.termType === TermTypes.OpenBracket) {
                    openBracketIndex = this.parsedEquation.indexOf(equationComponent);
                }
                else if (
                    (equationComponent.termType === TermTypes.CloseBracket) &&
                    (openBracketIndex !== -1) // Checks that a preceding open bracket has been found
                ){
                    closeBracketIndex = this.parsedEquation.indexOf(equationComponent);
                    break;
                }
            }

            return [openBracketIndex, closeBracketIndex];

        }

        replaceEquationComponent(startingIndex: number, length: number, replacementComponent: EquationComponent) {
            // Replaces the specified components in the parsed equation with a single component (usually the evaluation of this component)
            let tempParsedEquation = this.parsedEquation;

            this.parsedEquation = [];

            // Keep everything before the components to be replaced
            if (startingIndex > 0) {
                this.parsedEquation = tempParsedEquation.slice(0, startingIndex);
            }

            // Add replacement component
            this.parsedEquation.push(replacementComponent);


            // Keep everything after the components to be replaced
            let remainingComponentsIndex = startingIndex + length;
            this.parsedEquation = this.parsedEquation.concat(tempParsedEquation.slice(remainingComponentsIndex));

        }
    }



}