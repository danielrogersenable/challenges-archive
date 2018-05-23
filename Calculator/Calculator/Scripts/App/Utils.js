var App;
(function (App) {
    App.viewModel = null;
    function setViewModel(newViewModel) {
        if (newViewModel) {
            App.viewModel = newViewModel;
            ko.applyBindings(newViewModel);
        }
    }
    App.setViewModel = setViewModel;
})(App || (App = {}));
//# sourceMappingURL=Utils.js.map