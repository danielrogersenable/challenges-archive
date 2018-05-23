module App {

    export interface IContact {
        Id: number;
        FirstName: string;
        Surname: string;
        PhoneNumber: string;
    }

    export class Contact {

        public id: number;
        public firstName: string;
        public surname: string;
        public phoneNumber: string;

        constructor(contact: IContact) {
            this.id = contact.Id;
            this.firstName = contact.FirstName;
            this.surname = contact.Surname;
            this.phoneNumber = contact.PhoneNumber;
        }

        editContactEnter(data: Contact, keyStroke) {
            if (keyStroke.keyCode === 13) {
                this.editContact(data);
            }
        }

        editContact(contact: Contact) {
            const url = '/Home/Edit/' + contact.id;
            window.location.href = url;
        }

    }


}