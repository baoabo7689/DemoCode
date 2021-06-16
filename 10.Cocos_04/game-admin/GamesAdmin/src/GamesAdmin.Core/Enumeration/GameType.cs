namespace GamesAdmin.Core.Enumeration
{
    public class GameType : Enumeration
    {
        public const string ShakeThePlateValue = "xocxoc";
        public const string DragonTigerValue = "dragontiger";
        public const string BigSmallValue = "taixiu";
        public const string BigSmallTurboValue = "txturbo";
        public const string FishPrawnCrabValue = "baucua";
        public const string OddEvenValue = "oddeven";
        public const string OddEvenTurboValue = "oeturbo";
        public const string KenoProMaxValue = "kenopromax";
        public const string BaccaratValue = "baccarat";
        public const string BolaTangkasValue = "bolatangkas";
        public const string RouletteValue = "roulette";
        public const string SicboValue = "sicbo";
        public const string BlackjackValue = "blackjack";
        public const string KenoMaxValue = "kenomax";
        public const string FishPrawnCrabProValue = "fishprawncrabpro";
        public const string KenoMax2Value = "kenomax2";
        public const string KenoMiniValue = "kenomini";
        public const string KenoMini2Value = "kenomini2";
        public const string KenoEastValue = "kenoeast";
        public const string KenoWestValue = "kenowest";
        public const string KenoSouthValue = "kenosouth";
        public const string KenoNorthValue = "kenonorth";

        public static readonly GameType BigSmall = new GameType(BigSmallValue, "Big Small", GameId.BigSmall);
        public static readonly GameType BigSmallTurbo = new GameType(BigSmallTurboValue, "Turbo Big Small", GameId.BigSmallTurbo);
        public static readonly GameType FishPrawnCrab = new GameType(FishPrawnCrabValue, "Fish Prawn Crab", GameId.FishPrawnCrab);
        public static readonly GameType ShakeThePlate = new GameType(ShakeThePlateValue, "Se Die", GameId.SeDie);
        public static readonly GameType OddEven = new GameType(OddEvenValue, "Odd Even", GameId.OddEven);
        public static readonly GameType OddEvenTurbo = new GameType(OddEvenTurboValue, "Turbo Odd Even", GameId.OddEvenTurbo);
        public static readonly GameType DragonTiger = new GameType(DragonTigerValue, "Dragon Tiger", GameId.DragonTiger);
        public static readonly GameType KenoProMax = new GameType(KenoProMaxValue, "Keno Pro Max", GameId.KenoProMax);
        public static readonly GameType Baccarat = new GameType(BaccaratValue, "Baccarat", GameId.Baccarat);
        public static readonly GameType BolaTangkas = new GameType(BolaTangkasValue, "Bola Tangkas", GameId.BolaTangkas);
        public static readonly GameType Roulette = new GameType(RouletteValue, "Roulette", GameId.Roulette);
        public static readonly GameType Sicbo = new GameType(SicboValue, "Sic Bo", GameId.Sicbo);
        public static readonly GameType Blackjack = new GameType(BlackjackValue, "Blackjack", GameId.Blackjack);
        public static readonly GameType KenoMax = new GameType(KenoMaxValue, "Keno Max", GameId.KenoMax);
        public static readonly GameType FishPrawnCrabPro = new GameType(FishPrawnCrabProValue, "Fish Prawn Crab Pro", GameId.FishPrawnCrabPro);
        public static readonly GameType KenoMax2 = new GameType(KenoMax2Value, "Keno Max2", GameId.KenoMax2);
        public static readonly GameType KenoMini = new GameType(KenoMiniValue, "Keno Mini", GameId.KenoMini);
        public static readonly GameType KenoMini2 = new GameType(KenoMini2Value, "Keno Mini 2", GameId.KenoMini2);
        public static readonly GameType KenoEast = new GameType(KenoEastValue, "Keno East", GameId.KenoEast);
        public static readonly GameType KenoWest = new GameType(KenoWestValue, "Keno West", GameId.KenoWest);
        public static readonly GameType KenoSouth = new GameType(KenoSouthValue, "Keno South", GameId.KenoSouth);
        public static readonly GameType KenoNorth = new GameType(KenoNorthValue, "Keno North", GameId.KenoNorth);


        public GameType()
        {
        }

        public GameType(string value, string displayName, GameId key)
            : base(value, displayName, key)
        {
        }
    }
}