using GamesAdmin.Core.Models.Chip;
using GamesAdmin.Site.Features._Shared;

namespace GamesAdmin.Site.Features.ChipConfig.ViewModels
{
    public class EditViewModel : ViewModelBase
    {
        public ChipModel Data { get; set; }

        public bool IsNew {
            get {
                return Data == null || string.IsNullOrEmpty(Data.Label);
            } 
        }
    }
}
