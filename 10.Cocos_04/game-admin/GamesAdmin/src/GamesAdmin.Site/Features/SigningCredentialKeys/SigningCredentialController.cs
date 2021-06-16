using GamesAdmin.Site._Shared.Middlewares;
using GamesAdmin.Site.Features.SigningCredentialKeys.Requests;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.SigningCredentialKeys
{
    [AuthorizeWithLog(Policy: "admin")]
    public class SigningCredentialController : Controller
    {
        private readonly IMediator mediator;

        public SigningCredentialController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var result = await mediator.Send(new GetAllRequest());

            return View(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNew()
        {
            var result = await mediator.Send(new CreateNewKeyRequest());

            return Json(result);
        }

        [HttpPost]
        public async Task<IActionResult> Generate([Bind] GenerateNewKey request)
        {
            var result = await mediator.Send(request);

            return Json(result);
        }

        [HttpPost]
        public async Task<IActionResult> ChangeStatus([Bind] ChangeStatusRequest request)
        {
            var result = await mediator.Send(request);

            return Json(result);
        }
    }
}