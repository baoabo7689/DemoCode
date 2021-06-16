namespace GamesAdmin.Core.Enumeration.Odds
{
    public class MiniKenoOdds : Enumeration
    {
        public const string BigValue = "big";
        public const string SmallValue = "small";
        public const string EvenValue = "even";
        public const string OddValue = "odd";
        public const string EarthValue = "earth";
        public const string FireValue = "fire";
        public const string GoldValue = "gold";
        public const string WaterValue = "water";
        public const string WoodValue = "wood";
        
        public static readonly MiniKenoOdds Big = new MiniKenoOdds(BigValue, "Big");
        public static readonly MiniKenoOdds Small = new MiniKenoOdds(SmallValue, "Small");
        public static readonly MiniKenoOdds Even = new MiniKenoOdds(EvenValue, "Even");
        public static readonly MiniKenoOdds Odd = new MiniKenoOdds(OddValue, "Odd");
        public static readonly MiniKenoOdds Earth = new MiniKenoOdds(EarthValue, "Earth");
        public static readonly MiniKenoOdds Fire = new MiniKenoOdds(FireValue, "Fire");
        public static readonly MiniKenoOdds Gold = new MiniKenoOdds(GoldValue, "Gold");
        public static readonly MiniKenoOdds Water = new MiniKenoOdds(WaterValue, "Water");
        public static readonly MiniKenoOdds Wood = new MiniKenoOdds(WoodValue, "Wood");

        public MiniKenoOdds()
        {
        }

        public MiniKenoOdds(string value, string displayName)
           : base(value, displayName)
        {
        }
    }
}
