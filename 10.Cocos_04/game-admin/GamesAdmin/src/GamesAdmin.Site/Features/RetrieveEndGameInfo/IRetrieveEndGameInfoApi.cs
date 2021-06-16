using GamesAdmin.Core.Enumeration;
using GamesAdmin.Site.Features._Shared;
using GamesAdmin.Site.Features.RetrieveEndGameInfo.Requests;
using GamesAdmin.Site.Features.RetrieveEndGameInfo.ViewModels;
using Refit;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.RetrieveEndGameInfo
{
    public interface IRetrieveEndGameInfoApi : IBaseAuthorizationApi
    {
        [Get("/retrieve_end_game/get_site_id")]
        Task<string> GetSiteId(int memberId, long gameRoundId, GameId gameType);        
    }
}
