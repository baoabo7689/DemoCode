using GamesAdmin.Api._Shared;
using GamesAdmin.Api.SigningCredentialKeys.Requests;
using GamesAdmin.Core.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GamesAdmin.Api.SigningCredentialKeys
{
    [Route("api/signing_credential")]
    public class SigningCredentialKeyController : BaseAuthorizeController
    {
        private readonly IMediator mediator;

        public SigningCredentialKeyController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IEnumerable<SigningCredentialKey>> GetAll() => await mediator.Send(new GetAllRequest());

        [HttpPost("upsert")]
        public async Task<bool> Upsert(SigningCredentialKey model) => await mediator.Send(new UpsertRequest(model));
    }
}