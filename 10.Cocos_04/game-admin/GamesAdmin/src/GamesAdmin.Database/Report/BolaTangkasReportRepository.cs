using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using GamesAdmin.Database.Entities;
using GamesAdmin.Database.Entities.BolaTangkas.Model;
using MongoDB.Bson;
using MongoDB.Driver;

namespace GamesAdmin.Database
{
    public interface IBolaTangkasReportRepository
    {
        Task<IEnumerable<BolaTangkasRoundEntity>> GetAsync(long roundId, string nickname);

        Task<IEnumerable<BolaTangkasStakeGroupEntity>> GetWinLossReport(string currency, int stake, int status);

        Task<IEnumerable<CombinationConfigModel>> GetStakeConfig(int combinationId);

        Task<bool> ChangeConfigStatus(int combinationId, bool enable);
    }

    public class BolaTangkasReportRepository : BaseBetReportRepository, IBolaTangkasReportRepository
    {
        public BolaTangkasReportRepository(IMongoDatabase database) : base(database)
        {
        }

        public async Task<IEnumerable<BolaTangkasRoundEntity>> GetAsync(long roundId, string nickname)
        {
            var roundCollection = database.GetCollection<BolaTangkasRoundEntity>(Document.GetCollectionName(typeof(BolaTangkasRoundEntity)));
            var betCollection = database.GetCollection<BolaTangkasBetEntity>(Document.GetCollectionName(typeof(BolaTangkasBetEntity)));
            var accountCollection = database.GetCollection<AccountEntity>(Document.GetCollectionName(typeof(AccountEntity)));
            var accountInfoCollection = database.GetCollection<AccountInfoEntity>(Document.GetCollectionName(typeof(AccountInfoEntity)));
            var nickNameRegex = new Regex($"(?i){nickname}");

            var aggregateBuilder = roundCollection.Aggregate().Match(x => x.RoundId == roundId)
                .SortBy(x => x.RoundId)
                .Lookup<BolaTangkasRoundEntity, BolaTangkasBetEntity, BolaTangkasWithBets>(
                       foreignCollection: betCollection,
                       localField: x => x.RoundId,
                       foreignField: x => x.RoundId,
                       @as: r => r.Bets)
                //.Unwind<BolaTangkasWithAccountInfos, BolaTangkasWithAccountInfoUnwind>(x => x.AccountInfos)

                .Lookup<BolaTangkasWithBets, AccountInfoEntity, BolaTangkasWithAccountInfos>(
                       foreignCollection: accountInfoCollection,
                       localField: x => x.Uid,
                       foreignField: x => x.UserId,
                       @as: r => r.AccountInfos)
                 .Unwind<BolaTangkasWithAccountInfos, BolaTangkasWithAccountInfoUnwind>(x => x.AccountInfos)
                 .Match(x => string.IsNullOrWhiteSpace(nickname) || nickNameRegex.IsMatch(x.AccountInfos.Name))
                 .AppendStage<BolaTangkasWithAccountInfoUnwind>("{$addFields: {userId: {$toObjectId: '$uid'}}}")
                 .Lookup<BolaTangkasWithAccountInfoUnwind, AccountEntity, BolaTangkasWithAccountInfoUnwind>(
                       foreignCollection: accountCollection,
                       localField: x => x.UserId,
                       foreignField: x => x.Id,
                       @as: r => r.Accounts
                 )
                .Unwind<BolaTangkasWithAccountInfoUnwind, BolaTangkasWithUnwindAccountsEntity>(x => x.Accounts);

            var project = aggregateBuilder.Project(x => new BolaTangkasRoundEntity
            {
                Time = x.Time,
                Username = x.Accounts.Local.MemberName,
                Nickname = x.AccountInfos.Name,
                Bet = x.Bets.First().Bet,
                TotalBet = x.TotalBet,
                Win = x.Win,
                Back = x.Back,
                Cards = x.Cards,
                ResultType = x.ResultType,
                ColokanCard = x.ColokanCard
            });
            var records = await project.ToListAsync();

            return records;
        }

        public async Task<IEnumerable<BolaTangkasStakeGroupEntity>> GetWinLossReport(string currency, int stake, int status)
        {
            var stakeGroupCollection = database.GetCollection<BolaTangkasStakeGroupEntity>(Document.GetCollectionName(typeof(BolaTangkasStakeGroupEntity)));

            var aggregateBuilder = stakeGroupCollection.Aggregate().Match(
                x => x.Currency == currency 
                && (stake <= 0 || x.Amount == stake)
                && (status == 0 || (status == 1 && x.HouseTotalWin > 0) || (status == 2 && x.HouseTotalWin == 0))
                )
                .SortByDescending(x => x.CombinationId);

            var records = await aggregateBuilder.ToListAsync();

            return records;
        }

        public async Task<IEnumerable<CombinationConfigModel>> GetStakeConfig(int combinationId)
        {
            var stakeGroupCollection = database.GetCollection<BolaTangkasStakeGroupEntity>(Document.GetCollectionName(typeof(BolaTangkasStakeGroupEntity)));

            var data = await stakeGroupCollection.Aggregate().Match(x => x.CombinationId == combinationId).ToListAsync();
            var stakeConfig = data.FirstOrDefault().ResultConfigs;

            return stakeConfig;
    }

        public async Task<bool> ChangeConfigStatus(int combinationId, bool enable)
        {
            var stakeGroupCollection = database.GetCollection<BolaTangkasStakeGroupEntity>(Document.GetCollectionName(typeof(BolaTangkasStakeGroupEntity)));

            var data = await stakeGroupCollection.FindOneAndUpdateAsync(x => x.CombinationId == combinationId, Builders<BolaTangkasStakeGroupEntity>.Update.Set(e => e.Enabled,enable));

            return data != null ? true : false;
        }
    }

    public class BolaTangkasWithUnwindAccountsEntity : BolaTangkasRoundEntity
    {
        public ObjectId UserId { get; set; }

        public AccountInfoEntity AccountInfos { get; set; }

        public AccountEntity Accounts { get; set; }
        public IEnumerable<BolaTangkasBetEntity> Bets { get; set; }
    }

    internal class BolaTangkasWithAccountInfoUnwind : BolaTangkasRoundEntity
    {
        public ObjectId UserId { get; set; }

        public AccountInfoEntity AccountInfos { get; set; }

        public IEnumerable<AccountEntity> Accounts { get; set; }
        public IEnumerable<BolaTangkasBetEntity> Bets { get; set; }
    }

    internal class BolaTangkasWithAccountInfos : BolaTangkasRoundEntity
    {
        public IEnumerable<AccountInfoEntity> AccountInfos { get; set; }
        public IEnumerable<BolaTangkasBetEntity> Bets { get; set; }
    }

    internal class BolaTangkasWithBets : BolaTangkasRoundEntity
    {
        public IEnumerable<BolaTangkasBetEntity> Bets { get; set; }
    }
}