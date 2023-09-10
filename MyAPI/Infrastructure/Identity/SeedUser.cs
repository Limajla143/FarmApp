using Core;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Identity
{
    public class SeedUser
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    Email = "sample@test.com",
                    UserName = "sample@test.com",
                };

                await userManager.CreateAsync(user, "P@ssw0rd");
            }
        }
    }
}
