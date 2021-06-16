namespace GamesAdmin.Core.Enumeration.BetChoices
{
    public class RouletteBetChoice : Enumeration
    {
        public const string BigSmallValue = "bigSmall";
        public const string OddEvenValue = "oddEven";
        public const string RedBlackValue = "redBlack";
        public const string DozenValue = "dozen";
        public const string ColumnValue = "column";
        public const string LineValue = "line";
        public const string FourNumbersValue = "fourNumbers";
        public const string CornerValue = "corner";
        public const string TriangleValue = "triangle";
        public const string StreetValue = "street";
        public const string SplitValue = "split";
        public const string StraightUpValue = "straightUp";

        public static readonly RouletteBetChoice BigSmall = new RouletteBetChoice(BigSmallValue, "BigSmall");
        public static readonly RouletteBetChoice OddEven = new RouletteBetChoice(OddEvenValue, "OddEven");
        public static readonly RouletteBetChoice RedBlack = new RouletteBetChoice(RedBlackValue, "RedBlack");
        public static readonly RouletteBetChoice Dozen = new RouletteBetChoice(DozenValue, "Dozen");
        public static readonly RouletteBetChoice Column = new RouletteBetChoice(ColumnValue, "Column");
        public static readonly RouletteBetChoice Line = new RouletteBetChoice(LineValue, "Line");
        public static readonly RouletteBetChoice FourNumbers = new RouletteBetChoice(FourNumbersValue, "FourNumbers");
        public static readonly RouletteBetChoice Corner = new RouletteBetChoice(CornerValue, "Corner");
        public static readonly RouletteBetChoice Triangle = new RouletteBetChoice(TriangleValue, "Triangle");
        public static readonly RouletteBetChoice Street = new RouletteBetChoice(StreetValue, "Street");
        public static readonly RouletteBetChoice Split = new RouletteBetChoice(SplitValue, "Split");
        public static readonly RouletteBetChoice StraightUp = new RouletteBetChoice(StraightUpValue, "StraghtUp");

        public RouletteBetChoice()
        {
        }

        public RouletteBetChoice(string value, string displayName)
           : base(value, displayName)
        {
        }
    }
}