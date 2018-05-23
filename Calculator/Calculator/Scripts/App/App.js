var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var App;
(function (App) {
    var ViewModel = (function (_super) {
        __extends(ViewModel, _super);
        function ViewModel() {
            var _this = _super.call(this) || this;
            _this.calculator = ko.observable();
            _this.tutorialVisible = ko.observable();
            _this.tutorialVisible(false);
            _this.calculator(new App.Calculator(""));
            // Remove this to stop tests running.
            _this.tests = new App.CalculatorTest();
            return _this;
        }
        ViewModel.prototype.showTutorial = function () {
            var visible = this.tutorialVisible();
            this.tutorialVisible(!visible);
        };
        ViewModel.prototype.stressTest = function (length, brackets, bracketOpenFrequency, bracketCloseFrequency) {
            if (brackets === void 0) { brackets = true; }
            if (bracketOpenFrequency === void 0) { bracketOpenFrequency = 0.25; }
            if (bracketCloseFrequency === void 0) { bracketCloseFrequency = 0.25; }
            this.tests.stressTest(length, brackets, bracketOpenFrequency, bracketCloseFrequency);
        };
        ViewModel.prototype.frontEndStressTest = function (length, brackets, bracketOpenFrequency, bracketCloseFrequency) {
            if (brackets === void 0) { brackets = true; }
            if (bracketOpenFrequency === void 0) { bracketOpenFrequency = 0.25; }
            if (bracketCloseFrequency === void 0) { bracketCloseFrequency = 0.25; }
            this.calculator().calcInput(this.tests.randomEquation(length, brackets, bracketOpenFrequency, bracketCloseFrequency));
            console.log('Starting front-end stress test');
            var t0 = performance.now();
            this.calculator().calculate();
            var t1 = performance.now();
            console.log('Stress test complete in ' + (t1 - t0) / 1000 + ' seconds');
        };
        return ViewModel;
    }(App.BaseViewModel));
    var viewModel = new ViewModel();
    App.setViewModel(viewModel);
})(App || (App = {}));
//# sourceMappingURL=App.js.map