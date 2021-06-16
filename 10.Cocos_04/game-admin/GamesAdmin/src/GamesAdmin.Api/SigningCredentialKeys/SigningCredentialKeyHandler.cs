using GamesAdmin.Api.SigningCredentialKeys.Requests;
using GamesAdmin.Core.Models;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Api.SigningCredentialKeys
{
    public class SigningCredentialKeyHandler : IRequestHandler<GetAllRequest, IEnumerable<SigningCredentialKey>>, IRequestHandler<UpsertRequest, bool>
    {
        private readonly ISigningCredentialKeyService service;

        public SigningCredentialKeyHandler(ISigningCredentialKeyService service)
        {
            this.service = service;
        }

        public async Task<IEnumerable<SigningCredentialKey>> Handle(GetAllRequest request, CancellationToken cancellationToken) => await service.GetAllAsync();

        public async Task<bool> Handle(UpsertRequest request, CancellationToken cancellationToken)
        {
            await service.Upsert(request.Model);

            return true;
        }
    }
}