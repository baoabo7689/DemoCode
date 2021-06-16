using System;
using System.Collections.Generic;
using System.Text;

namespace GamesAdmin.Core.Enumeration
{
    public class BolaTangkasCardType : Enumeration
    {
        public const string AceValue = "0";
        public const string TwoValue = "1";
        public const string ThreeValue = "2";
        public const string FourValue = "3";
        public const string FiveValue = "4";
        public const string SixValue = "5";
        public const string SevenValue = "6";
        public const string EightValue = "7";
        public const string NineValue = "8";
        public const string TenValue = "9";
        public const string JackValue = "10";
        public const string QueenValue = "11";
        public const string KingValue = "12";

        public static readonly BolaTangkasCardType Ace = new BolaTangkasCardType(AceValue, "A");
        public static readonly BolaTangkasCardType Two = new BolaTangkasCardType(TwoValue, "2");
        public static readonly BolaTangkasCardType Three = new BolaTangkasCardType(ThreeValue, "3");
        public static readonly BolaTangkasCardType Four = new BolaTangkasCardType(FourValue, "4");
        public static readonly BolaTangkasCardType Five = new BolaTangkasCardType(FiveValue, "5");
        public static readonly BolaTangkasCardType Six = new BolaTangkasCardType(SixValue, "6");
        public static readonly BolaTangkasCardType Seven = new BolaTangkasCardType(SevenValue, "7");
        public static readonly BolaTangkasCardType Eight = new BolaTangkasCardType(EightValue, "8");
        public static readonly BolaTangkasCardType Nine = new BolaTangkasCardType(NineValue, "9");
        public static readonly BolaTangkasCardType Ten = new BolaTangkasCardType(TenValue, "10");
        public static readonly BolaTangkasCardType Jack = new BolaTangkasCardType(JackValue, "J");
        public static readonly BolaTangkasCardType Queen = new BolaTangkasCardType(QueenValue, "Q");
        public static readonly BolaTangkasCardType King = new BolaTangkasCardType(KingValue, "K");

        public BolaTangkasCardType() { }

        public BolaTangkasCardType(string value, string displayName)
           : base(value, displayName)
        {
        }
    }
}