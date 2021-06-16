using AutoMapper;
using GamesAdmin.Core.Models.Chip;
using GamesAdmin.Database;
using GamesAdmin.Database.Entities.BetChip;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Api.ChipConfig
{
    public interface IChipConfigService
    {
        Task<ChipModel> GetByName(string name);

        Task<IEnumerable<ChipModel>> GetAll();

        Task<bool> Upsert(ChipModel model);
    }

    public class ChipConfigService : IChipConfigService
    {
        private readonly IGenericRepository<ChipEntity> repository;
        private readonly IMapper mapper;

        public ChipConfigService(IGenericRepository<ChipEntity> repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ChipModel>> GetAll()
        {
            var data = this.repository.AsQueryable().ToList().OrderBy(i => i.Value);
            var result = data.Select(d => mapper.Map<ChipModel>(d));

            return result;
        }

        public async Task<ChipModel> GetByName(string name)
        {
            var data = await GetOneByName(name);
            return mapper.Map<ChipModel>(data);
        }

        public async Task<bool> Upsert(ChipModel model)
        {            
            var existEntity = await GetOneByName(model.Label);
            var newEntity = new ChipEntity
            {
                Label = model.Label,
                Value = model.Value,
                Enabled = model.Enabled,
                Theme = new Database.Entities.BetChip.ChipTheme
                {
                    BackgroundColor = model.Theme.BackgroundColor,
                    BorderColor = model.Theme.BorderColor,
                    CenterColor = model.Theme.CenterColor,
                    LabelColor = model.Theme.LabelColor
                }
            };

            if (existEntity != null)
            {
                newEntity.Id = existEntity.Id;
                await repository.ReplaceOneAsync(newEntity);
            }
            else
            {
                await repository.InsertOneAsync(newEntity);
            }           

            return true;
        }

        private Task<ChipEntity> GetOneByName(string name)
        {
            return repository.FindOneAsync(x => x.Label == name);            
        }
    }
}
