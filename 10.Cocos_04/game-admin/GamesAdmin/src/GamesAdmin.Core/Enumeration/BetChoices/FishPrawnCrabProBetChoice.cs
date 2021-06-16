namespace GamesAdmin.Core.Enumeration.BetChoices
{
    public class FishPrawnCrabProBetChoice : Enumeration
    {
        public const string EnvironmentValue = "environment";
        public const string SpecificSymbolValue = "singleSymbol";
        public const string SpecificDoubleValue = "specificDouble";
        public const string SpecificTripleValue = "specificTriple";
        public const string AnyTripleValue = "anyTriple";
        public const string PairCombinationValue = "pairCombination";

        public static readonly FishPrawnCrabProBetChoice Environment = new FishPrawnCrabProBetChoice(EnvironmentValue, "Environment");
        public static readonly FishPrawnCrabProBetChoice SpecificDouble = new FishPrawnCrabProBetChoice(SpecificDoubleValue, "Specific Double");
        public static readonly FishPrawnCrabProBetChoice SingleSymbol = new FishPrawnCrabProBetChoice(SpecificSymbolValue, "Specific Symbol");
        public static readonly FishPrawnCrabProBetChoice SpecificTriple = new FishPrawnCrabProBetChoice(SpecificTripleValue, "Specific Triple");
        public static readonly FishPrawnCrabProBetChoice AnyTriple = new FishPrawnCrabProBetChoice(AnyTripleValue, "Any Triple");
        public static readonly FishPrawnCrabProBetChoice PairCombination = new FishPrawnCrabProBetChoice(PairCombinationValue, "Pair Combination");

        public FishPrawnCrabProBetChoice() { }

        public FishPrawnCrabProBetChoice(string value, string displayName)
           : base(value, displayName)
        {
        }
    }
}
