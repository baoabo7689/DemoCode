namespace GamesAdmin.Core.Extensions
{
    public static class NumberExtensions
    {
        public static string Format2(this decimal number) => string.Format("{0:n2}", number);
        public static string Format1(this decimal number) => string.Format("{0:n1}", number);
        public static string Format0(this int number) => string.Format("{0:n0}", number);
    }
}
