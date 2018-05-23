using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using TelephoneBook.Models;

namespace TelephoneBook.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(): base("AppDbContext")
        {
        }

        public DbSet<Contact> Contacts { get; set; }
        
    }
}
