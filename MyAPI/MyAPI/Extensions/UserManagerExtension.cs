using Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MyAPI.Extensions
{
    public static class UserManagerExtension
    {
        public static async Task<AppUser> FindByEmailFromClaimsPrincipal(this UserManager<AppUser> userManager,
            string email)
        {
            return await userManager.Users.Include(x => x.Address)
                .SingleOrDefaultAsync(x => x.Email.Equals(email));
        }

        public static async Task<AppUser> FindUserByIdAsync(this UserManager<AppUser> userManager, int Id)
        {
            return await userManager.Users.SingleOrDefaultAsync(x => x.Id == Id);
        }

        public static async Task<AppUser> FindUserByClaimsById(this UserManager<AppUser> userManager, int Id)
        {
            return await userManager.Users.Include(x => x.Address)
                .SingleOrDefaultAsync(x => x.Id == Id);
        }

        public static async Task<AppUser> FindUserByClaimsPrincipleWithAddress(this UserManager<AppUser> userManager,
           ClaimsPrincipal user)
        {
            var email = user.FindFirstValue(ClaimTypes.Email);

            return await userManager.Users.Include(x => x.Address)
                .SingleOrDefaultAsync(x => x.Email == email);
        }
    }
}
