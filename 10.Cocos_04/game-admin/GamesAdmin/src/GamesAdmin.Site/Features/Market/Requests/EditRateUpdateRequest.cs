using GamesAdmin.Site.Features.Market.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.Market.Requests
{
    public class EditRateUpdateRequest : IRequest<bool>
    {
        public EditRateUpdateRequest(EditRateViewModel model)
        {
            this.Model = model;
        }

        public EditRateViewModel Model { get; set; }        
    }
}
