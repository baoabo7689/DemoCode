using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace GamesAdmin.Site.Features.GameMarket.ViewModels
{
    public class EditViewModel
    {
        public EditViewModel()
        {
            IconSizeOptions = new List<SelectListItem>
            {
                new SelectListItem {Text = IconSize.Small.DisplayName, Value = IconSize.SmallValue},
                new SelectListItem {Text = IconSize.Medium.DisplayName, Value = IconSize.MediumValue},
                new SelectListItem {Text = IconSize.Big.DisplayName, Value = IconSize.BigValue}
            };
        }

        public static IList<string> gamesNotUsedChip = new List<string>
        {

        };

        public bool IsNotUseChip => gamesNotUsedChip.Contains(GameSetting.GameName);

        public GameSettingModel GameSetting { get; set; }

        public bool DisplayBotMaxBetChoices => GameSetting?.BotMaxBetChoices?.Count > 2;

        public string DisplayName => GameSetting == null || string.IsNullOrWhiteSpace(GameSetting.GameName)
            ? string.Empty
            : Enumeration.FromValue<GameType>(GameSetting.GameName).DisplayName;

        public List<SelectListItem> IconSizeOptions { get; set; }
    }
}
