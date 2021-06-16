namespace GamesAdmin.Core.Enumeration.Odds
{
    public class SicboOdds : Enumeration
    {
        public const string BigSmallValue = "bigSmall";
        public const string OddEvenValue = "oddEven";
        public const string AnyTripleValue = "anyTriple";
        public const string SpecificTripleValue = "specificTriple";
        public const string SpecificDoubleValue = "specificDouble";
        public const string TotalPointGroupOneValue = "totalPoint_4_17";
        public const string TotalPointGroupTwoValue = "totalPoint_5_16";
        public const string TotalPointGroupThreeValue = "totalPoint_6_15";
        public const string TotalPointGroupFourValue = "totalPoint_7_14";
        public const string TotalPointGroupFiveValue = "totalPoint_8_13";
        public const string TotalPointGroupSixValue = "totalPoint_9_12";
        public const string TotalPointGroupSevenValue = "totalPoint_10_11";
        public const string DiceCombinationValue = "diceCombination";
        public const string SingleDiceOneValue = "singleDice_1";
        public const string SingleDiceTwoValue = "singleDice_2";
        public const string SingleDiceThreeValue = "singleDice_3";


        public static readonly SicboOdds BigSmall = new SicboOdds(BigSmallValue, "BigSmall");
        public static readonly SicboOdds OddEven = new SicboOdds(OddEvenValue, "OddEven");
        public static readonly SicboOdds AnyTriple = new SicboOdds(AnyTripleValue, "Any Triple");
        public static readonly SicboOdds SpecificTriple = new SicboOdds(SpecificTripleValue, "Specific Triple");
        public static readonly SicboOdds SpecificDouble = new SicboOdds(SpecificDoubleValue, "Specific Double");
        public static readonly SicboOdds TotalPointGroupOne = new SicboOdds(TotalPointGroupOneValue, "Total Point [4][17]");
        public static readonly SicboOdds TotalPointGroupTwo = new SicboOdds(TotalPointGroupTwoValue, "Total Point [5][16]");
        public static readonly SicboOdds TotalPointGroupTree = new SicboOdds(TotalPointGroupThreeValue, "Total Point [6][15]");
        public static readonly SicboOdds TotalPointGroupFour = new SicboOdds(TotalPointGroupFourValue, "Total Point [7][14]");
        public static readonly SicboOdds TotalPointGroupFive = new SicboOdds(TotalPointGroupFiveValue, "Total Point [8][13]");
        public static readonly SicboOdds TotalPointGroupSix = new SicboOdds(TotalPointGroupSixValue, "Total Point [9][10]");
        public static readonly SicboOdds TotalPointGroupSeven = new SicboOdds(TotalPointGroupSevenValue, "Total Point [11][12]");
        public static readonly SicboOdds DiceCombination = new SicboOdds(DiceCombinationValue, "Dice Combination");
        public static readonly SicboOdds SingleDiceOne = new SicboOdds(SingleDiceOneValue, "Single Dice - One");
        public static readonly SicboOdds SingleDiceTwo = new SicboOdds(SingleDiceTwoValue, "Single Dice - Two");
        public static readonly SicboOdds SingleDiceThree = new SicboOdds(SingleDiceThreeValue, "Single Dice - Tree");


        public SicboOdds()
        {
        }

        public SicboOdds(string value, string displayName)
           : base(value, displayName)
        {
        }
    }
}
