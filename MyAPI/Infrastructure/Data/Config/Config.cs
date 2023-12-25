using Core;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Data.Config
{
    public class Config : IConfig
    {
        private readonly IConfiguration _configuration;

        public Config(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public LogInStatus GetLoginStatus(AppUser userInfo, SignInResult? result)
        {
            LogInStatus statusId = new LogInStatus();

            if (userInfo == null)
            {
                statusId = LogInStatus.EmailNotExist;
            }
            else if (!userInfo.IsActive)
            {
                statusId = LogInStatus.Inactive;
            }
            else if (!userInfo.EmailConfirmed)
            {
                statusId = LogInStatus.EmailUnconfirmed;
            }
            //else if (!userInfo.PhoneNumberConfirmed)
            //{
            //    statusId = LogInStatus.MobileNumberUnconfirmed;
            //}
            else if (userInfo.Address == null)
            {
                statusId = LogInStatus.AddressRequired;
            }

            else if(result != null)
            {
                if (result.IsLockedOut)
                {
                    statusId = LogInStatus.Locked;
                }
                else if (result.IsNotAllowed)
                {
                    statusId = LogInStatus.NotAllowed;
                }
                else if (!result.Succeeded)
                {
                    statusId = LogInStatus.FailedAuthentication;
                }
                else 
                {
                    statusId = LogInStatus.Active;
                }
            }
            else
            {
                statusId = LogInStatus.Active;
            }

            return statusId;
        }

        public string SuccessConfirmEmail => _configuration["ClientUrl"] + "/successconfirmemail";
        public string ResetPassword => _configuration["ClientUrl"] + "/resetpassword";
        public string ApiUrlStaticImages => _configuration["ApiUrlStaticImages"] + "/statics";


        // Stripe
        public string AppCurrency => _configuration["StripeSettings:Currency"];

        public string PublishableKey => _configuration["StripeSettings:PublishableKey"];

        public string SecretKey => _configuration["StripeSettings:SecretKey"];

        public string WhSecret => _configuration["StripeSettings:WhSecret"];


        // Cloudinary
        public string CloudName => _configuration["Cloudinary:CloudName"];
        public string ApiKey => _configuration["Cloudinary:ApiKey"];
        public string ApiSecret => _configuration["Cloudinary:ApiSecret"];
        public string TokenKey => _configuration["Token:Key"];
        public string TokenSecret => _configuration["Token:Issuer"];


        // TIMER
        public string RefreshTokenTimer => _configuration["RefreshTokenTimerMinutes"];
        public string IdleTimer => _configuration["IdleTimerMinutes"];
    }
}
