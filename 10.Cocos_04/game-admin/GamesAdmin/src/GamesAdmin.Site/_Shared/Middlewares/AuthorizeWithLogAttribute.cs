using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GamesAdmin.Site._Shared.Middlewares
{
    public class AuthorizeWithLogAttribute : TypeFilterAttribute
    {
        public AuthorizeWithLogAttribute(string Policy) : base(typeof(AuthorizeWithLogFilter))
        {
            Arguments = new object[] { Policy };
        }
    }
}
