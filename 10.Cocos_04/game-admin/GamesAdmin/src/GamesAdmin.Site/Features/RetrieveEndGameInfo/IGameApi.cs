using GamesAdmin.Site.Features.RetrieveEndGameInfo.Requests;
using GamesAdmin.Site.Features.RetrieveEndGameInfo.ViewModels;
using Refit;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.RetrieveEndGameInfo
{
    public interface IGameApi
    {
        [Post("/Member/RetrieveEndGameInfo")]
        Task<EndGameInfoViewResult> CallRetrieveEndGameInfo([Body(BodySerializationMethod.Serialized)] RetrieveEndGameRequest request);        
    }
}
