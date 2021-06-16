using GamesAdmin.Core.Models;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.SigningCredentialKeys
{
    public interface ISigningCredentialService
    {
        Task<IEnumerable<SigningCredentialKey>> GetAll();

        Task<bool> Create();

        Task<bool> Update(string keyId, bool isMain, bool needGeneratePrivateKey);
    }

    public class SigningCredentialService : ISigningCredentialService
    {
        private readonly ISigningCredentialApi api;

        public SigningCredentialService(ISigningCredentialApi api)
        {
            this.api = api;
        }

        public Task<bool> Create()
        {
            var keyId = Guid.NewGuid().ToString();

            return Update(keyId, false, true);
        }

        public Task<IEnumerable<SigningCredentialKey>> GetAll() => api.GetAll();

        private static string GeneratePrivateKey()
        {
            using var rsa = RSA.Create(2048);
            var key = rsa.ExportRSAPrivateKey();

            return Convert.ToBase64String(key);
        }

        public async Task<bool> Update(string keyid, bool isMain, bool needGeneratePrivateKey)
        {
            var model = new SigningCredentialKey
            {
                IsMain = isMain,
                PrivateKey = needGeneratePrivateKey ? GeneratePrivateKey() : null,
                KeyId = keyid
            };

            var result = await api.Upsert(model);

            return result;
        }
    }
}