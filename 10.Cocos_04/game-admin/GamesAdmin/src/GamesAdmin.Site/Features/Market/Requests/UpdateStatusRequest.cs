using MediatR;

namespace GamesAdmin.Site.Features.Market.Requests
{
    public class UpdateStatusRequest : IRequest<bool>
    {
        public string Name { get; set; }

        public bool Enabled { get; set; }

        public UpdateStatusRequest(string name, bool enabled)
        {
            this.Name = name;
            this.Enabled = enabled;
        }
    }
}
