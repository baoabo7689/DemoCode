using GamesAdmin.Core.Models.BolaTangkas;
using GamesAdmin.Site.Features.BolaReport.Requests;
using GamesAdmin.Site.Features.BolaReport.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaReport
{
    public class BolaReportHandler 
        : IRequestHandler<GetReportRequest, ReportResultViewModel>
        , IRequestHandler<GetConfigRequest, ConfigViewModel>
        , IRequestHandler<EditRequest, bool>

    {
        private readonly IBolaReportService reportService;

        public BolaReportHandler(IBolaReportService reportService)
        {
            this.reportService = reportService;
        }

        public async Task<ReportResultViewModel> Handle(GetReportRequest request, CancellationToken cancellationToken)
        {            
            var result = await reportService.GetReport(request.Currency, request.Stake, request.Status);

            return new ReportResultViewModel
            {
                Records = result.Select(x => new RecordViewModel
                {
                    Currency = request.Currency,
                    Stake = x.Stake,
                    TotalBet = x.TotalBet,
                    TotalPayout = x.TotalPayout,
                    TotalWinloss = x.WinLossAmount,
                    RemainingCombination = x.RemainingCombinations,
                    TableIndex = x.CombinationIndex,
                    IsEnabled = x.Enable,
                    GenerateTime = x.GenerateTime
                })
            };
        }

        public async Task<ConfigViewModel> Handle(GetConfigRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetConfig(request.TableIndex);
            var model = new ConfigViewModel
            {
                Currency = request.Currency,
                Stake = request.Stake,
                TabkeIndex = request.TableIndex,
                Configs = result.ToList()
            };
            model.SplitConfigs();

            return model;
        }

        public async Task<bool> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            return await reportService.Edit(request.IsEnabled, request.TableIndex);
        }
    }
}
