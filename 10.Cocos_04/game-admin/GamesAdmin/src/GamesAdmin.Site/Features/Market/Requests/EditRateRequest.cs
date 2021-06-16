using GamesAdmin.Site.Features.Market.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.Market.Requests
{
    public class EditRateRequest : IRequest<EditRateViewModel>
    {
        public string Name { get; set; }

        public EditRateRequest(string name)
        {
            this.Name = name;
        }
    }
}