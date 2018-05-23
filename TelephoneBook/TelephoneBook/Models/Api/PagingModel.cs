using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TelephoneBook.Models.Api
{
    public enum SortField
    {
        FirstName,
        Surname,
        PhoneNumber

    }
    public class PagingModel
    {
        public int PageLength { get; set; }
        public int PageNumber { get; set; }
        public SortField SortField { get; set; }
        public bool Ascending { get; set; }
        public string SearchTerm { get; set; }
    }
}