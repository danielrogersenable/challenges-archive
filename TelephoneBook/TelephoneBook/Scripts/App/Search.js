var App;
(function (App) {
    var SortFields;
    (function (SortFields) {
        SortFields[SortFields["FirstName"] = 0] = "FirstName";
        SortFields[SortFields["Surname"] = 1] = "Surname";
        SortFields[SortFields["PhoneNumber"] = 2] = "PhoneNumber";
    })(SortFields = App.SortFields || (App.SortFields = {}));
    var PagingModel = (function () {
        function PagingModel(searchmodel) {
            this.pageLength = ko.observable();
            this.pageNumber = ko.observable();
            this.sortField = ko.observable(SortFields.Surname);
            this.ascending = ko.observable(true);
            this.searchTerm = ko.observable();
            this.pageLength(searchmodel.PageLength);
            this.pageNumber(searchmodel.PageNumber);
            this.sortField(searchmodel.SortField);
            this.ascending(searchmodel.Ascending);
            this.searchTerm(searchmodel.SearchTerm);
        }
        return PagingModel;
    }());
    App.PagingModel = PagingModel;
    var PageResult = (function () {
        function PageResult(pageResult) {
            this.items = pageResult.Items;
            this.totalCount = pageResult.TotalCount;
            this.searchCount = pageResult.SearchCount;
        }
        return PageResult;
    }());
    App.PageResult = PageResult;
})(App || (App = {}));
//# sourceMappingURL=Search.js.map