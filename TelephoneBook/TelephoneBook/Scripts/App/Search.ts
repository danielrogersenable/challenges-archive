module App {

    export enum SortFields {
        FirstName,
        Surname,
        PhoneNumber
    }

    export interface IPagingModel {
        PageLength: number;
        PageNumber: number;
        SortField?: SortFields;
        Ascending?: boolean;
        SearchTerm?: string;
    }

    export class PagingModel {
        public pageLength = ko.observable<number>();
        public pageNumber = ko.observable<number>();
        public sortField = ko.observable<SortFields>(SortFields.Surname);
        public ascending = ko.observable<boolean>(true);
        public searchTerm = ko.observable<string>();
        constructor(searchmodel: IPagingModel) {
            this.pageLength(searchmodel.PageLength);
            this.pageNumber(searchmodel.PageNumber);
            this.sortField(searchmodel.SortField);
            this.ascending(searchmodel.Ascending);
            this.searchTerm(searchmodel.SearchTerm);
        }

    }

    export interface IPageResult<T> {
        Items: T[];
        TotalCount: number;
        SearchCount: number;
    }

    export class PageResult<T> {

        constructor(pageResult: IPageResult<T>) {
            this.items = pageResult.Items;
            this.totalCount = pageResult.TotalCount;
            this.searchCount = pageResult.SearchCount;
        }

        public items: T[];
        public totalCount: number;
        public searchCount: number;
    }



}