using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TelephoneBook.Models
{
    public class Contact
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(20)]
        [Display(Name ="First name")]
        public string FirstName { get; set; }
        [Required]
        [MaxLength(20)]
        public string Surname { get; set; }
        [Required]
        [MaxLength(20)]
        [Display(Name = "Telephone number")]
        public string PhoneNumber { get; set; }
    }
}
