namespace TelephoneBook.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using TelephoneBook.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<TelephoneBook.Models.AppDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(TelephoneBook.Models.AppDbContext context)
        {
            context.Contacts.AddOrUpdate(i => i.Id,

                new Contact
                {
                    Id = 1,
                    FirstName = "Jeffrey",
                    Surname = "Winger",
                    PhoneNumber = "01865 895774"

                },

                new Contact
                {
                    Id = 2,
                    FirstName = "Annie",
                    Surname = "Edison",
                    PhoneNumber = "01865 785225"

                },

               new Contact
               {
                   Id = 3,
                   FirstName = "Troy",
                   Surname = "Barnes",
                   PhoneNumber = "01865 447589"

               },

               new Contact
               {
                   Id = 4,
                   FirstName = "Abed",
                   Surname = "Nadir",
                   PhoneNumber = "01865 996332"

               },

               new Contact
               {
                   Id = 5,
                   FirstName = "Britta",
                   Surname = "Perry",
                   PhoneNumber = "01865 114584"

               },

               new Contact
               {
                   Id = 6,
                   FirstName = "Shirley",
                   Surname = "Bennett",
                   PhoneNumber = "01865 110201"

               },


               new Contact
               {
                   Id = 7,
                   FirstName = "Craig",
                   Surname = "Pelton",
                   PhoneNumber = "01491 419856"

               },

               new Contact
               {
                   Id = 8,
                   FirstName = "Benjamin",
                   Surname = "Chang",
                   PhoneNumber = "01491 587463"

               },

               new Contact
               {
                   Id = 9,
                   FirstName = "Ian",
                   Surname = "Duncan",
                   PhoneNumber = "01491 753652"

               },


               new Contact
               {
                   Id = 10,
                   FirstName = "Sean",
                   Surname = "Garrity",
                   PhoneNumber = "01491 985884"

               },


               new Contact
               {
                   Id = 11,
                   FirstName = "Michelle",
                   Surname = "Slater",
                   PhoneNumber = "01491 748744"

               },


               new Contact
               {
                   Id = 12,
                   FirstName = "Alex",
                   Surname = "Osbourne",
                   PhoneNumber = "01235 536254"

               },


               new Contact
               {
                   Id = 13,
                   FirstName = "Leonard",
                   Surname = "Rodriguez",
                   PhoneNumber = "01235 741025"

               },


               new Contact
               {
                   Id = 14,
                   FirstName = "Vaughn",
                   Surname = "Miller",
                   PhoneNumber = "01235 698810"

               },


               new Contact
               {
                   Id = 15,
                   FirstName = "Rich",
                   Surname = "Stephenson",
                   PhoneNumber = "01235 714258"

               },


               new Contact
               {
                   Id = 16,
                   FirstName = "Todd",
                   Surname = "Jacobson",
                   PhoneNumber = "01235 985421"

               },


               new Contact
               {
                   Id = 17,
                   FirstName = "Sub",
                   Surname = "Way",
                   PhoneNumber = "01235 701215"

               },


               new Contact
               {
                   Id = 18,
                   FirstName = "Marshall",
                   Surname = "Kane",
                   PhoneNumber = "01491 852145"

               },


               new Contact
               {
                   Id = 19,
                   FirstName = "Buzz",
                   Surname = "Hickey",
                   PhoneNumber = "01491 877584"

               },


               new Contact
               {
                   Id = 20,
                   FirstName = "Frankie",
                   Surname = "Dart",
                   PhoneNumber = "01491 201354"

               },


               new Contact
               {
                   Id = 21,
                   FirstName = "June",
                   Surname = "Bauer",
                   PhoneNumber = "01491 874332"

               },


               new Contact
               {
                   Id = 22,
                   FirstName = "Robert",
                   Surname = "Laybourne",
                   PhoneNumber = "01491 852525"

               },


                new Contact
                {
                    Id = 23,
                    FirstName = "Pierce",
                    Surname = "Hawthorne",
                    PhoneNumber = "01189 744885"

                }

            );



        }
    }
}
