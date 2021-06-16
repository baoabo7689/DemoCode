namespace GamesAdmin.Core.Enumeration.Odds
{
    public class BlackjackOdds : Enumeration
    {
        public const string BlackjackValue = "blackjack";
        public const string RegularValue = "regular";

        public static readonly BlackjackOdds Blackjack = new BlackjackOdds(BlackjackValue, "Blackjack");
        public static readonly BlackjackOdds Regular = new BlackjackOdds(RegularValue, "Regular");

        public BlackjackOdds()
        {
        }

        public BlackjackOdds(string value, string displayName)
           : base(value, displayName)
        {
        }
    }
}
