using Core.Specifiactions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class UsersParam : PaginationParams
    {
        public string SearchUser { get; set; }
    }
}
