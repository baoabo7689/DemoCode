using System.ComponentModel.DataAnnotations;

namespace GamesAdmin.Core.Models
{
    public class ChipChoice
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string Label { get; set; }

        [Required]
        public bool Enabled { get; set; }
    }
}
