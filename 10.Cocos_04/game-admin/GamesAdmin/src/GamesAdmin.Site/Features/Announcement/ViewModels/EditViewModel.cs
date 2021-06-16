using GamesAdmin.Core.Models.Announcement;
using GamesAdmin.Site.Features._Shared;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;
using System.Linq;

namespace GamesAdmin.Site.Features.Announcement.ViewModels
{
    public class EditViewModel : ViewModelBase
    {
        public EditViewModel()
        {
            MessageTypeOptions = new List<SelectListItem>
            {
                new SelectListItem {Text = "Announcement", Value = "announcement"},
                new SelectListItem {Text = "New Game", Value = "newgame"}
            };

            Data = new AnnouncementModel();
        }

        public AnnouncementModel Data { get; set; }

        public List<SelectListItem> MarketChoiceOptions { get; set; }

        public List<SelectListItem> MessageTypeOptions { get; set; }

        public List<MarketChoice> MarketChoices { get; set; }

        public bool IsNew
        {
            get
            {
                return Data == null || string.IsNullOrEmpty(Data.Id);
            }
        }
    }
}
