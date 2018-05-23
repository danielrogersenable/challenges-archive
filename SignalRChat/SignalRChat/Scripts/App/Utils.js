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
    // Binding handler from XL Farmcare (and probably other Enable projects)
    ko.bindingHandlers["fadeVisible"] = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $element = $(element);
            var visible = !!ko.utils.unwrapObservable(valueAccessor());
            $element.toggle(visible);
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $element = $(element);
            var visible = !!ko.utils.unwrapObservable(valueAccessor());
            if (visible) {
                $element
                    .stop(true, false)
                    .fadeIn(50);
            }
            else {
                $element
                    .stop(true, false)
                    .fadeOut(0);
            }
        }
    };
    // https://stackoverflow.com/a/19557083/7961950
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
    // https://stackoverflow.com/a/23096322/7961950
    ko.bindingHandlers.enterkey = {
        init: function (element, valueAccessor, allBindings, viewModel) {
            var callback = valueAccessor();
            $(element).keypress(function (event) {
                var keyCode = (event.which ? event.which : event.keyCode);
                if (keyCode === 13) {
                    callback.call(viewModel);
                    return false;
                }
                return true;
            });
        }
    };
})(App || (App = {}));
//# sourceMappingURL=Utils.js.map