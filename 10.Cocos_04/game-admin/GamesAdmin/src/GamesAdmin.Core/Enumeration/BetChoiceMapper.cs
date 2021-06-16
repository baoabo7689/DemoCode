using System.Collections.Generic;
using System.Linq;
using GamesAdmin.Core.Enumeration.BetChoices;

namespace GamesAdmin.Core.Enumeration
{
    public static class BetChoiceMapper
    {
        public static IEnumerable<Enumeration> Map(GameType gameType)
        {
            switch (gameType.Value)
            {
                case GameType.BigSmallValue:
                case GameType.BigSmallTurboValue:
                    return Enumeration.GetAll<BigSmallBetChoice>();

                case GameType.OddEvenValue:
                case GameType.OddEvenTurboValue:
                    return Enumeration.GetAll<OddEvenBetChoice>();

                case GameType.ShakeThePlateValue:
                    return Enumeration.GetAll<ShareThePlateBetChoice>();

                case GameType.FishPrawnCrabValue:
                    return Enumeration.GetAll<FishPrawnCrabBetChoice>();

                case GameType.DragonTigerValue:
                    return Enumeration.GetAll<DragonTigerBetChoice>();

                case GameType.KenoProMaxValue:
                    return Enumeration.GetAll<KenoProMaxBetChoice>();

                case GameType.BaccaratValue:
                    return Enumeration.GetAll<BaccaratBetChoice>();

                case GameType.RouletteValue:
                    return Enumeration.GetAll<RouletteBetChoice>();

                case GameType.SicboValue:
                    return Enumeration.GetAll<SicboBetChoice>();

                case GameType.FishPrawnCrabProValue:
                    return Enumeration.GetAll<FishPrawnCrabProBetChoice>();

                case GameType.KenoMaxValue:
                case GameType.KenoMax2Value:
                case GameType.KenoMiniValue:
                case GameType.KenoMini2Value:
                case GameType.KenoEastValue:
                case GameType.KenoWestValue:
                case GameType.KenoSouthValue:
                case GameType.KenoNorthValue:
                    return Enumeration.GetAll<KenoBetChoice>();

                default: return Enumerable.Empty<Enumeration>();
            }
        }
    }
}