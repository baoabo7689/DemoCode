using GamesAdmin.Core.Models.BolaTangkas;
using GamesAdmin.Site.Features.BolaConfig.ViewModels;
using MediatR;
using System.Linq;

namespace GamesAdmin.Site.Features.BolaConfig.Requests
{
    public class EditAmountRequest : IRequest<bool>
    {
        public EditAmountRequest(EditAmountViewModel model)
        {
            Currency = model.Currency;
            Config = new StakeConfig
            {
                Amount = model.Amount,
                Config = model.LeftConfigs.Concat(model.RightConfigs).ToList()
            };
        }

        public string Currency { get; }

        public StakeConfig Config { get; }
    }
}
