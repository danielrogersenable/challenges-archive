declare var contactId: number;
module App {

    class EditViewModel extends BaseViewModel {
        constructor(id:number) {
            super();
            if (id === 0) {
                this.contactId = -1;
                this.isEditing(false);
                this.contact(new Contact({
                    Id: this.contactId,
                    FirstName: '',
                    Surname: '',
                    PhoneNumber: ''
                }))
            }
            else {
                this.contactId = Number(contactId);
                this.isEditing(true);
                this.loadContact();
            }
        }

        contactId: number;
        contact = ko.observable<Contact>();
        isEditing = ko.observable<boolean>();

        pageTitle = ko.computed(() => {
            if (this.isEditing()) {
                return 'Edit user';
            }
            else {
                return 'Add user';
            }
        })

        loadContact() {
            $.ajax({
                url: '../../api/Contacts/GetContact/' + this.contactId,
                type: 'GET'
            }).done((data: IContact) => {
                this.contact(new Contact(data));
            }).fail(() => {
                console.log("No contact found");
                this.isEditing(false);
                var newContact = new Contact({
                    Id: this.contactId,
                    FirstName: '',
                    Surname: '',
                    PhoneNumber: ''
                })
                this.contact(newContact);
            });
        }

        saveContact() {
            $.ajax({
                url: '../../api/Contacts/PutContact/' + this.contactId,
                type: 'PUT',
                data: ko.toJSON(this.contact),
                contentType: "application/json;charset=utf-8",
                dataType: "json"
            }).done(() => {
                window.location.href = "/";
            });
        }

        addContact() {
            $.ajax({
                url: '../../api/Contacts/PostContact',
                type: 'POST',
                data: ko.toJSON(this.contact),
                contentType: "application/json;charset=utf-8",
                dataType: "json"
            }).done(() => {
                window.location.href = "/";
            });
        }

        deleteContact() {
            $.ajax({
                url: '../../api/Contacts/DeleteContact/' + this.contactId,
                type: 'DELETE',
            }).done(() => {
                window.location.href = "/";
            });

        }

        returnContact() {
            window.location.href = "/";
        }

    }


    var viewModel = new EditViewModel(contactId);
    App.setViewModel(viewModel);
}