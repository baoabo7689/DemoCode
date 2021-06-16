using MediatR;

namespace GamesAdmin.Site.Features.SigningCredentialKeys.Requests
{
    public class ChangeStatusRequest : IRequest<bool>
    {
        public string KeyId { get; set; }

        public bool IsMain { get; set; }
    }
}