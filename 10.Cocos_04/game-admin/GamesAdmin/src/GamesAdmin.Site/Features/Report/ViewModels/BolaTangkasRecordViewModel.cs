using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.Report.ViewModels
{
    public class BolaTangkasRecordViewModel : RecordViewModel
    {
        public decimal TotalBet { get; set; }
        public List<BolaTangkasCard> BestCombination { get; set; }
        public List<BolaTangkasCard> Cards { get; set; }
        public int ResultType { get; set; }
        public string ResultTypeText
        {
            get {
                var type = Enumeration.FromValue<BolaTangkasResultType>(ResultType.ToString());
                return type.DisplayName;
            }
        }
        public int ColokanCard { get; set; }
        public string ColokanCardText { 
            get {
                var type = Enumeration.FromValue<BolaTangkasCardType>(ColokanCard.ToString());
                return type.DisplayName;
            } 
        }
    }
}
