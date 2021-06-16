using GamesAdmin.Api.ChipConfig.Requests;
using GamesAdmin.Core.Models.Chip;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Api.ChipConfig
{
    public class ChipConfigHandler
        : IRequestHandler<GetAllRequest, IEnumerable<ChipModel>>,
        IRequestHandler<GetByNameRequest, ChipModel>,
        IRequestHandler<UpsertRequest, bool>
    {
        private readonly IChipConfigService service;

        public ChipConfigHandler(IChipConfigService service)
        {
            this.service = service;
        }

        public Task<IEnumerable<ChipModel>> Handle(GetAllRequest request, CancellationToken cancellationToken)
        {
            return this.service.GetAll();
        }

        public Task<ChipModel> Handle(GetByNameRequest request, CancellationToken cancellationToken)
        {
            return this.service.GetByName(request.Name);
        }

        public Task<bool> Handle(UpsertRequest request, CancellationToken cancellationToken)
        {
            return this.service.Upsert(request.Model);
        }
    }
}
