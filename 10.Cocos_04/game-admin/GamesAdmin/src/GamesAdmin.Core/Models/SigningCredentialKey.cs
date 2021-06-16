namespace GamesAdmin.Core.Models
{
    public class SigningCredentialKey
    {
        public string PrivateKey { get; set; }

        public bool IsMain { get; set; }

        public string KeyId { get; set; }
    }
}