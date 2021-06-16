using MediatR;

namespace GamesAdmin.Api.Report.Request
{
    public class BolaTangkasChangeConfigStatusRequest : IRequest<bool>
    {
        public BolaTangkasChangeConfigStatusRequest(int combinationId, bool enable)
        {
            CombinationId = combinationId;
            Enable = enable;
        }

        public int CombinationId { get; set; }
        public bool Enable { get; set; }
    }
}