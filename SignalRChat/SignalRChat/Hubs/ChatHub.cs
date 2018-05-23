using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using SignalRChat.Models;

namespace SignalRChat.Hubs
{
    [HubName("chatHub")]
    public class ChatHub : Hub
    {
        private static int _connectedNumber = 0;

        public override Task OnConnected()
        {
            _connectedNumber++;

            var systemMessage = $"A new user connected! There are now {_connectedNumber} user(s) connected.";

            Send("System", systemMessage, DateTimeOffset.Now);

            return base.OnConnected();
        }

        public override Task OnReconnected()
        {
            _connectedNumber++;

            var systemMessage = $"A user reconnected! There are now {_connectedNumber} user(s) connected.";

            Send("System", systemMessage, DateTimeOffset.Now);

            return base.OnReconnected();
        }


        public override Task OnDisconnected(bool stopCalled)
        {
            _connectedNumber--;

            var systemMessage = $"A user disconnected! There are now {_connectedNumber} user(s) connected.";

            Send("System", systemMessage, DateTimeOffset.Now);

            return base.OnDisconnected(stopCalled);
        }
        public void Send(string username, string content, DateTimeOffset timeSubmitted)
        {
            using (var ctx = new MessagesContext())
            {
                ctx.Messages.Add(new Message
                {
                    Username = username,
                    Content = content,
                    TimeSubmitted = timeSubmitted
                });

                ctx.SaveChanges();
            }

            Clients.All.broadcastMessage(username, content, timeSubmitted);
        }


    }
}
