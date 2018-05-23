﻿module App {

    class TestClass {
        constructor(calcinput: string, success: boolean, expectedoutput?: number) {
            this.calcInput = calcinput;
            this.success = success;
            this.expectedOutput = expectedoutput;
        }
        calcInput: string;
        success: boolean;
        expectedOutput: number;
    }

    export class CalculatorTest {
        constructor() {
            this.calculator(new Calculator(""));

            this.runTests();

        }

        calculator = ko.observable<Calculator>();

        runTests() {
            let testPass = true;
            let failCount = 0;
            let testList = [
                // Single numbers
                new TestClass('1', true, 1),
                new TestClass('+1', true, 1),
                new TestClass('100', true, 100),
                new TestClass('-1', true, -1),
                new TestClass('', true, 0),

                // Addition
                new TestClass('1+1', true, 2),
                new TestClass('1+2', true, 3),

                // Subtraction
                new TestClass('1-1', true, 0),
                new TestClass('7-5', true, 2),
                new TestClass('5-7', true, -2),
                new TestClass('-1 + 1', true, 0),

                // Multiplication
                new TestClass('8*4', true, 32),

                // Division
                new TestClass('21/7', true, 3),
                new TestClass('1/0', false),

                // Handling of white space
                new TestClass('1+2 ', true, 3),
                new TestClass(' 1 + 2 ', true, 3),
                new TestClass('  1+2  ', true, 3),

                // Multiple numbers
                new TestClass('1+2+3', true, 6),

                // Multiple operations
                new TestClass('8+4-5', true, 7),
                new TestClass('8-5+4', true, 7),

                // Decimal points
                new TestClass('1.7 + 9.4', true, 11.1),
                new TestClass('0.9 + 0.09', true, 0.99),
                new TestClass('1.1.1', false),
                new TestClass('1 + .5', true, 1.5),
                new TestClass('.5 + .5', true, 1),
                new TestClass('5. + 6.', true, 11),

                // Operator precedence
                new TestClass('2+3*4', true, 14),
                new TestClass('1/2/3', true, 1 / 6),
                new TestClass('2*3/6', true, 1),
                new TestClass('2/6*3', true, 1),

                // Brackets
                new TestClass('(2)', true, 2),
                new TestClass('(2) + (2)', true, 4),
                new TestClass('(2+3)*4', true, 20),
                new TestClass('()', false),
                new TestClass('2+(-1)', true, 1),
                new TestClass('2-(+1)', true, 1),

                // Invalid characters
                new TestClass('2 + 2!', false),
                new TestClass('2 + 2&', false),
                new TestClass('2 + 2#', false),
                new TestClass('2 + 2?', false),
                new TestClass('2 + 2@', false),
                new TestClass('2 + 2%', false),
                new TestClass('2 + 2$', false),
                new TestClass('two + two', false),

                // Invalid syntax
                new TestClass('2+', false),
                new TestClass('*2 + 1', false),
                new TestClass('2*/4', false),
                new TestClass('2/*4', false),
                new TestClass('(2+2)(', false),
                new TestClass(')(2+2', false),
                new TestClass('2+-', false),
                new TestClass('2-+', false),

                // Exponentiation
                new TestClass('3^4', true, 81),
                new TestClass('(2+3)^2', true, 25),
                new TestClass('(2-4)^3', true, -8),
                new TestClass('3^0', true, 1),
                new TestClass('4^0.5', true, 2),
                new TestClass('(4^3)^2', true, 4096),
                new TestClass('4^(3^2)', true, 262144),
                new TestClass('4^3^2', true, 4096), // Debatable whether this should be 262144, I've opted to evaluate left to right here.
                new TestClass('(-2)^2', true, 4),

                // Functions
                new TestClass('sin(0)', true, 0),
                new TestClass('cos(0)', true, 1),
                new TestClass('tan(0)', true, 0),
                new TestClass('SIN(0)', true, 0),
                new TestClass('COS(0)', true, 1),
                new TestClass('TAN(0)', true, 0),
                new TestClass('-cos(0)', true, -1),
                new TestClass('1 + sin(0)', true, 1),
                new TestClass('sin(1)*sin(2)', true, Math.sin(1)*Math.sin(2)),
                new TestClass('sin(1)^2', true, Math.pow(Math.sin(1),2)),
                new TestClass('cos(sin(0))', true, 1),
                new TestClass('1 + cos(1) + sin(1) + tan(1)', true, 1 + Math.cos(1) + Math.sin(1) + Math.tan(1)),
                new TestClass('e(1)', true, Math.exp(1)),
                new TestClass('E(0)', true, 1),
                new TestClass('e(-1) * e(1)', true, 1),

                // pi
                new TestClass('pi', true, Math.PI),
                new TestClass('sin(pi)', true, Math.sin(Math.PI)),
                new TestClass('cos(pi)', true, Math.cos(Math.PI)),
                new TestClass('tan(pi)', true, Math.tan(Math.PI))
            ];

            console.log('BEGINNING TESTS:');
            for (let test of testList) {
                this.calculator().calcInput(test.calcInput);
                try {
                    this.calculator().calculate();
                } catch (e) {
                    testPass = false;
                    failCount++;
                    console.log('Process errored unexpectedly with input: ' + test.calcInput);
                    continue;
                }
                if (this.calculator().isValid() && !test.success) {
                    testPass = false;
                    failCount++;
                    console.log('Expected: fail, Actual: pass, Input: ' + test.calcInput);
                }
                else if (!(this.calculator().isValid()) && test.success) {
                    testPass = false;
                    failCount++;
                    console.log('Expected: pass, Actual: fail, Input: ' + test.calcInput + ' , Output error message: ' + this.calculator().calcError());
                }
                else if (
                    (this.calculator().isValid() && test.success) &&
                    (this.calculator().calcOutput() !== test.expectedOutput)
                ) {
                    testPass = false;
                    failCount++;
                    console.log('Expected: ' + test.expectedOutput + ', Actual: ' + this.calculator().calcOutput() + ', Input: ' + test.calcInput);
                }

            }
            console.log('ALL TESTS COMPLETED');
            if (testPass) {
                console.log('All tests passed. Successful tests: ' + testList.length);
            }
            else {
                console.log('Failed tests: ' + failCount);
                let successCount = testList.length - failCount;
                console.log('Succcessful tests: ' + successCount);
            }

        }


        randomEquation(length: number, brackets = false, bracketOpenFrequency = 0.25, bracketCloseFrequency = 0.25) {
            let operations = ['+', '-', '*', '/'];
            let output = String(Math.random());
            let bracketCount = 0;
            for (let i = 0; i < length; i++) {
                output = output.concat(operations[Math.floor(Math.random() * operations.length)]);
                if (brackets) {
                    if ((Math.random() < bracketOpenFrequency)) {
                        output = output.concat("(");
                        bracketCount++;
                    }
                }
                output = output.concat(String(Math.random()));
                if (brackets) {
                    if ((bracketCount > 0) && (Math.random() < bracketCloseFrequency)) {
                        output = output.concat(")");
                        bracketCount--;
                    }
                }
            }

            for (let i = 0; i < bracketCount; i++) {
                output = output.concat(")");
            }

            return output;
        }

        stressTest(length: number, brackets = false, bracketOpenFrequency = 0.25, bracketCloseFrequency = 0.25) {
            this.calculator().calcInput(this.randomEquation(length, brackets, bracketOpenFrequency, bracketCloseFrequency));
            console.log('Starting stress test');
            let t0 = performance.now();
            this.calculator().calculate();
            let t1 = performance.now();
            console.log('Stress test complete in ' + (t1 - t0) / 1000 + ' seconds');
        }


    }
}