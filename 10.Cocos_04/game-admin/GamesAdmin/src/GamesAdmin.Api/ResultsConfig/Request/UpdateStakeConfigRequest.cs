using GamesAdmin.Core.Models.BolaTangkas;
using MediatR;

namespace GamesAdmin.Api.ResultsConfig.Request
{
    public class UpdateStakeConfigRequest : IRequest<bool>
    {
        public UpdateStakeConfigRequest(string curency, StakeConfig stakeConfig)
        {
            this.Curency = curency;
            this.Stake = stakeConfig;
        }

        public string Curency { get; set; }

        public StakeConfig Stake { get; set; }
    }
}