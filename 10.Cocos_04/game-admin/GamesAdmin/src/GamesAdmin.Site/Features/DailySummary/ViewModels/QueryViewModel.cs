using System;
using System.ComponentModel.DataAnnotations;

namespace GamesAdmin.Site.Features.DailySummary.ViewModels
{
    public class QueryViewModel
    {
        public QueryViewModel()
        {
            SummarizedDate = DateTime.Now;
        }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTimeOffset SummarizedDate { get; set; }

        public bool IsCash { get; set; }
    }
}
