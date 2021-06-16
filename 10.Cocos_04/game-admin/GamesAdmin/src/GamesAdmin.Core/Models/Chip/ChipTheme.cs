using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace GamesAdmin.Core.Models.Chip
{
    public class ChipTheme
    {
        [DisplayName("Background Color")]
        public string BackgroundColor { get; set; }

        [DisplayName("Border Color")]
        public string BorderColor { get; set; }

        [DisplayName("Center Color")]
        public string CenterColor { get; set; }

        [DisplayName("Label Color")]
        public string LabelColor { get; set; }
    }
}
