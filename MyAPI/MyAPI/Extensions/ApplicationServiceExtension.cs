using Core.Interfaces;
using Hangfire;
using Hangfire.Redis.StackExchange;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyAPI.Helpers;
using MyAPI.Middleware.Errors;
using StackExchange.Redis;

namespace MyAPI.Extensions
{
    public static class ApplicationServiceExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {

            services.AddDbContext<EntityDbContext>(x => x.UseSqlServer(config.GetConnectionString("FarmStoreConnection")));

            services.AddSingleton<IConnectionMultiplexer>(c =>
            {
                var options = ConfigurationOptions.Parse(config["RedisSettings:Configuration"]);
                return ConnectionMultiplexer.Connect(options);
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .WithExposedHeaders("WWW-Authenticate", "Pagination")
                        .WithOrigins("http://localhost:3000", "https://localhost:3000");
                });
            });

            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IBasketRepository, BasketRepository>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<ICloudinaryImageService, CloudinaryImageService>();
            services.AddScoped<IFileStorageService, FileStorageService>();
            services.AddSingleton<AutomaticRetryAttribute>();

            // HANGFIRE CONFIGURATION
            services.AddHangfire((provider, configuration) =>
            {
                configuration.UseRedisStorage(config["RedisSettings:Configuration"],
                    new RedisStorageOptions
                    {
                        Prefix = config["RedisSettings:InstanceName"],
                        DeletedListSize = int.Parse(config["HangfireSettings:JobMaxDeletedListLength"]),
                        SucceededListSize = int.Parse(config["HangfireSettings:JobMaxSucceededListLength"]),
                        InvisibilityTimeout = TimeSpan.FromMinutes(int.Parse(config["HangfireSettings:JobInvisibilityTimeoutInMinutes"]))
                    }
                ).WithJobExpirationTimeout(TimeSpan.FromHours(int.Parse(config["HangfireSettings:JobExpirationTimeoutInHours"])));

                configuration.UseFilter(provider.GetRequiredService<AutomaticRetryAttribute>());
                GlobalJobFilters.Filters.Add(new AutomaticRetryAttribute { Attempts = 3 });
            });

            services.AddHangfireServer();


            services.AddAutoMapper(typeof(MappingProfiles).Assembly); // AppDomain.CurrentDomain.GetAssemblies()

            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errors = actionContext.ModelState
                    .Where(e => e.Value.Errors.Count() > 0)
                    .SelectMany(x => x.Value.Errors)
                    .Select(x => x.ErrorMessage).ToArray();

                    var errorResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                    };

                    return new BadRequestObjectResult(errorResponse);
                };
            });


            services.AddHttpContextAccessor();
            return services;

        }
    }
}
