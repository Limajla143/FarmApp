using Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MyAPI.Extensions
{
    public static class UserManagerExtension
    {
        public static async Task<AppUser> FindByEmailFromClaimsPrincipal(this UserManager<AppUser> userManager,
            ClaimsPrincipal user)
        {
            return await userManager.Users
                .SingleOrDefaultAsync(x => x.Email == user.FindFirstValue(ClaimTypes.Email));
        }

        public static async Task<AppUser> FindUserByIdAsync(this UserManager<AppUser> userManager, int Id)
        {
            return await userManager.Users.SingleOrDefaultAsync(x => x.Id == Id);
        }

        public static async Task<AppUser> FindUserByClaimsPrincipleWithAddress(this UserManager<AppUser> userManager, int Id)
        {
            return await userManager.Users.Include(x => x.Address)
                .SingleOrDefaultAsync(x => x.Id == Id);
        }
    }
}
