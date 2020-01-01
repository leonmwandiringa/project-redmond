using FluentValidation;
using FootLocker.DAL;
using FootLocker.DAL.Repositories;
using FootLocker.Helpers;
using FootLocker.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using OwaspHeaders.Core.Extensions;
using OwaspHeaders.Core.Models;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Linq;

namespace api_gateway.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                  builder => builder.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials());
            });
        }

        public static void ConfigureSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new Info
                {
                    Version = "v1",
                    Title = "Dopr API Gateway",
                    Description = "Dopr API Gateway"
                });
            });
        }

        public static void ConfigureRepositories(this IServiceCollection services)
        {
            services.AddScoped<RepositoryContext>();
            services.AddScoped<XGPCodeRepository>();
            services.AddScoped<RedeemedCodeRepository>();
            services.AddScoped<JacketCodeRepository>();
            services.AddScoped<GamescomCodeRepository>();
            services.AddScoped<CardCodeRepository>();
        }

        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddScoped<CodesSeederService>();
            services.AddScoped<CampaignService>();
        }

        public static SecureHeadersMiddlewareConfiguration BuildDefaultConfiguration()
        {
            return SecureHeadersMiddlewareBuilder
                .CreateBuilder()
                .UseHsts()
                .UseXFrameOptions()
                .UseXSSProtection()
                .UseContentTypeOptions()
                .UseContentDefaultSecurityPolicy()
                .UsePermittedCrossDomainPolicies()
                .UseReferrerPolicy()
                .RemovePoweredByHeader()
                .Build();
        }

    }
}