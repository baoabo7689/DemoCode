using System.Collections.Generic;
using GamesAdmin.Core.Models.Announcement;
using MediatR;

namespace GamesAdmin.Api.Announcement.Request
{
    public class GetAllRequest : IRequest<IEnumerable<AnnouncementModel>>
    {
        public GetAllRequest(string messageType, string market, bool? status)
        {
            this.MessageType = messageType;
            this.Market = market;
            this.Status = status;
        }

        public string MessageType { get; set; }
        public string Market { get; set; }
        public bool? Status { get; set; }

    }
}
