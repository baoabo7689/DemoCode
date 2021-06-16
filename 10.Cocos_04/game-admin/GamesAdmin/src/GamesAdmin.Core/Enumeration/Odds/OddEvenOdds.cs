namespace GamesAdmin.Core.Enumeration.Odds
{
    public class OddEvenOdds : Enumeration
    {
        public const string EvenValue = "even";
        public const string OddValue = "odd";

        public static readonly OddEvenOdds Even = new OddEvenOdds(EvenValue, "even");
        public static readonly OddEvenOdds Odd = new OddEvenOdds(OddValue, "Odd");

        public OddEvenOdds()
        {
        }

        public OddEvenOdds(string value, string displayName) 
            : base(value, displayName)
        {

        }
    }
}
