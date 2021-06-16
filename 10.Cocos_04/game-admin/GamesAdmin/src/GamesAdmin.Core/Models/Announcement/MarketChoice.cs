using System.ComponentModel.DataAnnotations;

namespace GamesAdmin.Core.Models.Announcement
{
    public class MarketChoice
    {
        public MarketChoice()
        {

        }

        public MarketChoice(string id, string label, bool enabled)
        {
            this.Id = id;
            this.Label = label;
            this.Enabled = enabled;
        }

        [Required]
        public string Id { get; set; }

        [Required]
        public string Label { get; set; }

        [Required]
        public bool Enabled { get; set; }
    }
}