using System;
using System.Collections.Generic;
using System.Text;

namespace GamesAdmin.Core.Enumeration
{
    public class BolaTangkasResultType : Enumeration
    {
        public const string NoneValue = "999";
        public const string AcePairValue = "10";
        public const string TwoPairValue = "9";
        public const string ThreeOfAKindValue = "8";
        public const string StraightValue = "7";
        public const string FlushValue = "6";
        public const string FullHouseValue = "5";
        public const string FourOfAKindValue = "4";
        public const string StraightFlushValue = "3";
        public const string FiveOfAKindValue = "2";
        public const string RoyalFlushValue = "1";        

        public static readonly BolaTangkasResultType None = new BolaTangkasResultType(NoneValue, "LOSE");
        public static readonly BolaTangkasResultType AcePair = new BolaTangkasResultType(AcePairValue, "ACE PAIR");
        public static readonly BolaTangkasResultType TwoPair = new BolaTangkasResultType(TwoPairValue, "2 PAIR");
        public static readonly BolaTangkasResultType ThreeOfAKind = new BolaTangkasResultType(ThreeOfAKindValue, "3 OF A KIND");
        public static readonly BolaTangkasResultType Straight = new BolaTangkasResultType(StraightValue, "STRAIGHT");
        public static readonly BolaTangkasResultType Flush = new BolaTangkasResultType(FlushValue, "FLUSH");
        public static readonly BolaTangkasResultType FullHouse = new BolaTangkasResultType(FullHouseValue, "FULL HOUSE");
        public static readonly BolaTangkasResultType FourOfAKind = new BolaTangkasResultType(FourOfAKindValue, "4 OF A KIND");
        public static readonly BolaTangkasResultType StraightFlush = new BolaTangkasResultType(StraightFlushValue, "STR FLUSH");
        public static readonly BolaTangkasResultType FiveOfAKind = new BolaTangkasResultType(FiveOfAKindValue, "5 OF KIND");
        public static readonly BolaTangkasResultType RoyalFlush = new BolaTangkasResultType(RoyalFlushValue, "ROYAL FLUSH");


        public BolaTangkasResultType() { }

        public BolaTangkasResultType(string value, string displayName)
           : base(value, displayName)
        {
        }
    }
}
