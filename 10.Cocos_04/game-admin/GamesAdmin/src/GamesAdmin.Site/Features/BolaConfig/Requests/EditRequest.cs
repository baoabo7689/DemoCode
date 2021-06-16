using GamesAdmin.Core.Models.BolaTangkas;
using GamesAdmin.Site.Features.BolaConfig.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaConfig.Requests
{
    public class EditRequest : IRequest<bool>
    {
        public EditRequest(EditViewModel model)
        {
            Model = new BolaTangKasResultsConfigModel
            {
                Currency = model.Currency,
                GroupCurrency = model.GroupCurrency.Split(",").Select(c => c.Trim()),
                StakesConfig = null,
                IsEnable = model.IsEnable
            };
        }

        public BolaTangKasResultsConfigModel Model { get; }
    }
}
