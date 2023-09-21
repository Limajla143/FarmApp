using Core.Entities;
using Core.Specifiactions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class AgriTypeSpecs : BaseSpecification<AgriType>
    {
        public AgriTypeSpecs(AgriTypeParam agrParams) : base(x => string.IsNullOrEmpty(agrParams.Search) || x.Name.ToLower().Contains(agrParams.Search.ToLower()))
        {
            AddOrderBy(x => x.Name);

            if(!string.IsNullOrEmpty(agrParams.OrderBy))
            {
                switch(agrParams.OrderBy)
                {
                    case "nameAsc":
                        AddOrderBy(a => a.Name);
                        break;
                    case "nameDesc":
                        AddOrderByDescending(a => a.Name);
                        break;
                    default:
                        AddOrderBy(a => a.Name);
                        break;
                }
            }
        }
    }
}
