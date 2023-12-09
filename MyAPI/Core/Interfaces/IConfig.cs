using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public enum LogInStatus
    {
        EmailNotExist = 0,
        Active = 1,
        Inactive = 2,
        EmailUnconfirmed = 3,
        MobileNumberUnconfirmed = 4,
        AddressRequired = 5,
        Locked = 6,
        NotAllowed = 7,
        FailedAuthentication = 8

    }
    public interface IConfig
    {
        LogInStatus GetLoginStatus(AppUser userInfo, SignInResult result);
    }
}
