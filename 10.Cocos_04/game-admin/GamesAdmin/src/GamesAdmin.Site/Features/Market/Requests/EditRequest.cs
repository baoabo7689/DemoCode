using GamesAdmin.Site.Features.Market.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.Market.Requests
{
    public class EditRequest : IRequest<EditViewModel>
    {
        public string Name { get; set; }

        public EditRequest(string name)
        {
            this.Name = name;
        }
    }
}
