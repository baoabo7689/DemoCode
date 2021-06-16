namespace GamesAdmin.Core.Enumeration.BetChoices
{
    public class SicboBetChoice : Enumeration
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
        public const string SingleDiceValue = "singleDice";

        public static readonly SicboBetChoice BigSmall = new SicboBetChoice(BigSmallValue, "BigSmall");
        public static readonly SicboBetChoice OddEven = new SicboBetChoice(OddEvenValue, "OddEven");
        public static readonly SicboBetChoice AnyTriple = new SicboBetChoice(AnyTripleValue, "Any Triple");
        public static readonly SicboBetChoice SpecificTriple = new SicboBetChoice(SpecificTripleValue, "Specific Triple");
        public static readonly SicboBetChoice SpecificDouble = new SicboBetChoice(SpecificDoubleValue, "Specific Double");
        public static readonly SicboBetChoice TotalPointGroupOne = new SicboBetChoice(TotalPointGroupOneValue, "Total Point [4][17]");
        public static readonly SicboBetChoice TotalPointGroupTwo = new SicboBetChoice(TotalPointGroupTwoValue, "Total Point [5][16]");
        public static readonly SicboBetChoice TotalPointGroupTree = new SicboBetChoice(TotalPointGroupThreeValue, "Total Point [6][15]");
        public static readonly SicboBetChoice TotalPointGroupFour = new SicboBetChoice(TotalPointGroupFourValue, "Total Point [7][14]");
        public static readonly SicboBetChoice TotalPointGroupFive = new SicboBetChoice(TotalPointGroupFiveValue, "Total Point [8][13]");
        public static readonly SicboBetChoice TotalPointGroupSix = new SicboBetChoice(TotalPointGroupSixValue, "Total Point [9][10]");
        public static readonly SicboBetChoice TotalPointGroupSeven = new SicboBetChoice(TotalPointGroupSevenValue, "Total Point [11][12]");
        public static readonly SicboBetChoice DiceCombination = new SicboBetChoice(DiceCombinationValue, "Dice Combination");
        public static readonly SicboBetChoice SingleDice = new SicboBetChoice(SingleDiceValue, "Single Dice");

        public SicboBetChoice()
        {
        }

        public SicboBetChoice(string value, string displayName)
           : base(value, displayName)
        {
        }
    }
}