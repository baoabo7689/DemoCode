namespace GamesAdmin.Core.Enumeration
{
    public class IconSize : Enumeration
    {
        public const string SmallValue = "small";
        public const string MediumValue = "medium";
        public const string BigValue = "big";
        
        public static readonly IconSize Small = new IconSize(SmallValue, "Small");
        public static readonly IconSize Medium = new IconSize(MediumValue, "Medium");
        public static readonly IconSize Big = new IconSize(BigValue, "Big");
        
        public IconSize()
        {
        }

        public IconSize(string value, string displayName)
            : base(value, displayName)
        {
        }
    }
}
