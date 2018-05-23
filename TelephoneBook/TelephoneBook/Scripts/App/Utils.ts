module App {
    export var viewModel: BaseViewModel = null;

    export function setViewModel(newViewModel: BaseViewModel) {
        if (newViewModel) {
            viewModel = newViewModel;
            ko.applyBindings(newViewModel);
        }
    }
    // Binding handler from https://stackoverflow.com/a/23096322/7961950
    ko.bindingHandlers.executeOnEnter = {
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

    // Binding handler from XL Farmcare (and probably other Enable projects)
    ko.bindingHandlers["fadeVisible"] = {
        init: function (
            element: any,
            valueAccessor: () => any,
            allBindingsAccessor: KnockoutAllBindingsAccessor,
            viewModel: any,
            bindingContext: KnockoutBindingContext) {
            const $element = $(element);
            const visible = !!ko.utils.unwrapObservable(valueAccessor());

            $element.toggle(visible);
        },
        update: function (
            element: any,
            valueAccessor: () => any,
            allBindingsAccessor: KnockoutAllBindingsAccessor,
            viewModel: any,
            bindingContext: KnockoutBindingContext) {
            const $element = $(element);
            const visible = !!ko.utils.unwrapObservable(valueAccessor());

            if (visible) {
                $element
                    .stop(true, false)
                    .fadeIn(50);
            } else {
                $element
                    .stop(true, false)
                    .fadeOut(0);
            }
        }
    };

}