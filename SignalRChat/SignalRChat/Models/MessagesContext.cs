using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalRChat.Models
{
    public class MessagesContext : DbContext
    {
        public MessagesContext(): base("MessagesContext")
        {
        }

        public DbSet<Message> Messages { get; set; }
        
    }
}
