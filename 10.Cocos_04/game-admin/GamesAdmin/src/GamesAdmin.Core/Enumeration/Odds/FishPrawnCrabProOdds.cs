namespace GamesAdmin.Core.Enumeration.Odds
{
    public class FishPrawnCrabProOdds : Enumeration
    {
        public const string EnvironmentValue = "environment";
        public const string OneSymbolValue = "oneSymbol";
        public const string TwoSymbolValue = "twoSymbol";
        public const string ThreeSymbolValue = "threeSymbol";
        public const string SpecificDoubleValue = "specificDouble";
        public const string SpecificTripleValue = "specificTriple";
        public const string AnyTripleValue = "anyTriple";
        public const string PairCombinationValue = "pairCombination";

        public static readonly FishPrawnCrabProOdds Environment = new FishPrawnCrabProOdds(EnvironmentValue, "Environment");
        public static readonly FishPrawnCrabProOdds OneSymbol = new FishPrawnCrabProOdds(OneSymbolValue, "OneSymbol");
        public static readonly FishPrawnCrabProOdds TwoSymbol = new FishPrawnCrabProOdds(TwoSymbolValue, "TwoSymbol");
        public static readonly FishPrawnCrabProOdds ThreeSymbol = new FishPrawnCrabProOdds(ThreeSymbolValue, "ThreeSymbol");
        public static readonly FishPrawnCrabProOdds SpecificDouble = new FishPrawnCrabProOdds(SpecificDoubleValue, "SpecificDouble");
        public static readonly FishPrawnCrabProOdds SpecificTriple = new FishPrawnCrabProOdds(SpecificTripleValue, "SpecificTriple");
        public static readonly FishPrawnCrabProOdds AnyTriple = new FishPrawnCrabProOdds(AnyTripleValue, "AnyTripleValue");
        public static readonly FishPrawnCrabProOdds PairCombination = new FishPrawnCrabProOdds(PairCombinationValue, "PairCombination");

        public FishPrawnCrabProOdds()
        {
        }

        public FishPrawnCrabProOdds(string value, string displayName)
           : base(value, displayName)
        {
        }
    }
}