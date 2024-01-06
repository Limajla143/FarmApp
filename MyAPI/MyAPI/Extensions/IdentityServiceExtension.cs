using Core;
using Core.Identity;
using Core.Interfaces;
using Infrastructure;
using Infrastructure.Data.Config;
using Infrastructure.Identity;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyAPI.Logger;
using System.Text;

namespace MyAPI.Extensions
{
    public static class IdentityServiceExtension
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services,
           IConfiguration config)
        {

            services.AddDbContext<AppIdentityDbContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("IdentityConnection"));
            });

            services.AddIdentityCore<AppUser>(opt =>
            {
                // add identity options here
               opt.Lockout.MaxFailedAccessAttempts = 5;
               opt.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromSeconds(60);
               opt.User.RequireUniqueEmail = true;
               opt.SignIn.RequireConfirmedEmail = true;
            })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddEntityFrameworkStores<AppIdentityDbContext>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddDefaultTokenProviders();

            services.Configure<SmtpSetting>(config.GetSection("SMTP"));
            services.Configure<TwilioSettings>(config.GetSection("TwilioSettings"));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),
                        ValidIssuer = config["Token:Issuer"],
                        ValidateIssuer = true,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.AddAuthorization();

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddTransient<ISmsSenderService, SmsSenderService>();
            services.AddSingleton<IConfig, Config>();
            services.AddSingleton<ISysLog, SysLog>();

            return services;
        }
    }
}
