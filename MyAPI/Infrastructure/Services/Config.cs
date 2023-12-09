using Core;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class Config : IConfig
    {
        public LogInStatus GetLoginStatus(AppUser userInfo, SignInResult result)
        {
            LogInStatus statusId = new LogInStatus();

            if (userInfo == null) 
            {
                statusId = LogInStatus.EmailNotExist;   
            }
            else if(!userInfo.IsActive)
            {
                statusId = LogInStatus.Inactive;
            }
            else if(!userInfo.EmailConfirmed)
            {
                statusId = LogInStatus.EmailUnconfirmed;
            }
            //else if (!userInfo.PhoneNumberConfirmed)
            //{
            //    statusId = LogInStatus.MobileNumberUnconfirmed;
            //}
            else if(userInfo.Address == null)
            {
                statusId = LogInStatus.AddressRequired;
            }
            else if(result.IsLockedOut)
            {
                statusId = LogInStatus.Locked;
            }
            else if(result.IsNotAllowed)
            {
                statusId = LogInStatus.NotAllowed;
            }
            else if(!result.Succeeded)
            {
                statusId = LogInStatus.FailedAuthentication;
            }
            else
            {
                statusId = LogInStatus.Active;
            }

            return statusId;
        }


    }
}
