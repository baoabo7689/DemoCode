﻿using System.Collections.Generic;
using Newtonsoft.Json;

namespace GamesAdmin.Core.Models
{
    public class GameConfig
    {
        [JsonConstructor]
        public GameConfig(
            string id,
            string name,
            double minBet,
            double maxBet,
            bool enabled,
            bool botEnabled,
            double maxBot,
            int? disabledround,
            double botMinBet,
            double botMaxBet,
            double[] hoursMaxBot,
            string disabledMessage, 
            Dictionary<string, double> maxBetChoices)
        {
            Id = id;
            Name = name;
            MinBet = minBet;
            MaxBet = maxBet;
            Enabled = enabled;
            BotEnabled = botEnabled;
            MaxBot = maxBot;
            DisabledRound = disabledround;
            BotMinBet = botMinBet;
            BotMaxBet = botMaxBet;
            HoursMaxBot = hoursMaxBot;
            DisabledMessage = disabledMessage;
            MaxBetChoices = maxBetChoices;
        }

        public string Id { get; }

        public string Name { get; }

        public bool Enabled { get; }

        public double MinBet { get; }

        public double MaxBet { get; }

        public bool BotEnabled { get; }

        public double MaxBot { get; }

        public int? DisabledRound { get; }

        public double BotMinBet { get; }

        public double BotMaxBet { get; }

        public double[] HoursMaxBot { get; set; }

        public string DisabledMessage { get; }

        public Dictionary<string, double> MaxBetChoices { get; }

        public Dictionary<string, double> Odds { get; set; }

        public List<GameMarketModel> GameMarkets { get; set; }

        public int DelayStartTime { get; set; }
    }
}
