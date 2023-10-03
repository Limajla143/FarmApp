using Core.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IUserRepository
    {
        Task<IReadOnlyList<AppUser>> GetUsersAsync(UsersParam usersParams);
        Task<AppUser> GetUserByIdAsync(int id);
    }
}
