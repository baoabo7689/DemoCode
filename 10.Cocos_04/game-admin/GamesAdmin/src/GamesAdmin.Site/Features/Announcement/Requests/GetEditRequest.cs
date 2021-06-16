using GamesAdmin.Site.Features.Announcement.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.Announcement.Requests
{
    public class GetEditRequest : IRequest<EditViewModel>
    {
        public GetEditRequest(string id)
        {
            Id = id;
        }

        public string Id { get; }
    }
}
