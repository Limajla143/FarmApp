using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class UsersSpecs : BaseSpecification<AppUser>
    {
        public UsersSpecs(UsersParam usersParam) : base(x => string.IsNullOrEmpty(usersParam.SearchUser) || x.UserName.ToLower().Contains(usersParam.SearchUser.ToLower()))
        {
            AddInclude(x => x.Address);

            AddOrderBy(x => x.UserName);
        }
    }
}
