using GamesAdmin.Core.Enumeration;
using MediatR;

namespace GamesAdmin.Api.RetrieveEndGameInfo.Requests
{
    public class GetSiteIdRequest : IRequest<string>
    {
        public GetSiteIdRequest(int memberId, long gameRoundId, GameId gameType)
        {
            this.MemberId = memberId;
            this.GameRoundId = gameRoundId;
            this.GameType = gameType;
        }

        public int MemberId { get; set; }
        public long GameRoundId { get; set; }
        public GameId GameType { get; set; }
    }
}
