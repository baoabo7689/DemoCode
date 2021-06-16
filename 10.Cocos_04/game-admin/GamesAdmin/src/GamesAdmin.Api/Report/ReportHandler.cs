using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GamesAdmin.Api.Report.Request;
using GamesAdmin.Core.Models;
using GamesAdmin.Core.Models.BolaTangkas;
using MediatR;

namespace GamesAdmin.Api.Report
{
    public class ReportHandler :
        IRequestHandler<BigSmallReportRequest, BigSmallBetReport>,
        IRequestHandler<BolaTangkasReportRequest, BolaTangkasBetReport>,
        IRequestHandler<GameReportRequest, IEnumerable<BaseBetHistory>>,
        IRequestHandler<BigSmallTurboReportRequest, BigSmallBetReport>,
        IRequestHandler<OddEvenTurboReportRequest, OddEvenBetReport>,
        IRequestHandler<OddEvenReportRequest, OddEvenBetReport>,
        IRequestHandler<BolaTangkasWinLossReportRequest, IEnumerable<BolaTangkasWinLossReport>>,
        IRequestHandler<BolaTangkasStakeConfigRequest, IEnumerable<CombinationConfig>>,
        IRequestHandler<BolaTangkasChangeConfigStatusRequest, bool>
    {
        private readonly IReportService reportService;

        public ReportHandler(IReportService reportService)
        {
            this.reportService = reportService;
        }

        public async Task<BigSmallBetReport> Handle(BigSmallReportRequest request, CancellationToken cancellationToken)
            => await reportService.GetBigSmallReportAsync(request.RoundId, request.Nickname, request.ExcludeBot);

        public async Task<BolaTangkasBetReport> Handle(BolaTangkasReportRequest request, CancellationToken cancellationToken)
            => await reportService.GetBolaTangkasReportAsync(request.RoundId, request.Nickname);

        public async Task<IEnumerable<BaseBetHistory>> Handle(GameReportRequest request, CancellationToken cancellationToken)
            => await reportService.GetBetHistoryReport(request.Name, request.RoundId, request.GameType);

        public async Task<BigSmallBetReport> Handle(BigSmallTurboReportRequest request, CancellationToken cancellationToken)
            => await reportService.GetBigSmallTurboReportAsync(request.RoundId, request.Nickname, request.ExcludeBot);

        public async Task<OddEvenBetReport> Handle(OddEvenTurboReportRequest request, CancellationToken cancellationToken)
            => await reportService.GetOddEvenTurboReportAsync(request.RoundId, request.Nickname, request.ExcludeBot);

        public async Task<OddEvenBetReport> Handle(OddEvenReportRequest request, CancellationToken cancellationToken)
            => await reportService.GetOddEvenReportAsync(request.RoundId, request.Nickname, request.ExcludeBot);

        public async Task<IEnumerable<BolaTangkasWinLossReport>> Handle(BolaTangkasWinLossReportRequest request, CancellationToken cancellationToken)
           => await reportService.GetBolaTangkasWinLossReportAsync(request.Currency, request.Stake, request.Status);

        public async Task<IEnumerable<CombinationConfig>> Handle(BolaTangkasStakeConfigRequest request, CancellationToken cancellationToken)
            => await reportService.GetStakeConfig(request.CombinationIndex);

        public async Task<bool> Handle(BolaTangkasChangeConfigStatusRequest request, CancellationToken cancellationToken)
            => await reportService.UpdateConfigStatus(request.CombinationId, request.Enable);
    }
}