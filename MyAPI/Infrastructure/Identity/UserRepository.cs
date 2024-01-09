using Core;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Identity
{
    public class UserRepository : IUserRepository
    {
        private readonly AppIdentityDbContext _context;

        public UserRepository(AppIdentityDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<AppUser>> GetUsersAsync(UsersParam usersParams)
        {
            return await _context.Users.Where(x => string.IsNullOrEmpty(usersParams.SearchUser) || 
                x.UserName.ToLower().Contains(usersParams.SearchUser.ToLower()))
                .Include(x => x.Address).Include(x => x.UserRoles).ThenInclude(x => x.Role)
                .OrderBy(x => x.UserName).ToListAsync();  
        }
        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.Include(x => x.Address).FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
