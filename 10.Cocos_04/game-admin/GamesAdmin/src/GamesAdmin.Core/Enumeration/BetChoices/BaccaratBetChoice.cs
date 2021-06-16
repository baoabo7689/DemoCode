namespace GamesAdmin.Core.Enumeration.BetChoices
{
    public class BaccaratBetChoice : Enumeration
    {
        public const string PlayerValue = "player";
        public const string BankerValue = "banker";
        public const string TieValue = "tie";
        public const string BigValue = "big";
        public const string SmallValue = "small";
        public const string PlayerPairValue = "playerPair";
        public const string BankerPairValue = "bankerPair";

        public static readonly BaccaratBetChoice Player = new BaccaratBetChoice(PlayerValue, "Player");
        public static readonly BaccaratBetChoice Banker = new BaccaratBetChoice(BankerValue, "Banker");
        public static readonly BaccaratBetChoice Tie = new BaccaratBetChoice(TieValue, "Tie");
        public static readonly BaccaratBetChoice Big = new BaccaratBetChoice(BigValue, "Big");
        public static readonly BaccaratBetChoice Small = new BaccaratBetChoice(SmallValue, "Small");
        public static readonly BaccaratBetChoice PlayerPair = new BaccaratBetChoice(PlayerPairValue, "PlayerPair");
        public static readonly BaccaratBetChoice BankerPair = new BaccaratBetChoice(BankerPairValue, "BankerPair");

        public BaccaratBetChoice() { }

        public BaccaratBetChoice(string value, string displayName)
           : base(value, displayName)
        {
        }
    }
}
