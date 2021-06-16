using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GamesAdmin.Site.Features.Market.ViewModels
{
    public class AddViewModel
    {
        [Required]
        [DisplayName("Market Name")]
        public string Name { get; set; }

        [Required]        
        public string Currencies { get; set; }

        public bool Enabled { get; set; }

        public bool Cash { get; set; }

        [DisplayName("Default Chip")]
        public string DefaultChipId { get; set; }

        public List<SelectListItem> ChipOptions { get; set; }
    }
}
