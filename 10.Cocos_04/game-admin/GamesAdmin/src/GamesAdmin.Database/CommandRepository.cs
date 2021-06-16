using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Database
{
    public interface ICommandRepository
    {
        Task<TResult> RunCommandAsync<TResult>(Command<TResult> command, ReadPreference readPreference = null, CancellationToken cancellationToken = default);
    }

    public class CommandRepository : ICommandRepository
    {
        private readonly IMongoDatabase database;

        public CommandRepository(IMongoDatabase database)
        {
            this.database = database;
        }

        
        public Task<TResult> RunCommandAsync<TResult>(Command<TResult> command, ReadPreference readPreference = null, CancellationToken cancellationToken = default)
        {
            return database.RunCommandAsync(command, readPreference, cancellationToken);
        }
    }
}
