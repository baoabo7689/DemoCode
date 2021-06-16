using GamesAdmin.Site.Features.BolaConfig.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaConfig.Requests
{
    public class GetEditRequest : IRequest<EditViewModel>
    {
        public GetEditRequest(string currency)
        {
            Currency = currency;
        }

        public string Currency { get; }
    }
}
