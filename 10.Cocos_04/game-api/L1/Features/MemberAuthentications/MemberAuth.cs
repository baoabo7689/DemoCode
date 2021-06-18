﻿using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace L1.Features.MemberAuthentications
{
    public class MemberAuth
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string IP { get; set; }

        public string Domain { get; set; }

        public string BrowserUserAgent { get; set; }

        public string Token { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime Time { get; set; }

        public string Language { get; set; }

        public int MemberId { get; set; }

        public string MemberName { get; set; }

        public string SiteId { get; set; }

        public string Currency { get; set; }

        public string Seq { get; set; }

        public string ClientId { get; set; }

        public string Location { get; set; }

        public bool IsCash { get; set; }

        public string Market { get; set; }
    }
}