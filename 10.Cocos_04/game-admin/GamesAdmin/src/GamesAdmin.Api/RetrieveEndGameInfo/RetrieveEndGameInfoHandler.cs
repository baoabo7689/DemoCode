using GamesAdmin.Api.RetrieveEndGameInfo.Requests;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Api.RetrieveEndGameInfo
{
    public class RetrieveEndGameInfoHandler : IRequestHandler<GetSiteIdRequest, string>
    {
        private readonly IRetrieveEndGameInfoService service;

        public RetrieveEndGameInfoHandler(IRetrieveEndGameInfoService service)
        {
            this.service = service;
        }

        Task<string> IRequestHandler<GetSiteIdRequest, string>.Handle(GetSiteIdRequest request, CancellationToken cancellationToken)
        {
            return this.service.GetSiteId(request.MemberId, request.GameRoundId, request.GameType);
        }
    }
}
