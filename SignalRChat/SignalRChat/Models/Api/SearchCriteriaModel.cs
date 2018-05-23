using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalRChat.Models.Api
{
    public class SearchCriteriaModel
    {
        // Duplicate this with the file in Scripts/Home/ChatRoom.ts , ISearchCriteraModel
        // In a project I would use ServerTypes.tt, but didn't know how to set this up

        public bool IncludeSystem { get; set; }
        public int Take { get; set; }
        public int TimeLength { get; set; }
        public TimeUnit TimeUnit { get; set; }
    }
}
