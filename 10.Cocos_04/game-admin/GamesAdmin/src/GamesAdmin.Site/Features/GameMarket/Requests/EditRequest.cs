using GamesAdmin.Site.Features.GameMarket.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.GameMarket.Requests
{
    public class EditRequest : IRequest<EditViewModel>
    {
        public EditRequest(string name)
        {
            Name = name;
        }

        public string Name { get; }
    }
}
