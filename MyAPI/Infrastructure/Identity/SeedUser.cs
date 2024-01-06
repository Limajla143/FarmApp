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
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
            };

            if(!roleManager.Roles.Any())
            {
                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
            }          

            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    Email = "sample@test.com",
                    UserName = "sample",
                    Gender = "Lgbtq",
                    DateOfBirth = new DateTime(1990, 01, 01),
                    IsActive = true,
                    EmailConfirmed = true,
                    Photo = "vsxu1zzd7gwe9gamaivy",
                    PublicId = "vsxu1zzd7gwe9gamaivy",
                    Address = new Address
                    {
                        FirstName = "Sample",
                        LastName = "SuperSample",
                        Street = "10 The street",
                        City = "New York",
                        State = "NY",
                        ZipCode = "90210"
                    }
                };

                await userManager.CreateAsync(user, "P@ssw0rd");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new AppUser
                {
                    UserName = "admin",
                    Email = "admin@test.com",
                    Gender = "System",
                    DateOfBirth = DateTime.Now,
                    IsActive = true,
                    EmailConfirmed = true,
                    Photo = "xgzqg1ynfbvlmpo6l1tl",
                    PublicId = "xgzqg1ynfbvlmpo6l1tl",
                    Address = new Address
                    {
                        FirstName = "Admin",
                        LastName = "Admin",
                        Street = "Top",
                        City = "The World",
                        State = "ARCTIC",
                        ZipCode = "00001"
                    }
                };

                await userManager.CreateAsync(admin, "P@ssw0rd");
                await userManager.AddToRolesAsync(admin, new[] { "Member", "Moderator", "Admin" });
            }
        }
    }
}
