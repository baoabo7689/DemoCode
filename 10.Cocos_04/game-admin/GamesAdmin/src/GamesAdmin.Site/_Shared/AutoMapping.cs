﻿using AutoMapper;
using GamesAdmin.Core.Models;
using GamesAdmin.Site.Features.Dashboard.ViewModels;
using GamesAdmin.Site.Features.GameSettings.ViewModels;

namespace GamesAdmin.Site._Shared
{
    public class AutoMapping : Profile
    {
        public AutoMapping()
        {
            CreateMap<GameConfig, Features.GameSettings.ViewModels.EditViewModel>();
            CreateMap<GameConfig, StatusItemViewModel>();
            CreateMap<OnlineUser, OnlineUserViewModel>();
            CreateMap<BotUser, BotUserViewModel>();
            CreateMap<Market, Features.Market.ViewModels.EditViewModel>();
            CreateMap<Market, Features.Market.ViewModels.EditViewModel>().ForMember(x=>x.Currencies,opt=>opt.MapFrom(src=>string.Join(", ",src.Currencies)));
        }
    }
}
