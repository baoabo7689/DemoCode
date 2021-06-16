using System;

namespace GamesAdmin.Site.Features.GameSettings.ViewModels
{
    public class UnderMaintenanceViewModel
    {
        public UnderMaintenanceViewModel()
        {
            StartTime = DateTime.Now.ToUniversalTime();
            EndTime = StartTime.AddHours(1);
            IsUM = false;
        }

        public DateTimeOffset StartTime { get; set; }

        public DateTimeOffset EndTime { get; set; }

        public bool IsUM { get; set; }
    }
}
