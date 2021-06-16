using GamesAdmin.Site._Shared.Configurations;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;
using System.Linq;

namespace GamesAdmin.Site.Features.BolaReport.ViewModels
{
    public class BolaReportViewModel
    {
        public BolaReportViewModel(IAppSettings appSettings)
        {
            CurrencyOptions = appSettings.BolaTangkas.Currencies.Select(c =>
            {
                return new SelectListItem
                {
                    Value = c.Currency,
                    Text = c.Currency
                };
            }).ToList();

            var allStakes = appSettings.BolaTangkas.Currencies.SelectMany(c => c.StakesConfig.Select(s => s.Amount)).Distinct().ToList();
            StakeOptions = allStakes.Select(s =>
            {
                return new SelectListItem
                {
                    Value = s.ToString(),
                    Text = s.ToString()
                };
            }).ToList();
            StakeOptions.Insert(0, new SelectListItem("All", "0"));

            StatusOptions = new List<SelectListItem>
            {
                new SelectListItem {Text = "All", Value = "0"},
                new SelectListItem {Text = "Used", Value = "1"},
                new SelectListItem {Text = "UnUsed", Value = "2"}
            };
        }

        public string Currency { get; set; }

        public List<SelectListItem> CurrencyOptions { get; set; }

        public List<SelectListItem> StakeOptions { get; set; }

        public List<SelectListItem> StatusOptions { get; set; }

        public int Stake { get; set; }

        public int Status { get; set; }
    }
}
