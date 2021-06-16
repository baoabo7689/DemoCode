using GamesAdmin.Core.Models.Chip;
using GamesAdmin.Site.Features._Shared;
using Refit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.ChipConfig
{
    public interface IChipConfigApi : IBaseAuthorizationApi
    {
        [Get("/chip_config/get_all")]
        Task<IEnumerable<ChipModel>> GetAll();

        [Get("/chip_config/get_by_name")]
        Task<ChipModel> GetByName(string name);

        [Post("/chip_config/upsert")]
        Task<bool> Upsert(ChipModel config);
    }
}
