ko.bindingHandlers.slideIn = {
    init: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).toggle(value);
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        value ? $(element).slideDown() : $(element).slideUp();
    }
};

module App {

    class ViewModel extends BaseViewModel {
        constructor() {
            super();
            this.tutorialVisible(false);
            this.calculator(new Calculator(""));

            // Remove this to stop tests running.
            this.tests = new CalculatorTest();

        }

        calculator = ko.observable<Calculator>();
        tutorialVisible = ko.observable<boolean>();
        tests: CalculatorTest;

        showTutorial() {
            let visible = this.tutorialVisible();
            this.tutorialVisible(!visible);
        }

        stressTest(length: number, brackets = true, bracketOpenFrequency = 0.25, bracketCloseFrequency = 0.25) {
            this.tests.stressTest(length, brackets, bracketOpenFrequency, bracketCloseFrequency);

        }

        frontEndStressTest(length: number, brackets = true, bracketOpenFrequency = 0.25, bracketCloseFrequency = 0.25) {
            this.calculator().calcInput(this.tests.randomEquation(length, brackets, bracketOpenFrequency, bracketCloseFrequency));
            console.log('Starting front-end stress test');
            let t0 = performance.now();
            this.calculator().calculate();
            let t1 = performance.now();
            console.log('Stress test complete in ' + (t1 - t0) / 1000 + ' seconds');

        }
    }

    var viewModel = new ViewModel();
    App.setViewModel(viewModel);
}