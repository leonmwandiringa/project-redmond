using System;

namespace api_gateway.Helpers
{
    public class Settings
    {
        public string ConnectionString {get; set;}
        public string Database { get; set; }
        public int ExpiresInMinutes { get; set; }
        public string SecretKey { get; set; }
        public string SecurityAlgorithm { get; set; } = SecurityAlgorithms.HmacSha256;
        public string Issuer { get; set; }

    }
}

