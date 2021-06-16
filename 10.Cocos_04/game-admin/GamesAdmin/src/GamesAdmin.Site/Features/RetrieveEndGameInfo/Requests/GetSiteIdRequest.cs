using GamesAdmin.Core.Enumeration;
using GamesAdmin.Site.Features.RetrieveEndGameInfo.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.RetrieveEndGameInfo.Requests
{
    public class GetSiteIdRequest : IRequest<string>
    {
        public GetSiteIdRequest(GetEndGameInfoViewModel model)
        {
            this.MemberId = model.MemberId;
            this.GameRoundId = model.GameRoundId;
            this.GameType = model.GameType;
        }

        public int MemberId { get; set; }

        public long GameRoundId { get; set; }

        public GameId GameType { get; set; }
    }
}