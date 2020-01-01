using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api_gateway.Entities.Models;
using api_gateway.Helpers;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace api_gateway.Services
{
    public class CompanyService
    {
        private readonly IOptions<Settings> _settings;
        private readonly IMongoCollection<Company> _company; 
        public CompanyService(IOptions<Settings> option)
        {
            _settings = option;
            var _db = new MongoClient(_settings.Value.ConnectionString)
                        .GetDatabase(_settings.Value.Database);
            _company = _db.GetCollection<Company>("companies");
        }

        public Company GetCompany(string id)
        {
            return _company.Find<Company>(co => co.id == id).FirstOrDefault();
        }

        public List<Company> GetCompanies()
        {
            return _company.Find<Company>(co => true).ToList();
        }

        public Company CreateCompany(Company company)
        {
            var companyFound = _company.Find<Company>(co => co.email == company.email).FirstOrDefault();
            if (companyFound != null)
            {
                return null;
            }

            _company.InsertOne(company);
            return company;
        }

    }
}
