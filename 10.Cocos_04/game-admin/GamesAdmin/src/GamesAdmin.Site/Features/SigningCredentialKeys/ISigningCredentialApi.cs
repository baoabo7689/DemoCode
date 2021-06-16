using GamesAdmin.Core.Models;
using GamesAdmin.Site.Features._Shared;
using Refit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.SigningCredentialKeys
{
    public interface ISigningCredentialApi : IBaseAuthorizationApi
    {
        [Get("/signing_credential")]
        Task<IEnumerable<SigningCredentialKey>> GetAll();

        [Post("/signing_credential/upsert")]
        Task<bool> Upsert(SigningCredentialKey model);
    }
}