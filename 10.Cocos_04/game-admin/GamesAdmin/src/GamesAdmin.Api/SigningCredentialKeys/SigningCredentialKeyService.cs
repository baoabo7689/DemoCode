using GamesAdmin.Core.Models;
using GamesAdmin.Database;
using GamesAdmin.Database.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Api.SigningCredentialKeys
{
    public interface ISigningCredentialKeyService
    {
        Task<IEnumerable<SigningCredentialKey>> GetAllAsync();

        Task Upsert(SigningCredentialKey model);
    }

    public class SigningCredentialKeyService : ISigningCredentialKeyService
    {
        private readonly ISigningCredentialKeyRepository signingCredentialKeyRepository;

        public SigningCredentialKeyService(ISigningCredentialKeyRepository signingCredentialKeyRepository)
        {
            this.signingCredentialKeyRepository = signingCredentialKeyRepository;
        }

        public async Task<IEnumerable<SigningCredentialKey>> GetAllAsync()
        {
            var entities = await signingCredentialKeyRepository.FilterByAsync(x => true);

            return entities.Select(TransformToModel);
        }

        public async Task Upsert(SigningCredentialKey model)
        {
            var existEntity = await GetByKeyId(model.KeyId);
            var newEntity = new SigningCredentialKeyEntity
            {
                IsMain = model.IsMain,
                KeyId = model.KeyId,
                PrivateKey = model.PrivateKey ?? existEntity.PrivateKey
            };

            if (existEntity != null)
            {
                newEntity.Id = existEntity.Id;
                await signingCredentialKeyRepository.ReplaceOneAsync(newEntity);
            }
            else
            {
                await signingCredentialKeyRepository.InsertOneAsync(newEntity);
            }
        }

        private Task<SigningCredentialKeyEntity> GetByKeyId(string keyId) => signingCredentialKeyRepository.FindOneAsync(x => x.KeyId == keyId);

        private SigningCredentialKey TransformToModel(SigningCredentialKeyEntity entity) => new SigningCredentialKey
        {
            IsMain = entity.IsMain,
            KeyId = entity.KeyId,
            PrivateKey = entity.PrivateKey
        };
    }
}