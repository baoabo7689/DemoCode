using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.UserInfos
{
    public class UserInfoController : Controller
    {
        private readonly IMediator mediator;

        public UserInfoController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> GetBalance(UserInfoRequest request)
        {
            var user = await mediator.Send(request);

            return Json(new { Result = new { Balance = user.red } });
        }
    }
}
