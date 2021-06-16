using GamesAdmin.Site.Features.RetrieveEndGameInfo.Requests;
using GamesAdmin.Site.Features.RetrieveEndGameInfo.ViewModels;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.RetrieveEndGameInfo
{
    public class RetrieveEndGameInfoHandler  :
        IRequestHandler<GetSiteIdRequest, string>,
        IRequestHandler<RetrieveEndGameRequest, EndGameInfoViewResult>
    {
        private readonly IRetrieveEndGameInfoService service;

        public RetrieveEndGameInfoHandler(IRetrieveEndGameInfoService service)
        {
            this.service = service;
        }

        public Task<EndGameInfoViewResult> Handle(RetrieveEndGameRequest request, CancellationToken cancellationToken)
        {
            return service.CallRetrieveEndGameInfo(request);
        }

        Task<string> IRequestHandler<GetSiteIdRequest, string>.Handle(GetSiteIdRequest request, CancellationToken cancellationToken)
        {
            return service.GetSiteId(request);
        }
    }
}
