using System;
using System.Collections.Generic;
using System.Linq;
using L1.Features.MemberAuthentications;
using L1.Features.Sites;
using L1.WebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Sentry;
using SignInResult = L1.WebApi.Models.SignInResult;

namespace L1.WebApi.Controllers
{
    [ApiController, Route("[controller]"), Authorize]
    public class SignInController : ControllerBase
    {
        private readonly IMemberAuthService memberAuthService;
        private readonly ISiteDataService siteDataService;
        private static readonly List<string> RestrictedSiteIds = new List<string>{ "733333", "722222", "222223", "222225" };

        public SignInController(IMemberAuthService memberAuthService, ISiteDataService siteDataService)
        {
            this.memberAuthService = memberAuthService;
            this.siteDataService = siteDataService;
        }

        [AllowAnonymous]
        [HttpGet, HttpPost]
        [Route("index")]
        public IActionResult Index(SignIn model)
        {
            if (siteDataService.VerifyClient(model.Auth?.ClientId, model.Auth?.ClientSecret, model.Currency))
            {
                if(!string.IsNullOrWhiteSpace(model.Seq) 
                    && RestrictedSiteIds.Any(id => model.Seq.ToLowerInvariant().EndsWith(id)))
                {
                    return Unauthorized();
                }    

                var ip = model.IP.Split(',').FirstOrDefault()?.Trim();

                var redirectUrl = memberAuthService.SignIn(new MemberAuth
                {
                    Domain = model.Domain,
                    BrowserUserAgent = model.BrowserUserAgent,
                    Currency = model.Currency,
                    IP = ip,
                    MemberId = model.MemberId,
                    MemberName = model.MemberName,
                    Seq = model.Seq,
                    Language = model.Language,
                    SiteId = model.SiteId,
                    ClientId = model.Auth?.ClientId,
                    Location = model.Location,
                    IsCash = model.IsCash,
                    Market = model.Market
                }, model.GameTypeId).RedirectUri.ToString();

                return Ok(new SignInResult { RedirectUrl = redirectUrl });
            }
            else
            {
                SentrySdk.CaptureMessage($"SignIn failed at {DateTime.Now}");
            }

            return Unauthorized();
        }
    }
}