using GamesAdmin.Core.Models.Announcement;
using GamesAdmin.Site.Features._Shared;
using Refit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.Announcement
{
    public interface IAnnouncementApi : IBaseAuthorizationApi
    {
        [Post("/announcement/upsert")]
        Task<bool> Upsert(AnnouncementModel model);

        [Get("/announcement/getAll")]
        Task<IEnumerable<AnnouncementModel>> GetAll(string type, string market,bool? status);

        [Get("/announcement/getById")]
        Task<AnnouncementModel> GetById(string id);

        [Put("/announcement/updateStatus")]
        Task<bool> UpdateStatus(string id, bool status);
    }
}
