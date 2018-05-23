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
    var EditViewModel = (function (_super) {
        __extends(EditViewModel, _super);
        function EditViewModel(id) {
            var _this = _super.call(this) || this;
            _this.contact = ko.observable();
            _this.isEditing = ko.observable();
            _this.pageTitle = ko.computed(function () {
                if (_this.isEditing()) {
                    return 'Edit user';
                }
                else {
                    return 'Add user';
                }
            });
            if (id === 0) {
                _this.contactId = -1;
                _this.isEditing(false);
                _this.contact(new App.Contact({
                    Id: _this.contactId,
                    FirstName: '',
                    Surname: '',
                    PhoneNumber: ''
                }));
            }
            else {
                _this.contactId = Number(contactId);
                _this.isEditing(true);
                _this.loadContact();
            }
            return _this;
        }
        EditViewModel.prototype.loadContact = function () {
            var _this = this;
            $.ajax({
                url: '../../api/Contacts/GetContact/' + this.contactId,
                type: 'GET'
            }).done(function (data) {
                _this.contact(new App.Contact(data));
            }).fail(function () {
                console.log("No contact found");
                _this.isEditing(false);
                var newContact = new App.Contact({
                    Id: _this.contactId,
                    FirstName: '',
                    Surname: '',
                    PhoneNumber: ''
                });
                _this.contact(newContact);
            });
        };
        EditViewModel.prototype.saveContact = function () {
            $.ajax({
                url: '../../api/Contacts/PutContact/' + this.contactId,
                type: 'PUT',
                data: ko.toJSON(this.contact),
                contentType: "application/json;charset=utf-8",
                dataType: "json"
            }).done(function () {
                window.location.href = "/";
            });
        };
        EditViewModel.prototype.addContact = function () {
            $.ajax({
                url: '../../api/Contacts/PostContact',
                type: 'POST',
                data: ko.toJSON(this.contact),
                contentType: "application/json;charset=utf-8",
                dataType: "json"
            }).done(function () {
                window.location.href = "/";
            });
        };
        EditViewModel.prototype.deleteContact = function () {
            $.ajax({
                url: '../../api/Contacts/DeleteContact/' + this.contactId,
                type: 'DELETE',
            }).done(function () {
                window.location.href = "/";
            });
        };
        EditViewModel.prototype.returnContact = function () {
            window.location.href = "/";
        };
        return EditViewModel;
    }(App.BaseViewModel));
    var viewModel = new EditViewModel(contactId);
    App.setViewModel(viewModel);
})(App || (App = {}));
//# sourceMappingURL=Edit.js.map