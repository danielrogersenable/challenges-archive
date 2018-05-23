module App {

    class IndexViewModel extends BaseViewModel {
        constructor() {
            super();
            //this.loadContacts();


            //let pageLength: number;
            //if (sessionStorage.pageLength) {
            //    pageLength = sessionStorage.pageLength;
            //}
            //else {
            //    pageLength = 15;
            //    sessionStorage.pageLength = pageLength;
            //}

            this.pagingModel(new PagingModel({
                PageLength: sessionStorage.pageLength ? sessionStorage.pageLength : 15,
                PageNumber: 1,
                SortField: sessionStorage.sortField ? sessionStorage.sortField : SortFields.Surname,
                Ascending: sessionStorage.ascending ? sessionStorage.ascending : true
            }));

            this.loadSelectedContacts();

            ko.computed(() => {
                const pagingModel = this.pagingModel.peek();
                // tslint:disable-next-line:no-unused-variable
                const observe = {
                    pageLength: pagingModel.pageLength(),
                    pageNumber: pagingModel.pageNumber(),
                    ascending: pagingModel.ascending()
                };
                this.loadSelectedContacts();
                sessionStorage.pageLength = this.pagingModel.peek().pageLength.peek();
                sessionStorage.pageNumber = this.pagingModel.peek().pageNumber.peek();
                sessionStorage.ascending = this.pagingModel.peek().ascending.peek();
                sessionStorage.sortField = this.pagingModel.peek().sortField.peek();
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

            this.pagingModel().sortField.subscribe(() => {
                sessionStorage.sortField = this.pagingModel().sortField();
            });

            //this.pagingModel().ascending.subscribe(() => {
            //    sessionStorage.ascending = this.pagingModel().ascending();
            //    this.viewContacts();
            //});
        }

        contactsList = ko.observableArray<Contact>();
        selectedContact = ko.observable<Contact>();
        pagingModel = ko.observable<PagingModel>();
        viewingAll = ko.observable<boolean>(false);
        totalCount = ko.observable<number>();
        searchCount = ko.observable<number>();
        isLoading = ko.observable<boolean>(false);

        pages = ko.observable<number>(0);

        updatePageCount() {
            this.pages(Math.ceil(this.searchCount.peek() / this.pagingModel.peek().pageLength.peek()));
        }

        //pages = ko.computed(() => {
        //    if ((this.count()) && this.pagingModel()) {
        //        return Math.ceil(this.count() / this.pagingModel().pageLength());
        //    }
        //    else {
        //        return 0;
        //    }
        //});

        canPageUp = ko.pureComputed(() => {
            if (this.pagingModel() && this.pages()) {
                return this.pagingModel().pageNumber() < this.pages();
            }
            else {
                return false;
            }
        });


        canPageDown = ko.pureComputed(() => {
            if (this.pagingModel() && this.pages()) {
                return this.pagingModel().pageNumber() > 1;
            }
            else {
                return false;
            }
        });

        nextPage() {
            if (this.canPageUp.peek()) {
                const pageNumber = this.pagingModel().pageNumber();
                this.pagingModel().pageNumber(pageNumber + 1);
                //this.loadSelectedContacts();
            }
        }

        previousPage() {
            if (this.canPageDown.peek()) {
                const pageNumber = this.pagingModel().pageNumber();
                this.pagingModel().pageNumber(pageNumber - 1);
                //this.loadSelectedContacts();
            }
        }

        isSinglePage = ko.computed(() => {
            if (!(this.viewingAll()) && (this.pages()) && (this.pages() === 1) && (this.pagingModel()) && (this.pagingModel().searchTerm() === '')) {
                return true;
            }
            else {
                return false;
            }
        })

        changeDisplayMethod() {
            const temp = this.viewingAll();
            this.viewingAll(!temp);
            if ((this.viewingAll() === true) && (this.searchCount() > 500)) {
                if (confirm('You are about to view ' + this.searchCount() + ' records on a single page, which may cause your browser to run slowly. Please confirm that you would like to do this') === true) {
                    this.viewContacts()
                }
                else {
                    this.viewingAll(false);
                }
            }
            this.viewContacts();
        }


        displayMethodLabel = ko.pureComputed(() => {
            if (this.viewingAll()) {
                if (this.searchCount() < this.totalCount()) {
                    return 'Stop viewing all filtered contacts'
                }
                else {
                    return 'Stop viewing all contacts';
                }
            }
            else if (this.searchCount() < this.totalCount()) {
                return `View all ${this.searchCount()} filtered contacts`;
            }
            else {
                return 'View all ' + this.totalCount() + ' contacts';
            }

        })


        sortFirstName() {
            this.pagingModel().sortField(SortFields.FirstName);
            let tempAscending = this.pagingModel().ascending();
            this.pagingModel().ascending(!tempAscending);
        }

        sortSurname() {
            this.pagingModel().sortField(SortFields.Surname);
            let tempAscending = this.pagingModel().ascending();
            this.pagingModel().ascending(!tempAscending);
        }

        sortPhoneNumber() {
            this.pagingModel().sortField(SortFields.PhoneNumber);
            let tempAscending = this.pagingModel().ascending();
            this.pagingModel().ascending(!tempAscending);
        }

        clearSearch() {
            this.pagingModel().searchTerm('');
            this.pagingModel().pageNumber(1);
            this.viewContacts();
        }

        searchContacts() {
            this.pagingModel().pageNumber(1);
            this.viewContacts();
        }


        viewContacts() {
            if (this.viewingAll()) {
                this.loadContacts();
            }
            else {
                this.loadSelectedContacts();
            }

        }


        loadContacts() {
            this.contactsList([]);
            this.isLoading(true);
            let allPagingModel = new PagingModel({
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
            }).done((data: IPageResult<IContact>) => {
                const items = data.Items;
                this.totalCount(data.TotalCount);
                this.searchCount(data.SearchCount);
                this.updatePageCount();

                for (var contact of items) {
                    this.contactsList.push(new Contact(contact));
                }
            }).always(() => {
                this.isLoading(false);
            });
        }

        validatePagingModel() {
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
        }


        loadSelectedContacts() {

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
            }).done((data: IPageResult<IContact>) => {
                const items = data.Items;
                this.totalCount(data.TotalCount);
                this.searchCount(data.SearchCount);
                this.updatePageCount();

                for (var contact of items) {
                    this.contactsList.push(new Contact(contact));
                }
            }).always(() => {
                this.isLoading(false);
            });
        }



    }
    var viewModel = new IndexViewModel();
    App.setViewModel(viewModel);
}