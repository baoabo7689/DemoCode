using GamesAdmin.Core.Models;
using MediatR;

namespace GamesAdmin.Api.SigningCredentialKeys.Requests
{
    public class UpsertRequest : IRequest<bool>
    {
        public UpsertRequest(SigningCredentialKey model)
        {
            Model = model;
        }

        public SigningCredentialKey Model { get; set; }
    }
}