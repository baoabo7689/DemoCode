using GamesAdmin.Database.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace GamesAdmin.Database.Entities.Announcement
{
    [BsonCollection("announcements")]
    public class AnnouncementEntity : MiniGameBaseEntity
    {
        public string Title { get; set; }

        public Dictionary<string, string> Contents { get; set; }

        public string MessageType { get; set; }

        public bool Status { get; set; }

        public List<string> EnabledMarkets { get; set; }
    }
}
