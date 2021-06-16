using GamesAdmin.Site.Features.ChipConfig.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.ChipConfig.Requests
{
    public class GetEditRequest : IRequest<EditViewModel>
    {
        public GetEditRequest(string name)
        {
            Name = name;
        }

        public string Name { get; }
    }    
}
