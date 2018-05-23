using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using SignalRChat.Models;
using SignalRChat.Models.Api;

namespace SignalRChat.Controllers.Api
{
    public class MessagesController : ApiController
    {
        private readonly MessagesContext _messagesContext;

        public MessagesController()
            : this(new MessagesContext())
        {
        }

        public MessagesController(MessagesContext messagesContext)
        {
            _messagesContext = messagesContext;

        }


        [HttpPut]
        public async Task<IHttpActionResult> GetMessages(SearchCriteriaModel searchCriteria)
        {
            var query = _messagesContext.Messages
                .Select(m => new MessageModel
                {
                    Username = m.Username,
                    Content = m.Content,
                    TimeSubmitted = m.TimeSubmitted
                });

            if (!searchCriteria.IncludeSystem)
            {
                query = query.Where(m => m.Username != "System");
            }

            if (searchCriteria.TimeLength != 0)
            {
                var currentTime = DateTimeOffset.Now;
                DateTimeOffset searchTime;

                switch (searchCriteria.TimeUnit)
                {
                    case TimeUnit.Minutes:
                        searchTime = currentTime.AddMinutes(-searchCriteria.TimeLength);
                        break;
                    case TimeUnit.Hours:
                        searchTime = currentTime.AddHours(-searchCriteria.TimeLength);
                        break;
                    case TimeUnit.Days:
                        searchTime = currentTime.AddDays(-searchCriteria.TimeLength);
                        break;
                    default:
                        searchTime = DateTimeOffset.MinValue;
                        break;
                }

                query = query.Where(m => m.TimeSubmitted > searchTime);
            }

            query = query.OrderByDescending(m => m.TimeSubmitted);

            if (searchCriteria.Take != 0)
            {
                query = query.Take(searchCriteria.Take);
            }


            var result = await query.ToArrayAsync();

            return Ok(result.Reverse());
        }

    }
}
