using System;

namespace GamesAdmin.Database
{
    public class UserInfoEntity
    {
        public int UID { get; set; }
        public int __v { get; set; }
        public string avatar { get; set; }
        public int avatarId { get; set; }

        public string cmt { get; set; }
        public string currency { get; set; }
        public string email { get; set; }

        public decimal hu { get; set; }
        public decimal huXu { get; set; }

        public bool inRoom { get; set; }
        public bool isCash { get; set; }
        public DateTime joinedOn { get; set; }

        public decimal ketSat { get; set; }
        public decimal lastVip { get; set; }
        public bool otpFirst { get; set; }

        public decimal redLost { get; set; }
        public decimal redPlay { get; set; }
        public decimal redWin { get; set; }
        public decimal red { get; set; }
        public decimal thuong { get; set; }
        public bool type { get; set; }

        public object security { get; set; }
        public string name { get; set; }
        public string Id { get; set; }
    }
}
