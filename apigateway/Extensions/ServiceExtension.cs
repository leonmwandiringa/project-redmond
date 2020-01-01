using api_gateway.Entities.Models;
using api_gateway.Helpers;
using api_gateway.Services;
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

        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddScoped<>(AuthService);
            services.AddScoped<>(CryptoService);
            services.AddScoped<>(JwtService);
            services.AddScoped<>(UserService);

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