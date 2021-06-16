using GamesAdmin.Core.Models;
using MediatR;
using System.Collections.Generic;

namespace GamesAdmin.Api.SigningCredentialKeys.Requests
{
    public class GetAllRequest : IRequest<IEnumerable<SigningCredentialKey>>
    {
    }
}