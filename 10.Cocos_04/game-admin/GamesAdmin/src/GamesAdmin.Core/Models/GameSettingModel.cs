using GamesAdmin.Core.CustomAttributes;
using GamesAdmin.Core.Enumeration;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace GamesAdmin.Core.Models
{
    public class GameSettingModel : IValidatableObject
    {
        public int GameId { get; set; }

        public string GameName { get; set; }

        public string Name { get; set; }

        [DisplayName("Bot Enabled")]
        public bool BotEnabled { get; set; }

        public bool DisabledShowBot { get; set; }

        public bool EnabledDelayStartTime { get; set; }

        [DisplayName("Delay Start Time")]
        public int DelayStartTime { get; set; }

        [DisplayName("Bot Mininum Bet Limit")]
        public double MinBet { get; set; }

        [DisplayName("Bot Maximum Bet Limit")]
        [DoubleGreaterThanOrEqual("MinBet", ErrorMessage = "Bot MinBet must less than or equal to Bot MaxBet")]
        public double BotMaxBet { get; set; }

        public List<GameMarketModel> GameMarkets { get; set; }

        public List<MaxBetChoice> BotMaxBetChoices { get; set; }

        public List<BetChoiceOdds> BetChoiceOdds { get; set; }

        public bool Success { get; set; }

        public string ErrorMessage { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (GameName != GameType.BolaTangkasValue && (MinBet < 0.01 || MinBet > int.MaxValue))
            {
                yield return new ValidationResult(
                    $"Bot Mininum Bet must between 0.01 and {int.MaxValue}.",
                    new[] { nameof(MinBet) });
            }

            if (GameName != GameType.BolaTangkasValue && (BotMaxBet < 0.01 || BotMaxBet > int.MaxValue))
            {
                yield return new ValidationResult(
                    $"Bot Maximum Bet must between 0.01 and {int.MaxValue}.",
                    new[] { nameof(BotMaxBet) });
            }
        }
    }
}
