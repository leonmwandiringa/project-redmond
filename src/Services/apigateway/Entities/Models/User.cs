using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api_gateway.Entities.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string id {get; set;}

        [BsonElement("name")]
        public string name { get; set; }

        [BsonElement("organization")]
        public string organization { get; set; }

        [BsonElement("email")]
        public string email { get; set; }

        [BsonElement("username")]
        public string username { get; set; }

        [BsonElement("surname")]
        public string surname { get; set; }

        [BsonElement("password")]
        public string password { get; set; }

        [BsonElement("active")]
        public bool active { get; set; } = true;

    }
}

