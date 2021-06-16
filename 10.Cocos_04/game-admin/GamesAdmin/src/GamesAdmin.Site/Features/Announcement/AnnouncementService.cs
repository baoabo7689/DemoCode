using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GamesAdmin.Core.Models.Announcement;
using GamesAdmin.Site.Features.Announcement.Requests;
using GamesAdmin.Site.Features.Market;

namespace GamesAdmin.Site.Features.Announcement
{
    public interface IAnnouncementService
    {
        Task<IEnumerable<AnnouncementModel>> GetReport(GetReportRequest model);

        Task<AnnouncementModel> Get(GetEditRequest model);

        Task<bool> Edit(EditRequest model);

        Task<bool> UpdateStatus(UpdateStatusRequest request);
    }

    public class AnnouncementService : IAnnouncementService
    {
        private readonly IAnnouncementApi anouncementApi;
        private readonly IMarketServiceApi marketServiceApi;

        public AnnouncementService(IAnnouncementApi anouncementAPI, IMarketServiceApi marketServiceApi)
        {
            this.anouncementApi = anouncementAPI;
            this.marketServiceApi = marketServiceApi;
        }

        public async Task<bool> Edit(EditRequest model)
        {
            return await anouncementApi.Upsert(model.Model);
        }

        public async Task<AnnouncementModel> Get(GetEditRequest model)
        {
            var result =  await anouncementApi.GetById(model.Id);
            MigrateLanguages(result.Contents);
            return result;
        }

        public async Task<IEnumerable<AnnouncementModel>> GetReport(GetReportRequest model)
        {
            bool? status = null;

            if(model.Status != "0")
            {
                status = model.Status == "1" ? true : false;
            }

            var data = await anouncementApi.GetAll(model.MessageType, model.Market, status);
            var markets = marketServiceApi.GetAll().Result.ToList();

            var result = data.ToList();

            result.ForEach(record =>
            {
                record.EnabledMarkets = record.EnabledMarkets.Select(enabledMarket => markets.Find(market => market.Id == enabledMarket).Name).ToList();
                MigrateLanguages(record.Contents);
            });

            return result;
        }

        private void MigrateLanguages(Dictionary<string, string> contents) {
            var languageMap = new Dictionary<string, string> {{ "en", "en-US" },{ "th", "th-TH" },{ "id", "id-ID" }};
            foreach (KeyValuePair<string, string> entry in languageMap) {
                UpdateKey(contents, entry.Key, entry.Value);
            }
        }

        private void UpdateKey(Dictionary<string, string> contents,  string oldKey, string newKey)
        {
            if (contents.ContainsKey(oldKey) && contents.ContainsKey(newKey))
            {
                contents[newKey] = contents[oldKey];
                contents.Remove(oldKey);
            }
        }

        public async Task<bool> UpdateStatus(UpdateStatusRequest request)
        {
            return await anouncementApi.UpdateStatus(request.Id, request.Status);
        }
    }
}