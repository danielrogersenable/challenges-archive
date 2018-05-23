using Microsoft.Owin;
using Owin;
using SignalRChat;

namespace SignalRChat
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}