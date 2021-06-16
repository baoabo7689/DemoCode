using MediatR;

namespace GamesAdmin.Api.Market.Requests
{
    public class GetByNameRequest : IRequest<Core.Models.Market>
    {
        public string Name { get; set; }

        public GetByNameRequest(string name)
        {
            this.Name = name;
        }
    }
}
