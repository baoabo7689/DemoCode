using GamesAdmin.Api.GameMarket;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace GameAdmin.API.Test
{
    public class GameMarketTests
    {

        private GameMarketController controller;
        private Mock<IMediator> mediator;


        [Fact]
        public void GetMarketName_Return_Status()
        {
            mediator = new Mock<IMediator>();

            controller = new GameMarketController(mediator.Object);

            var actualResult = controller.Get("test");

            var result = actualResult.Result as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void UpdateMarketGame_Return_False()
        {
            mediator = new Mock<IMediator>();

            controller = new GameMarketController(mediator.Object);

            var actualResult = controller.Update(new GamesAdmin.Core.Models.GameSettingModel());

            Assert.False(actualResult.Result);
        }
    }
}
