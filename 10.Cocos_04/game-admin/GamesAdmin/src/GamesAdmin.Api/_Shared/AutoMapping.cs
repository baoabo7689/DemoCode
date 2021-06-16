using AutoMapper;
using GamesAdmin.Core.Models;
using GamesAdmin.Core.Models.Announcement;
using GamesAdmin.Core.Models.BolaTangkas;
using GamesAdmin.Core.Models.Chip;
using GamesAdmin.Database.Entities;
using GamesAdmin.Database.Entities.Announcement;
using GamesAdmin.Database.Entities.BetChip;
using GamesAdmin.Database.Entities.BolaTangkas;
using GamesAdmin.Database.Entities.BolaTangkas.Model;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Linq;

namespace GamesAdmin.Api._Shared
{
    public class AutoMapping : Profile
    {
        public AutoMapping()
        {
            CreateMap<List<ObjectId>, List<string>>().ConvertUsing(o => o.Select(os => os.ToString()).ToList());
            CreateMap<List<string>, List<ObjectId>>().ConvertUsing(o => o.Select(os => ObjectId.Parse(os)).ToList());
            CreateMap<ObjectId, string>().ConvertUsing(o => o.ToString());
            CreateMap<string, ObjectId>().ConvertUsing(s => ObjectId.Parse(s));

            CreateMap<GameConfigEntity, GameConfig>()
                 .ForMember(dest => dest.DisabledRound, opt => opt.MapFrom(src => src.Disabledround));

            CreateMap<GameConfig, GameConfigEntity>();


            CreateMap<StakeConfigModel, StakeConfig>();
            CreateMap<StakeConfig, CombinationConfigModel>();
            CreateMap<CombinationConfigModel, CombinationConfig>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ConfigId));
            CreateMap<CombinationConfig, CombinationConfigModel>()
                .ForMember(dest => dest.ConfigId, opt => opt.MapFrom(src => src.Id));

            CreateMap<BigSmallRoundEntity, Round>();
            CreateMap<BigSmallOnesEntity, BetInfo>();

            CreateMap<User, AdminUserEntity>();

            CreateMap<MarketEntity, Core.Models.Market>();
            CreateMap<Core.Models.Market, MarketEntity>();

            CreateMap<GameSettingModel, GameMarketEntity>();
            CreateMap<GameMarketEntity, GameSettingModel>();

            CreateMap<ChipModel, ChipEntity>();
            CreateMap<ChipEntity, ChipModel>();

            CreateMap<Database.Entities.BetChip.ChipTheme, Core.Models.Chip.ChipTheme>();
            CreateMap<Core.Models.Chip.ChipTheme, Database.Entities.BetChip.ChipTheme>();

            CreateMap<AnnouncementEntity, AnnouncementModel>();
        }
    }
}
