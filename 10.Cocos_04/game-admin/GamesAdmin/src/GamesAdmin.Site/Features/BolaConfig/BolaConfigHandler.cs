using AutoMapper;
using GamesAdmin.Core.Models.BolaTangkas;
using GamesAdmin.Site._Shared.Configurations;
using GamesAdmin.Site.Features.BolaConfig.Requests;
using GamesAdmin.Site.Features.BolaConfig.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaConfig
{
    public class BolaConfigHandler 
        : IRequestHandler<GetReportRequest, ReportResultViewModel>
        , IRequestHandler<GetEditRequest, EditViewModel>
        , IRequestHandler<EditRequest, bool>
        , IRequestHandler<GetEditAmountRequest, EditAmountViewModel>
        , IRequestHandler<EditAmountRequest, bool>
        , IRequestHandler<LoadNewRequest, bool>        
    {
        private readonly IBolaConfigService reportService;
        private readonly IMapper mapper;

        public BolaConfigHandler(IBolaConfigService reportService, IMapper mapper)
        {
            this.reportService = reportService;
            this.mapper = mapper;
        }

        public async Task<ReportResultViewModel> Handle(GetReportRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetReport(request.Currency);

            return new ReportResultViewModel
            {
                Records = result.Select(x => new RecordViewModel
                {
                    Currency = x.Currency,
                    Stakes = x.StakesConfig.Select(s => s.Amount).ToList(),
                    GroupCurrency = string.Join(", ", x.GroupCurrency),
                    IsEnable = x.IsEnable
                })
            };
        }

        public async Task<EditViewModel> Handle(GetEditRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.Currency)) {
                return new EditViewModel();
            }

            var result = await reportService.GetConfig(request.Currency);

            return new EditViewModel
                {
                    Currency = result.Currency,
                    Stakes = string.Join(", ", result.StakesConfig.Select(s => s.Amount).ToList()),
                    GroupCurrency = string.Join(", ", result.GroupCurrency),
                    IsEnable = result.IsEnable
                };
        }

        public async Task<bool> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            return await reportService.Edit(request.Model);
        }

        public async Task<EditAmountViewModel> Handle(GetEditAmountRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetConfig(request.Currency);
            var viewModel = new EditAmountViewModel
            {
                Currency = result.Currency,
                Amount = request.Amount,
                Configs = result.StakesConfig.Where(s => s.Amount == request.Amount).Select(s => s.Config).FirstOrDefault()
            };

            viewModel.SplitConfigs();

            return viewModel;
        }

        public async Task<bool> Handle(EditAmountRequest request, CancellationToken cancellationToken)
        {
            return await reportService.EditAmount(request);
        }

        public async Task<bool> Handle(LoadNewRequest request, CancellationToken cancellationToken)
        {
            return await reportService.LoadNew(request);
        }
    }
}
