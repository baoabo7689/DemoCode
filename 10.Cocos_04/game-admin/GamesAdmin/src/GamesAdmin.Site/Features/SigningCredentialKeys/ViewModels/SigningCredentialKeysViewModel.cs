using GamesAdmin.Core.Models;

namespace GamesAdmin.Site.Features.SigningCredentialKeys.ViewModels
{
    public class SigningCredentialKeysViewModel
    {
        public SigningCredentialKey Model { get; set; }

        public SigningCredentialKeysViewModel(SigningCredentialKey model)
        {
            Model = model;
        }
    }
}