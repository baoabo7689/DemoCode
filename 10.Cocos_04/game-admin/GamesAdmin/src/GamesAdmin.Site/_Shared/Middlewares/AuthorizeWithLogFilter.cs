using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Sentry;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace GamesAdmin.Site._Shared.Middlewares
{
    public class AuthorizeWithLogFilter : IAsyncAuthorizationFilter
    {
        private readonly IAuthorizationService authorization;
        public string Policy { get; private set; }
        private readonly ISentryClient sentryClient;

        public AuthorizeWithLogFilter(string policy, IAuthorizationService authorization, ISentryClient sentryClient)
        {
            this.Policy = policy;
            this.authorization = authorization;
            this.sentryClient = sentryClient;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var authorized = await authorization.AuthorizeAsync(context.HttpContext.User, Policy);
            if (!authorized.Succeeded)
            {
                var descriptor = context?.ActionDescriptor as ControllerActionDescriptor;
                var action = string.Format("{0}/{1}", descriptor.ControllerName, descriptor.ActionName);                
                var identity = context.HttpContext.User.Identity as ClaimsIdentity;
                var userName = identity.Claims.Any() ? identity.Claims.First().Value : string.Empty;
                sentryClient.CaptureMessage(string.Format("Game Admin Unauthorized Action: {0}, User: {1}", action, userName), Sentry.Protocol.SentryLevel.Error);
                context.Result = new ForbidResult();
                return;
            }
        }
    }
}