using GamesAdmin.Database;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace GamesAdmin.Site.Features.UserInfos
{
    public class UserInfoHandler : IRequestHandler<UserInfoRequest, UserInfoEntity>
    {
        public async Task<UserInfoEntity> Handle(UserInfoRequest request, CancellationToken cancellationToken)
        {
            var database = new MongoClient().GetDatabase("minigame");
            var collection = database.GetCollection<dynamic>("userinfos");
            var user = (await collection.FindAsync(u => (u as UserInfoEntity).name == "Louis.Nguyen")).FirstOrDefault();

            return new UserInfoEntity { red = user?.red ?? 0 };
        }
    }
}
