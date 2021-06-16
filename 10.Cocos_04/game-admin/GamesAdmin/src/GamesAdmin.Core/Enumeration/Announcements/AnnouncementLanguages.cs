namespace GamesAdmin.Core.Enumeration.Announcements
{
    public class AnnouncementLanguage : Enumeration
    {
        public const string IndoValue = "id-ID";
        public const string ThailandValue = "th-TH";
        public const string EnglishValue = "en-US";
        public const string ChineseSimplifiedValue = "zh-CN";
        public const string ChineseTraditionalValue = "zh-TW";


        public static readonly AnnouncementLanguage English = new AnnouncementLanguage(EnglishValue, "English");
        public static readonly AnnouncementLanguage Indonesia = new AnnouncementLanguage(IndoValue, "Indonesia");
        public static readonly AnnouncementLanguage Thailand = new AnnouncementLanguage(ThailandValue, "Thailand");
        public static readonly AnnouncementLanguage ChineseSimplified = new AnnouncementLanguage(ChineseSimplifiedValue, "Chinese Simplified");
        public static readonly AnnouncementLanguage ChineseTraditional = new AnnouncementLanguage(ChineseTraditionalValue, "Chinese Traditional");

        public AnnouncementLanguage() { }

        public AnnouncementLanguage(string value, string displayName)
           : base(value, displayName)
        {
        }
    }
}
