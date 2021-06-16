using GamesAdmin.Site.Features.SigningCredentialKeys.Requests;
using GamesAdmin.Site.Features.SigningCredentialKeys.ViewModels;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.SigningCredentialKeys
{
    public class SigningCredentialHandler : IRequestHandler<GetAllRequest, IEnumerable<SigningCredentialKeysViewModel>>,
        IRequestHandler<CreateNewKeyRequest, bool>, IRequestHandler<GenerateNewKey, bool>,
        IRequestHandler<ChangeStatusRequest, bool>
    {
        private readonly ISigningCredentialService service;

        public SigningCredentialHandler(ISigningCredentialService service)
        {
            this.service = service;
        }

        public async Task<IEnumerable<SigningCredentialKeysViewModel>> Handle(GetAllRequest request, CancellationToken cancellationToken)
        {
            var models = await service.GetAll();

            return models.Select(x => new SigningCredentialKeysViewModel(x));
        }

        public Task<bool> Handle(CreateNewKeyRequest request, CancellationToken cancellationToken) => service.Create();

        public Task<bool> Handle(GenerateNewKey request, CancellationToken cancellationToken) => service.Update(request.KeyId, request.IsMain, true);

        public Task<bool> Handle(ChangeStatusRequest request, CancellationToken cancellationToken) => service.Update(request.KeyId, request.IsMain, false);
    }
}