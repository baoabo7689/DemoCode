namespace GamesAdmin.Core.Enumeration
{
    using GamesAdmin.Core.Enumeration.Odds;
    using System.Collections.Generic;
    using System.Linq;

    public static class OddsMapper
    {
        public static IEnumerable<Enumeration> Map(GameType gameType)
        {
            switch (gameType.Value)
            {
                case GameType.SicboValue:
                    return Enumeration.GetAll<SicboOdds>();

                case GameType.BlackjackValue:
                    return Enumeration.GetAll<BlackjackOdds>();
                case GameType.KenoSouthValue:
                case GameType.KenoEastValue:
                case GameType.KenoWestValue:
                case GameType.KenoNorthValue:
                case GameType.KenoMiniValue:
                case GameType.KenoMini2Value:
                case GameType.KenoMaxValue:
                case GameType.KenoMax2Value:
                    return Enumeration.GetAll<MiniKenoOdds>();

                case GameType.FishPrawnCrabProValue:
                    return Enumeration.GetAll<FishPrawnCrabProOdds>();

                case GameType.BigSmallValue:
                case GameType.BigSmallTurboValue:
                    return Enumeration.GetAll<BigSmallOdds>();

                case GameType.OddEvenValue:
                case GameType.OddEvenTurboValue:
                    return Enumeration.GetAll<OddEvenOdds>();

                default: return Enumerable.Empty<Enumeration>();
            }
        }
    }
}