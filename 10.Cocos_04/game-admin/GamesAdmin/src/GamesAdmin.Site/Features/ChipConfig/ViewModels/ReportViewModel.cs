using GamesAdmin.Core.Models.Chip;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.ChipConfig.ViewModels
{
    public class ReportViewModel
    {
        public ReportViewModel(IEnumerable<ChipModel> records)
        {
            this.Records = records.Select(r => new ChipViewModel(r));
        }

        public IEnumerable<ChipViewModel> Records { get; set; }
    }
}
