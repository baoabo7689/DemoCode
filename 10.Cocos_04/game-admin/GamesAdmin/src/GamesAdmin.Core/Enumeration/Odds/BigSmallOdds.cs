namespace GamesAdmin.Core.Enumeration.Odds
{
    public class BigSmallOdds : Enumeration
    {
        public const string BigValue = "big";
        public const string SmallValue = "small";

        public static readonly BigSmallOdds Big = new BigSmallOdds(BigValue, "Big");
        public static readonly BigSmallOdds Small = new BigSmallOdds(SmallValue, "Small");

        public BigSmallOdds()
        {

        }

        public BigSmallOdds(string value, string displayName)
            : base(value, displayName)
        {

        }
    }
}
