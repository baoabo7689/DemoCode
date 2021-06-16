using GamesAdmin.Database.Entities;
using MongoDB.Driver;

namespace GamesAdmin.Database
{
    public interface ISigningCredentialKeyRepository : IGenericRepository<SigningCredentialKeyEntity> { }

    public class SigningCredentialKeyRepository : GenericRepository<SigningCredentialKeyEntity>, ISigningCredentialKeyRepository
    {
        public SigningCredentialKeyRepository(IMongoClient client) : base(client.GetDatabase("member"))
        {
        }
    }
}