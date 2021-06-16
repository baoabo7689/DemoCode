using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site._Shared.Configurations
{
    public class GameRoundResultSettings
    {
        public string ResultUrl { get; set; }

        public string TicketDetailUrl { get; set; }

        public AuthenticationClients AuthenticationClients { get; set; }

        public string Language { get; set; }
    }

    public class AuthenticationClients
    {
        public string Name { get; set; }

        public string Key { get; set; }        
    }
}
