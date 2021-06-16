using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using System.Collections.Generic;
using System.Linq;

namespace GamesAdmin.Site.Features.GameSettings.ViewModels
{
    public class StatusViewModel
    {
        public StatusViewModel(IList<StatusItemViewModel> gameList)
        {
            GameList = gameList;
        }

        public IList<StatusItemViewModel> GameList { get; }
    }

    public class StatusItemViewModel
    {
        private static IList<string> gameEnabledHistory = new List<string>
        {
            GameType.BigSmallValue,
            GameType.BigSmallTurboValue,
            GameType.OddEvenValue,
            GameType.OddEvenTurboValue,
            GameType.BolaTangkasValue
        };

        public static IList<string> gameDisabledShowBot = new List<string>
        {
            GameType.BolaTangkasValue
        };

        public static IList<string> enabledDelayStartTime = new List<string>
        {
            GameType.KenoMaxValue,
            GameType.KenoMax2Value,
            GameType.KenoMiniValue,
            GameType.KenoMini2Value,
            GameType.KenoNorthValue,
            GameType.KenoSouthValue,
            GameType.KenoWestValue,
            GameType.KenoEastValue
        };

        public static IList<string> gamesNotUsedChip = new List<string>
        {

        };

        private static IList<string> gameConfigOdds = new List<string> {
            GameType.SicboValue,
            GameType.BlackjackValue,
            GameType.KenoMaxValue,
            GameType.FishPrawnCrabProValue,
            GameType.KenoMax2Value,
            GameType.KenoMiniValue,
            GameType.KenoMini2Value,
            GameType.KenoSouthValue,
            GameType.KenoNorthValue,
            GameType.KenoWestValue,
            GameType.KenoEastValue,
            GameType.BigSmallValue,
            GameType.BigSmallTurboValue,
            GameType.OddEvenValue,
            GameType.OddEvenTurboValue,
        };

        private static Dictionary<string, string> gameHistoryUrl = new Dictionary<string, string>
        {
            { GameType.BigSmallValue, "bigsmall" },
            { GameType.BigSmallTurboValue, "bigsmallturbo" },
            { GameType.OddEvenValue, "oddeven" },
            { GameType.OddEvenTurboValue, "oddeventurbo" },
            { GameType.BolaTangkasValue, "bolatangkas" }
        };

        public StatusItemViewModel(string name, bool enabled, string disabledMessage)
        {
            Name = name;
            Enabled = enabled;
            DisabledMessage = disabledMessage;
        }

        public string Name { get; }

        public bool ShowIconOdd
        {
            get
            {
                return gameConfigOdds.Contains(this.Name);
            }
        }

        public string DisplayName => string.IsNullOrWhiteSpace(Name) ? string.Empty : Enumeration.FromValue<GameType>(Name).DisplayName;

        public bool Enabled { get; }

        public bool BotEnabled { get; set; }

        public string BotEnabledDisplay => BotEnabled ? "Yes" : "No";

        public string StatusDisplay => Enabled ? "Yes" : "No";

        public string DisabledMessage { get; }

        public double MinBet { get; set; }

        public double MaxBet { get; set; }

        public bool EnabledHistory => gameEnabledHistory.Contains(Name);

        public bool DisabledShowBot => gameDisabledShowBot.Contains(Name);

        public bool IsNotUseChip => gamesNotUsedChip.Contains(Name);

        public string GameHistoryUrl => gameHistoryUrl.ContainsKey(Name) ? gameHistoryUrl[Name] : string.Empty;

        public List<GameMarketModel> GameMarkets { get; set; }

        public string MinMaxBets()
        {
            var result = string.Empty;
            if (GameMarkets != null)
            {
                var markets = GameMarkets.Select(m => string.Format("{0}: {1}-{2}", m.MarketName, m.MinBet, m.MaxBet)).OrderBy(m => m);
                result = string.Join("</br>", markets);
            }

            return result;
        }

        public string EnabledChips()
        {
            var result = string.Empty;
            if (GameMarkets != null)
            {
                var markets = GameMarkets.Select(m =>
                {
                    var chips = m.EnabledChips.Where(c => c.Enabled).Select(c => c.Label);
                    return chips.Any() ?
                        string.Format("{0}: {1}", m.MarketName, string.Join(", ", chips)) :
                        string.Empty;
                }).OrderBy(m => m);
                result = string.Join("</br>", markets);
            }

            return result;
        }
    }

    public class GameDisableMessage
    {
        public string Name { get; set; }

        public string DisabledMessage { get; set; }
    }

    public class JWTFromGameServer
    {
        public string Token { get; set; }

        public string GameServerEndpoint { get; set; }

        public string Env { get; set; }
    }
}