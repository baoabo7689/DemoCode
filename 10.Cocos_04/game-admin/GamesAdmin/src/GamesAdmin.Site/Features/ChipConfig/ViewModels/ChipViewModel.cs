using GamesAdmin.Core.Models.Chip;
using System;
using System.Drawing;

namespace GamesAdmin.Site.Features.ChipConfig.ViewModels
{
    public class ChipViewModel
    {
        public ChipViewModel(ChipModel chip)
        {
            this.Chip = chip;
            this.TextBackgroundColor = CalculateTextColor(chip.Theme.BackgroundColor);
            this.TextBorderColor = CalculateTextColor(chip.Theme.BorderColor);
            this.TextCenterColor = CalculateTextColor(chip.Theme.CenterColor);
            this.TextLabelColor = CalculateTextColor(chip.Theme.LabelColor);
        }

        public ChipModel Chip { get; set; }
        public string TextBackgroundColor { get; set; }
        public string TextBorderColor { get; set; }
        public string TextCenterColor { get; set; }
        public string TextLabelColor { get; set; }

        public string CalculateTextColor(string value)
        {
            try
            {
                var c = ColorTranslator.FromHtml(value);
                var l = 0.2126 * c.R + 0.7152 * c.G + 0.0722 * c.B;

                return l < 127.5 ? Color.White.Name : Color.Black.Name;
            }
            catch(Exception ex)
            {
                return Color.Black.Name;
            }
        }
    }
}
