using System.Collections.Generic;
using System.Threading.Tasks;
using GamesAdmin.Api._Shared;
using GamesAdmin.Api.Announcement.Request;
using GamesAdmin.Core.Models.Announcement;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GamesAdmin.Api.Announcement
{
    [Route("api/announcement")]
    public class AnnouncementController : BaseAuthorizeController
    {
        private readonly IMediator mediator;

        public AnnouncementController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost("upsert")]
        public async Task<bool> Upsert(AnnouncementModel model)
        {
            return await mediator.Send(new UpsertRequest(model));
        }

        [HttpGet("getAll")]
        public async Task<IEnumerable<AnnouncementModel>> GetAll(string type, string market, bool? status)
        {
            return await mediator.Send(new GetAllRequest(type, market, status));
        }

        [HttpGet("getById")]
        public async Task<AnnouncementModel> GetById(string id)
        {
            return await mediator.Send(new GetByIdRequest(id));
        }

        [HttpPut("updateStatus")]
        public async Task<bool> UpdateStatus(string id, bool status)
        {
            return await mediator.Send(new UpdateStatusRequest(id, status));
        }
    }
}