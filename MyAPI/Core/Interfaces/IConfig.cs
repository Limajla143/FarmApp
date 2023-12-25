using Core.Entities;
using Microsoft.AspNetCore.Identity;


namespace Core.Interfaces
{
    public interface IConfig
    {
        LogInStatus GetLoginStatus(AppUser userInfo, SignInResult? result);

        //Static URLS
        string SuccessConfirmEmail { get; }
        string ResetPassword { get; }
        string ApiUrlStaticImages { get; }

        //Stripe
        string AppCurrency { get;  }
        string PublishableKey { get; }
        string SecretKey { get; }
        string WhSecret { get; }

        //Cloudinary
        string CloudName { get; }
        string ApiKey { get; }
        string ApiSecret { get; }

        //Token
        string TokenKey { get; }
        string TokenSecret { get; }
        string RefreshTokenTimer { get; }
        string IdleTimer { get; }
    }
}
