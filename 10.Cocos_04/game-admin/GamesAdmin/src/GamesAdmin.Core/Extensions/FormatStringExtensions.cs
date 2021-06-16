using System;
using System.Collections.Generic;
using System.Text;

namespace GamesAdmin.Core.Extensions
{
    public static class FormatStringExtensions
    {
        public static string UppercaseFirst(this string s)
        {
            if (string.IsNullOrEmpty(s))
            {
                return string.Empty;
            }

            return char.ToUpper(s[0]) + s.Substring(1);
        }
    }
}
