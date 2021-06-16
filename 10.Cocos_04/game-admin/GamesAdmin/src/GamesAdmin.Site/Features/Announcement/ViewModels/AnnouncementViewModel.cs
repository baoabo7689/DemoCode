using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace GamesAdmin.Site.Features.Announcement.ViewModels
{
    public class AnnouncementViewModel
    {
        public AnnouncementViewModel()
        {
            MessageTypeOptions = new List<SelectListItem>
            {
                new SelectListItem {Text= "All", Value = string.Empty},
                new SelectListItem {Text = "Announcement", Value = "announcement"},
                new SelectListItem {Text = "New Game", Value = "newgame"}
            };

            MarketOptions = new List<SelectListItem>();

            StatusOptions = new List<SelectListItem>
            {
                new SelectListItem {Text = "All", Value = "0"},
                new SelectListItem {Text = "Enabled", Value = "1"},
                new SelectListItem {Text = "Disabled", Value = "2"}
            };
        }
        
        public IEnumerable<SelectListItem> MessageTypeOptions { get; set; }

        public IEnumerable<SelectListItem> MarketOptions { get; set; }

        public IEnumerable<SelectListItem> StatusOptions { get; set; }

        public string MessageType { get; set; }

        public string Market { get; set; }

        public string Status { get; set; }
    }
}