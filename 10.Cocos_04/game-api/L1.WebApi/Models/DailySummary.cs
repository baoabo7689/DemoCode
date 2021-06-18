﻿using System;

namespace L1.WebApi.Models
{
    public class DailySummary
    {
        public DateTimeOffset TimeStamp { get; set; }

        public Auth Auth { get; set; }

        public string Seq { get; set; }

        public DateTimeOffset SummarizedDate { get; set; }

        public bool IsCash { get; set; }
    }
}