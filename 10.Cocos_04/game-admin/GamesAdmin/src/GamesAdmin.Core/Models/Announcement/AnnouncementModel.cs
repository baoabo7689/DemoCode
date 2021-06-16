using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using GamesAdmin.Core.Enumeration.Announcements;

namespace GamesAdmin.Core.Models.Announcement
{
    public class AnnouncementModel
    {
        public AnnouncementModel()
        {
            Contents = new Dictionary<string, string>();
            EnabledMarkets = new List<string>();

            var announcementLanguage = Enumeration.Enumeration.GetAll<AnnouncementLanguage>().ToList();
            announcementLanguage.ForEach(language => Contents.Add(language.Value, string.Empty));
        }

        public string Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public Dictionary<string, string> Contents { get; set; }

        [Required]
        public string MessageType { get; set; }

        public string Market { get; set; }

        public bool Status { get; set; }

        public List<string> EnabledMarkets { get; set; }
    }
}