using GamesAdmin.Site.Features.DailySummary.Requests;
using GamesAdmin.Site.Features.DailySummary.ViewModels;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.DailySummary
{
    public class DailySummaryHandler : 
        IRequestHandler<GetReportRequest, ResultViewModel>
    {
        private readonly IDailySummaryService service;

        public DailySummaryHandler(IDailySummaryService service)
        {
            this.service = service;
        }

        public async Task<ResultViewModel> Handle(GetReportRequest request, CancellationToken cancellationToken)
        {
            var data = await service.GetAll(request.SummarizedDate, request.IsCash);
            var viewModel = new ResultViewModel
            {
                Records = data
            };

            return viewModel;
        }
    }
}
