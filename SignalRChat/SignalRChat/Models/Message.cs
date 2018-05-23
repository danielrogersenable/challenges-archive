using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalRChat.Models
{
    public class Message
    {
        public int MessageId { get; set; }
        public string Username { get; set; }
        public string Content { get; set; }
        public DateTimeOffset TimeSubmitted { get; set; }
    }
}
