using GamesAdmin.Site.Features.SigningCredentialKeys.ViewModels;
using MediatR;
using System.Collections.Generic;

namespace GamesAdmin.Site.Features.SigningCredentialKeys.Requests
{
    public class GetAllRequest : IRequest<IEnumerable<SigningCredentialKeysViewModel>>
    {
    }
}