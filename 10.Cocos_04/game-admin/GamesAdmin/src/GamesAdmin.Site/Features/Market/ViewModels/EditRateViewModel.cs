using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GamesAdmin.Site.Features.Market.ViewModels
{
    public class EditRateViewModel
    {        
        [Required]
        [DisplayName("Market Name")]
        public string Name { get; set; }

        public string Id { get; set; }

        [Required]
        public double Rate { get; set; }

        [DisplayName("Is Base")]
        public bool IsBase { get; set; }
    }
}