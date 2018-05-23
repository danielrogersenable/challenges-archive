using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using TelephoneBook.Models;
using TelephoneBook.Models.Api;

namespace TelephoneBook.Controllers.Api
{
    public class ContactsController : ApiController
    {
        private AppDbContext db = new AppDbContext();


        [HttpGet]
        // GET: api/Contacts
        public Contact[] GetContacts()
        {
            var query = db.Contacts
                .OrderBy(s => s.Surname)
                .ToArray();
            return query;
        }


        [HttpPut]
        // PUT: api/Contacts
        public PageResult<Contact> GetSelectedContacts(PagingModel pagingModel)
        {
            var totalCount = db.Contacts.Count();

            var query = db.Contacts.AsQueryable();

            if (!string.IsNullOrWhiteSpace(pagingModel.SearchTerm))
            {
                query = query.Where(s => (
               s.FirstName.Contains(pagingModel.SearchTerm) ||
               s.Surname.Contains(pagingModel.SearchTerm) ||
               s.PhoneNumber.Contains(pagingModel.SearchTerm)
               ));
            }

            var searchCount = query.Count();

            switch (pagingModel.SortField)
            {
                case SortField.FirstName:
                    if (pagingModel.Ascending)
                    {
                        query = query.OrderBy(s => s.FirstName);
                    }
                    else
                    {
                        query = query.OrderByDescending(s => s.FirstName);
                    }
                    break;
                case SortField.Surname:
                    if (pagingModel.Ascending)
                    {
                        query = query.OrderBy(s => s.Surname);
                    }
                    else
                    {
                        query = query.OrderByDescending(s => s.Surname);
                    }
                    break;
                case SortField.PhoneNumber:
                    if (pagingModel.Ascending)
                    {
                        query = query.OrderBy(s => s.PhoneNumber);
                    }
                    else
                    {
                        query = query.OrderByDescending(s => s.PhoneNumber);
                    }
                    break;
                default:
                    query = query.OrderBy(s => s.Surname);
                    break;
            }


            query = query.Skip((pagingModel.PageNumber - 1) * pagingModel.PageLength);

            if (pagingModel.PageLength != 0) { 
                query = query.Take(pagingModel.PageLength);
            }


            //query = query.Skip((pagingModel.PageNumber - 1) * pagingModel.PageLength)
            //.Take(pagingModel.PageLength);

            //var query = db.Contacts.OrderBy(s => s.Surname)
            //    .Skip((pagingModel.PageNumber - 1) * pagingModel.PageLength)
            //    .Take(pagingModel.PageLength)
            //    .ToArray();

            var result = new PageResult<Contact>();
            result.Items = query.ToArray();
            result.TotalCount = totalCount;
            result.SearchCount = searchCount;
            return result;
        }

        //[HttpPut]
        //// PUT: api/Contacts
        //public IHttpActionResult PutTest(PagingModel pagingModel)
        //{
        //    var temp = 1;
        //    return StatusCode(HttpStatusCode.NoContent);
        //}



        // GET: api/Contacts/5
        [ResponseType(typeof(Contact))]
        public IHttpActionResult GetContact(int id)
        {
            Contact contact = db.Contacts.Find(id);
            if (contact == null)
            {
                return NotFound();
            }

            return Ok(contact);
        }

        // PUT: api/Contacts/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutContact(Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var dbContact = db.Contacts.Find(contact.Id);
            if (dbContact == null)
            {
                return NotFound();
            }
            dbContact.FirstName = contact.FirstName;
            dbContact.Surname = contact.Surname;
            dbContact.PhoneNumber = contact.PhoneNumber;
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        // POST: api/Contacts
        [ResponseType(typeof(Contact))]
        public IHttpActionResult PostContact(Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Contacts.Add(contact);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = contact.Id }, contact);
        }

        // DELETE: api/Contacts/5
        [ResponseType(typeof(Contact))]
        public IHttpActionResult DeleteContact(int id)
        {
            Contact contact = db.Contacts.Find(id);
            if (contact == null)
            {
                return NotFound();
            }

            db.Contacts.Remove(contact);
            db.SaveChanges();

            return Ok(contact);
        }

        //protected override void Dispose(bool disposing)
        //{
        //    if (disposing)
        //    {
        //        db.Dispose();
        //    }
        //    base.Dispose(disposing);
        //}

        private bool ContactExists(int id)
        {
            return db.Contacts.Count(e => e.Id == id) > 0;
        }
    }
}