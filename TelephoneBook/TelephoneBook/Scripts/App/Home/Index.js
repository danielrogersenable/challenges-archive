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
var App;
(function (App) {
    var IndexViewModel = (function (_super) {
        __extends(IndexViewModel, _super);
        function IndexViewModel() {
            var _this = _super.call(this) || this;
            _this.contactsList = ko.observableArray();
            _this.selectedContact = ko.observable();
            _this.pagingModel = ko.observable();
            _this.viewingAll = ko.observable(false);
            _this.totalCount = ko.observable();
            _this.searchCount = ko.observable();
            _this.isLoading = ko.observable(false);
            _this.pages = ko.observable(0);
            //pages = ko.computed(() => {
            //    if ((this.count()) && this.pagingModel()) {
            //        return Math.ceil(this.count() / this.pagingModel().pageLength());
            //    }
            //    else {
            //        return 0;
            //    }
            //});
            _this.canPageUp = ko.pureComputed(function () {
                if (_this.pagingModel() && _this.pages()) {
                    return _this.pagingModel().pageNumber() < _this.pages();
                }
                else {
                    return false;
                }
            });
            _this.canPageDown = ko.pureComputed(function () {
                if (_this.pagingModel() && _this.pages()) {
                    return _this.pagingModel().pageNumber() > 1;
                }
                else {
                    return false;
                }
            });
            _this.isSinglePage = ko.computed(function () {
                if (!(_this.viewingAll()) && (_this.pages()) && (_this.pages() === 1) && (_this.pagingModel()) && (_this.pagingModel().searchTerm() === '')) {
                    return true;
                }
                else {
                    return false;
                }
            });
            _this.displayMethodLabel = ko.pureComputed(function () {
                if (_this.viewingAll()) {
                    if (_this.searchCount() < _this.totalCount()) {
                        return 'Stop viewing all filtered contacts';
                    }
                    else {
                        return 'Stop viewing all contacts';
                    }
                }
                else if (_this.searchCount() < _this.totalCount()) {
                    return "View all " + _this.searchCount() + " filtered contacts";
                }
                else {
                    return 'View all ' + _this.totalCount() + ' contacts';
                }
            });
            //this.loadContacts();
            //let pageLength: number;
            //if (sessionStorage.pageLength) {
            //    pageLength = sessionStorage.pageLength;
            //}
            //else {
            //    pageLength = 15;
            //    sessionStorage.pageLength = pageLength;
            //}
            _this.pagingModel(new App.PagingModel({
                PageLength: sessionStorage.pageLength ? sessionStorage.pageLength : 15,
                PageNumber: 1,
                SortField: sessionStorage.sortField ? sessionStorage.sortField : App.SortFields.Surname,
                Ascending: sessionStorage.ascending ? sessionStorage.ascending : true
            }));
            _this.loadSelectedContacts();
            ko.computed(function () {
                var pagingModel = _this.pagingModel.peek();
                // tslint:disable-next-line:no-unused-variable
                var observe = {
                    pageLength: pagingModel.pageLength(),
                    pageNumber: pagingModel.pageNumber(),
                    ascending: pagingModel.ascending()
                };
                _this.loadSelectedContacts();
                sessionStorage.pageLength = _this.pagingModel.peek().pageLength.peek();
                sessionStorage.pageNumber = _this.pagingModel.peek().pageNumber.peek();
                sessionStorage.ascending = _this.pagingModel.peek().ascending.peek();
                sessionStorage.sortField = _this.pagingModel.peek().sortField.peek();
            }).extend({
                rateLimit: {
                    method: "notifyWhenChangesStop",
                    timeout: 200
                }
            });
            //this.pagingModel().pageLength.subscribe(() => {
            //    sessionStorage.pageLength = this.pagingModel().pageLength();
            //    this.viewContacts();
            //});
            //this.pagingModel().pageNumber.subscribe(() => {
            //    this.viewContacts();
            //});
            _this.pagingModel().sortField.subscribe(function () {
                sessionStorage.sortField = _this.pagingModel().sortField();
            });
            return _this;
            //this.pagingModel().ascending.subscribe(() => {
            //    sessionStorage.ascending = this.pagingModel().ascending();
            //    this.viewContacts();
            //});
        }
        IndexViewModel.prototype.updatePageCount = function () {
            this.pages(Math.ceil(this.searchCount.peek() / this.pagingModel.peek().pageLength.peek()));
        };
        IndexViewModel.prototype.nextPage = function () {
            if (this.canPageUp.peek()) {
                var pageNumber = this.pagingModel().pageNumber();
                this.pagingModel().pageNumber(pageNumber + 1);
                //this.loadSelectedContacts();
            }
        };
        IndexViewModel.prototype.previousPage = function () {
            if (this.canPageDown.peek()) {
                var pageNumber = this.pagingModel().pageNumber();
                this.pagingModel().pageNumber(pageNumber - 1);
                //this.loadSelectedContacts();
            }
        };
        IndexViewModel.prototype.changeDisplayMethod = function () {
            var temp = this.viewingAll();
            this.viewingAll(!temp);
            if ((this.viewingAll() === true) && (this.searchCount() > 500)) {
                if (confirm('You are about to view ' + this.searchCount() + ' records on a single page, which may cause your browser to run slowly. Please confirm that you would like to do this') === true) {
                    this.viewContacts();
                }
                else {
                    this.viewingAll(false);
                }
            }
            this.viewContacts();
        };
        IndexViewModel.prototype.sortFirstName = function () {
            this.pagingModel().sortField(App.SortFields.FirstName);
            var tempAscending = this.pagingModel().ascending();
            this.pagingModel().ascending(!tempAscending);
        };
        IndexViewModel.prototype.sortSurname = function () {
            this.pagingModel().sortField(App.SortFields.Surname);
            var tempAscending = this.pagingModel().ascending();
            this.pagingModel().ascending(!tempAscending);
        };
        IndexViewModel.prototype.sortPhoneNumber = function () {
            this.pagingModel().sortField(App.SortFields.PhoneNumber);
            var tempAscending = this.pagingModel().ascending();
            this.pagingModel().ascending(!tempAscending);
        };
        IndexViewModel.prototype.clearSearch = function () {
            this.pagingModel().searchTerm('');
            this.pagingModel().pageNumber(1);
            this.viewContacts();
        };
        IndexViewModel.prototype.searchContacts = function () {
            this.pagingModel().pageNumber(1);
            this.viewContacts();
        };
        IndexViewModel.prototype.viewContacts = function () {
            if (this.viewingAll()) {
                this.loadContacts();
            }
            else {
                this.loadSelectedContacts();
            }
        };
        IndexViewModel.prototype.loadContacts = function () {
            var _this = this;
            this.contactsList([]);
            this.isLoading(true);
            var allPagingModel = new App.PagingModel({
                PageLength: 0,
                PageNumber: 1,
                SortField: this.pagingModel().sortField(),
                Ascending: this.pagingModel().ascending(),
                SearchTerm: this.pagingModel().searchTerm()
            });
            $.ajax({
                url: '../../api/Contacts/GetSelectedContacts',
                type: 'PUT',
                data: ko.toJSON(allPagingModel),
                contentType: "application/json;charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                var items = data.Items;
                _this.totalCount(data.TotalCount);
                _this.searchCount(data.SearchCount);
                _this.updatePageCount();
                for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                    var contact = items_1[_i];
                    _this.contactsList.push(new App.Contact(contact));
                }
            }).always(function () {
                _this.isLoading(false);
            });
        };
        IndexViewModel.prototype.validatePagingModel = function () {
            this.updatePageCount();
            if (this.pagingModel().pageLength() < 1) {
                this.pagingModel().pageLength(1);
            }
            else if (this.pagingModel().pageLength() % 1 !== 0) {
                this.pagingModel().pageLength(Math.floor(this.pagingModel().pageLength()));
            }
            if (this.pagingModel().pageNumber() < 1) {
                this.pagingModel().pageNumber(1);
            }
            else if ((this.pages()) && (this.pagingModel().pageNumber() > this.pages())) {
                this.pagingModel().pageNumber(this.pages());
            }
            else if (this.pagingModel().pageNumber() % 1 !== 0) {
                this.pagingModel().pageNumber(Math.floor(this.pagingModel().pageNumber()));
            }
            sessionStorage.pageLength = this.pagingModel().pageLength();
        };
        IndexViewModel.prototype.loadSelectedContacts = function () {
            var _this = this;
            if (this.isLoading.peek()) {
                return;
            }
            this.isLoading(true);
            //if (this.searchCount.peek()) {
            //    this.validatePagingModel(); // Model isn't validated at startup when no count has been determined yet.
            //}
            this.contactsList([]);
            //this.pagingModel().searchTerm($.trim(this.pagingModel().searchTerm()));
            $.ajax({
                url: '../../api/Contacts/GetSelectedContacts',
                type: 'PUT',
                data: ko.toJSON({
                    pageLength: this.pagingModel.peek().pageLength.peek(),
                    pageNumber: this.pagingModel.peek().pageNumber.peek(),
                    searchTerm: this.pagingModel.peek().searchTerm.peek(),
                    ascending: this.pagingModel.peek().ascending.peek(),
                    sortField: this.pagingModel.peek().sortField.peek()
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                var items = data.Items;
                _this.totalCount(data.TotalCount);
                _this.searchCount(data.SearchCount);
                _this.updatePageCount();
                for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
                    var contact = items_2[_i];
                    _this.contactsList.push(new App.Contact(contact));
                }
            }).always(function () {
                _this.isLoading(false);
            });
        };
        return IndexViewModel;
    }(App.BaseViewModel));
    var viewModel = new IndexViewModel();
    App.setViewModel(viewModel);
})(App || (App = {}));
//# sourceMappingURL=Index.js.map