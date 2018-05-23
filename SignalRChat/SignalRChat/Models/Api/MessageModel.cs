using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace SignalRChat.Models.Api
{
    [TsClass(Module = "App.ServerTypes.Models.Api")]
    public class MessageModel
    {
        public string Username { get; set; }
        public string Content { get; set; }
        public DateTimeOffset TimeSubmitted { get; set; }

    }
}
