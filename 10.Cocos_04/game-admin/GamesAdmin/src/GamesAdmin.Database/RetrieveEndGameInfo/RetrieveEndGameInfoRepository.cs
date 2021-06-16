using System.Linq;
using System.Threading.Tasks;
using GamesAdmin.Core.Enumeration;
using MongoDB.Driver;

namespace GamesAdmin.Database.RetrieveEndGameInfo
{
    public interface IRetrieveEndGameInfoRepository
    {
        Task<string> GetSiteIdAsync(int memberId, long gameRoundId, GameId gameType);

        Task<string> GetSiteIdForBolaAsync(int memberId, long gameRoundId);

        Task<string> GetSiteIdForBlackjackAsync(int memberId, long gameRoundId);
    }

    public class RetrieveEndGameInfoRepository : IRetrieveEndGameInfoRepository
    {
        private readonly IMongoDatabase database;

        public RetrieveEndGameInfoRepository(IMongoDatabase database)
        {
            this.database = database;
        }

        public async Task<string> GetSiteIdAsync(int memberId, long gameRoundId, GameId gameType)
        {
            var collectionName = string.Empty;

            switch (gameType)
            {
                case GameId.FishPrawnCrab:
                    collectionName = GameBetCollections.FishPrawnCrabBet;
                    break;

                case GameId.BigSmall:
                    collectionName = GameBetCollections.BigSmallBet;
                    break;

                case GameId.BigSmallTurbo:
                    collectionName = GameBetCollections.BigSmallTurboBet;
                    break;

                case GameId.OddEven:
                    collectionName = GameBetCollections.OddEvenBet;
                    break;

                case GameId.OddEvenTurbo:
                    collectionName = GameBetCollections.OddEvenTurboBet;
                    break;

                case GameId.DragonTiger:
                    collectionName = GameBetCollections.DragonTigetBet;
                    break;

                case GameId.SeDie:
                    collectionName = GameBetCollections.SeDieBet;
                    break;

                case GameId.KenoProMax:
                    collectionName = GameBetCollections.KenoProMaxBet;
                    break;

                case GameId.Baccarat:
                    collectionName = GameBetCollections.BaccaratBet;
                    break;

                case GameId.Roulette:
                    collectionName = GameBetCollections.RouletteBet;
                    break;

                case GameId.Sicbo:
                    collectionName = GameBetCollections.SicBoBet;
                    break;

                case GameId.Blackjack:
                    collectionName = GameBetCollections.BlackjackBet;
                    break;
                case GameId.KenoMax:
                    collectionName = GameBetCollections.KenoMaxBet;
                    break;
                case GameId.KenoMax2:
                    collectionName = GameBetCollections.KenoMax2Bet;
                    break;
                case GameId.KenoMini:
                    collectionName = GameBetCollections.KenoMiniBet;
                    break;
                case GameId.KenoMini2:
                    collectionName = GameBetCollections.KenoMini2Bet;
                    break;
                case GameId.KenoEast:
                    collectionName = GameBetCollections.KenoEastBet;
                    break;
                case GameId.KenoWest:
                    collectionName = GameBetCollections.KenoWestBet;
                    break;
                case GameId.KenoNorth:
                    collectionName = GameBetCollections.KenoNorthBet;
                    break;
                case GameId.KenoSouth:
                    collectionName = GameBetCollections.KenoSouthBet;
                    break;

                case GameId.FishPrawnCrabPro:
                    collectionName = GameBetCollections.FishPrawnCrabProBet;
                    break;

                default:
                    collectionName = string.Empty;
                    break;
            }

            return await GetSiteIdAsync(memberId, gameRoundId, collectionName);
        }

        public async Task<string> GetSiteIdForBolaAsync(int memberId, long gameRoundId)
        {
            var collection = database.GetCollection<BolaBetEntity>(GameBetCollections.BolaTangkasBet);
            var cursor = collection.Find(x => x.MemberId == memberId && x.Round == gameRoundId);
            var data = await cursor.ToListAsync();

            return data.FirstOrDefault()?.SiteId;
        }

        public async Task<string> GetSiteIdForBlackjackAsync(int memberId, long gameRoundId)
        {
            var collection = database.GetCollection<BlackjackBetEntity>(GameBetCollections.BlackjackBet);
            var cursor = collection.Find(x => x.MemberId == memberId && x.Round == gameRoundId);
            var data = await cursor.ToListAsync();

            return data.FirstOrDefault()?.SiteId;
        }

        private async Task<string> GetSiteIdAsync(
            int memberId,
            long gameRoundId,
            string roundCollectionName)
        {
            var collection = database.GetCollection<BetEntity>(roundCollectionName);
            var cursor = collection.Find(x => x.MemberId == memberId && x.Round == gameRoundId);
            var data = await cursor.ToListAsync();

            return data.FirstOrDefault()?.SiteId;
        }
    }
}