var App;
(function (App) {
    var TermTypes;
    (function (TermTypes) {
        TermTypes[TermTypes["Number"] = 0] = "Number";
        TermTypes[TermTypes["Operation"] = 1] = "Operation";
        TermTypes[TermTypes["OpenBracket"] = 2] = "OpenBracket";
        TermTypes[TermTypes["CloseBracket"] = 3] = "CloseBracket";
        TermTypes[TermTypes["Function"] = 4] = "Function";
    })(TermTypes = App.TermTypes || (App.TermTypes = {}));
    App.AllowedFunctions = [
        'sin',
        'cos',
        'tan',
        'e'
    ];
    var EquationComponent = (function () {
        function EquationComponent(equationTerm, termType) {
            this.equationTerm = equationTerm;
            this.termType = termType;
        }
        return EquationComponent;
    }());
    App.EquationComponent = EquationComponent;
    var ParsedEquation = (function () {
        // A parsed equation splits an inputted equation into an array of components.
        // Each component in the array corresponds to a part of the equation (such as a number or an operation).
        function ParsedEquation(parsedEquation) {
            this.parsedEquation = parsedEquation;
        }
        ParsedEquation.prototype.addNewEquationComponent = function (equationComponent) {
            this.parsedEquation.push(equationComponent);
            this.recentType = equationComponent.termType;
        };
        ParsedEquation.prototype.appendRecent = function (char) {
            if ((this.recentType === TermTypes.Number) || (this.recentType === TermTypes.Function)) {
                var lastEntryIndex = this.parsedEquation.length - 1;
                var lastEntry = this.parsedEquation[lastEntryIndex];
                this.parsedEquation[lastEntryIndex].equationTerm = lastEntry.equationTerm.concat(char);
            }
        };
        ParsedEquation.prototype.operationExists = function (operation) {
            var output = -1;
            for (var _i = 0, _a = this.parsedEquation; _i < _a.length; _i++) {
                var equationComponent = _a[_i];
                if ((equationComponent.termType == TermTypes.Operation) &&
                    (equationComponent.equationTerm == operation)) {
                    output = this.parsedEquation.indexOf(equationComponent);
                    break;
                }
            }
            return output;
        };
        ParsedEquation.prototype.locateFunction = function () {
            var output = -1;
            for (var _i = 0, _a = this.parsedEquation; _i < _a.length; _i++) {
                var equationComponent = _a[_i];
                if (equationComponent.termType === TermTypes.Function) {
                    output = this.parsedEquation.indexOf(equationComponent);
                    break;
                }
            }
            return output;
        };
        ParsedEquation.prototype.locateBracketPair = function () {
            // Finds the first pair of "non-nested" brackets:
            // (i.e. the first pair of brackets where there are no other brackets between the opening and closing bracket)
            // e.g. in the expression (2*(3+4)), the brackets around 3+4 are the only pair of non-nested brackets.
            var openBracketIndex = -1;
            var closeBracketIndex = -1;
            for (var _i = 0, _a = this.parsedEquation; _i < _a.length; _i++) {
                var equationComponent = _a[_i];
                if (equationComponent.termType === TermTypes.OpenBracket) {
                    openBracketIndex = this.parsedEquation.indexOf(equationComponent);
                }
                else if ((equationComponent.termType === TermTypes.CloseBracket) &&
                    (openBracketIndex !== -1) // Checks that a preceding open bracket has been found
                ) {
                    closeBracketIndex = this.parsedEquation.indexOf(equationComponent);
                    break;
                }
            }
            return [openBracketIndex, closeBracketIndex];
        };
        ParsedEquation.prototype.replaceEquationComponent = function (startingIndex, length, replacementComponent) {
            // Replaces the specified components in the parsed equation with a single component (usually the evaluation of this component)
            var tempParsedEquation = this.parsedEquation;
            this.parsedEquation = [];
            // Keep everything before the components to be replaced
            if (startingIndex > 0) {
                this.parsedEquation = tempParsedEquation.slice(0, startingIndex);
            }
            // Add replacement component
            this.parsedEquation.push(replacementComponent);
            // Keep everything after the components to be replaced
            var remainingComponentsIndex = startingIndex + length;
            this.parsedEquation = this.parsedEquation.concat(tempParsedEquation.slice(remainingComponentsIndex));
        };
        return ParsedEquation;
    }());
    App.ParsedEquation = ParsedEquation;
})(App || (App = {}));
//# sourceMappingURL=ParsedEquation.js.map