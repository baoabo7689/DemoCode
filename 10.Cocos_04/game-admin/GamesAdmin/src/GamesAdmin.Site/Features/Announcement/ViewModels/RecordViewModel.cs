using System.Collections.Generic;

namespace GamesAdmin.Site.Features.Announcement.ViewModels
{
    public class RecordViewModel
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public Dictionary<string, string> Contents { get; set; }

        public string MessageType { get; set; }

        public IEnumerable<string> EnabledMarkets { get; set; }

        public bool Status { get; set; }
    }
}
