
module App {
    export var viewModel: BaseViewModel = null;

    export function setViewModel(newViewModel: BaseViewModel) {
        if (newViewModel) {
            viewModel = newViewModel;
            ko.applyBindings(newViewModel);
        }
    }
}