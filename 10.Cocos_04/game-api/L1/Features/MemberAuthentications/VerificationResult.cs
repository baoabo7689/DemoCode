﻿using L1.Shared.Models;

namespace L1.Features.MemberAuthentications
{
    public class VerificationResult : BaseResult
    {
        public const int TokenNotFoundCode = 100;
        public const int TokenExpiredCode = 101;
        public const int InvalidUserAgentOrIPCode = 103;

        public VerificationResult(int code, string message)
        {
            Code = code;
            Message = message;
        }

        public VerificationResult(
            int code,
            string message,
            int memberId,
            string memberName,
            string siteId,
            string language,
            string currency,
            string seq,
            string clientId,
            string domain,
            bool isCash,
            string market)
            : this(code, message)
        {
            MemberId = memberId;
            MemberName = memberName;
            SiteId = siteId;
            Language = language;
            Currency = currency;
            Seq = seq;
            ClientId = clientId;
            Domain = domain;
            IsCash = isCash;
            Market = market;
        }

        public int MemberId { get; }

        public string MemberName { get; }

        public string SiteId { get; }

        public string ClientId { get; }

        public string Domain { get; }

        public string Language { get; }

        public string Currency { get; }

        public string Seq { get; }

        public bool IsCash { get; }

        public string Market { get; }

        public string MemberKey => $"{ClientId}_{MemberId}";

        public static VerificationResult CreateErrorResponse(int code)
           => new VerificationResult(code, string.Empty);

        public static VerificationResult CreateSuccessResponse(
            int memberId,
            string memberName,
            string siteId,
            string language,
            string currency,
            string seq,
            string clientId,
            string domain,
            bool isCash,
            string market)
            => new VerificationResult(
                SuccessCode,
                string.Empty,
                memberId,
                memberName,
                siteId,
                language,
                currency,
                seq,
                clientId,
                domain,
                isCash,
                market);
    }
}