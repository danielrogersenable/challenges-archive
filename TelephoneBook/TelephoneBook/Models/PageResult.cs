using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TelephoneBook.Models
{
    public class PageResult<T>
    {
        public T[] Items { get; set; }
        public int TotalCount { get; set; }
        public int SearchCount { get; set; }
    }
}