using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using GamesAdmin.Site.Features.RetrieveEndGameInfo.ViewModels;
using MediatR;
using System;

namespace GamesAdmin.Site.Features.RetrieveEndGameInfo.Requests
{
    public class RetrieveEndGameRequest : IRequest<EndGameInfoViewResult>
    {
        public RetrieveEndGameRequest(GetEndGameInfoViewModel model, ApiAuth auth)
        {
            this.GameRoundId = model.GameRoundId;
            this.GameTypeId = model.GameType;
            this.ObCustId = model.MemberId;
            this.SiteId = model.SiteId;
            this.TimeStamp = DateTimeOffset.Now;
            this.Seq = Guid.NewGuid().ToString();
            this.Auth = auth;
        }

        public GameId GameTypeId { get; set; }

        public ApiAuth Auth { get; set; }

        public long GameRoundId { get; set; }

        public int ObCustId { get; set; }

        public string SiteId { get; set; }

        public DateTimeOffset TimeStamp { get; set; }

        public string Seq { get; set; }
    }
}
