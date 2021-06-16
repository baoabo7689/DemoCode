using GamesAdmin.Database.Attributes;

namespace GamesAdmin.Database.Entities
{
    [BsonCollection("signing_credential_keys")]
    public class SigningCredentialKeyEntity: Document
    {
        public string PrivateKey { get; set; }

        public bool IsMain { get; set; }

        public string KeyId { get; set; }
    }
}