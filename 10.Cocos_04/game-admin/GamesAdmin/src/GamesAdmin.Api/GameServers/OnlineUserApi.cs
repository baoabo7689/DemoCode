using System.Threading.Tasks;
using GamesAdmin.Core.Models;
using Refit;

namespace GamesAdmin.Api.GameServers
{
    [Headers("Authorization: Bearer")]
    public interface IOnlineUserApi
    {
        [Get("/api/onlineusers")]
        Task<OnlineUsers> GetOnlineUsers(string name = "");
    }

    public interface IMainOnlineUserApi : IOnlineUserApi
    {
        [Get("/api/game/{name}/onlineusers")]
        new Task<OnlineUsers> GetOnlineUsers(string name = "");
    }

    public interface ISicBoOnlineUserApi : IOnlineUserApi
    {
        [Get("/api/onlineusers")]
        new Task<OnlineUsers> GetOnlineUsers(string name = "");
    }
    public interface IBlackjackOnlineUserApi : IOnlineUserApi
    {
        [Get("/api/onlineusers")]
        new Task<OnlineUsers> GetOnlineUsers(string name = "");
    }
    public interface IFishPrawnCrabProOnlineUserApi : IOnlineUserApi
    {
        [Get("/api/onlineusers")]
        new Task<OnlineUsers> GetOnlineUsers(string name = "");
    }
}