using GamesAdmin.Site.Features.BolaConfig.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaConfig.Requests
{
    public class GetEditAmountRequest : IRequest<EditAmountViewModel>
    {
        public GetEditAmountRequest(string currency, int amount)
        {
            Currency = currency;
            Amount = amount;
        }

        public string Currency { get; }
        public int Amount { get; }
    }
}
