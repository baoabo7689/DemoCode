using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaReport.Requests
{
    public class EditRequest : IRequest<bool>
    {
        public EditRequest(bool enabled, int tableIndex)
        {
            IsEnabled = enabled;
            TableIndex = tableIndex;
        }

        public bool IsEnabled { get; set; }
        public int TableIndex { get; set; }
    }
}
