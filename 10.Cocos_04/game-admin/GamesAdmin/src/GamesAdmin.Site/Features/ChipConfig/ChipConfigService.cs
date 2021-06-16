using GamesAdmin.Core.Models.Chip;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.ChipConfig
{
    public interface IChipConfigService
    {
        Task<IEnumerable<ChipModel>> GetAll();
        Task<ChipModel> GetByName(string name);
        Task<bool> Upsert(ChipModel model);        
    }


    public class ChipConfigService : IChipConfigService
    {
        private readonly IChipConfigApi configApi;

        public ChipConfigService(IChipConfigApi configApi)
        {
            this.configApi = configApi;            
        }

        public Task<IEnumerable<ChipModel>> GetAll()
        {
            return this.configApi.GetAll();
        }

        public Task<ChipModel> GetByName(string name)
        {
            return this.configApi.GetByName(name);
        }

        public Task<bool> Upsert(ChipModel model)
        {
            return this.configApi.Upsert(model);
        }
    }
}
