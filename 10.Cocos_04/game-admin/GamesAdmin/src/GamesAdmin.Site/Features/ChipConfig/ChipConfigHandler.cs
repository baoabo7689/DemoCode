using GamesAdmin.Core.Models.Chip;
using GamesAdmin.Site.Features.ChipConfig.Requests;
using GamesAdmin.Site.Features.ChipConfig.ViewModels;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.ChipConfig
{
    public class ChipConfigHandler
        : IRequestHandler<GetReportRequest, ReportViewModel>
        , IRequestHandler<GetEditRequest, EditViewModel>
        , IRequestHandler<EditRequest, bool>
    {
        private readonly IChipConfigService service;

        public ChipConfigHandler(IChipConfigService service)
        {
            this.service = service;
        }

        public async Task<ReportViewModel> Handle(GetReportRequest request, CancellationToken cancellationToken)
        {
            var result = await service.GetAll();

            return new ReportViewModel(result);
        }

        public async Task<EditViewModel> Handle(GetEditRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                return new EditViewModel
                {
                    Data = new ChipModel
                    {
                        Theme = new ChipTheme
                        {
                            BackgroundColor = "#FFFFFFFF",
                            BorderColor = "#FFFFFFFF",
                            CenterColor = "#FFFFFFFF",
                            LabelColor = "#FFFFFFFF"
                        }
                    }
                };
            }

            var result = await service.GetByName(request.Name);
            return new EditViewModel
            {
                Data = result
            };
        }

        public async Task<bool> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            return await service.Upsert(request.Model);
        }
    }
}
