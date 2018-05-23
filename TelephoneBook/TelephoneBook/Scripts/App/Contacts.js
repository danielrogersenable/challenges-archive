var App;
(function (App) {
    var Contact = (function () {
        function Contact(contact) {
            this.id = contact.Id;
            this.firstName = contact.FirstName;
            this.surname = contact.Surname;
            this.phoneNumber = contact.PhoneNumber;
        }
        Contact.prototype.editContactEnter = function (data, keyStroke) {
            if (keyStroke.keyCode === 13) {
                this.editContact(data);
            }
        };
        Contact.prototype.editContact = function (contact) {
            var url = '/Home/Edit/' + contact.id;
            window.location.href = url;
        };
        return Contact;
    }());
    App.Contact = Contact;
})(App || (App = {}));
//# sourceMappingURL=Contacts.js.map