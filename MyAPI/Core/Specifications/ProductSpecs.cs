using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class ProductSpecs : BaseSpecification<Product>
    {
        public ProductSpecs(ProductParams productParams) : base(x => (string.IsNullOrEmpty(productParams.Search) || 
        x.Name.ToLower().Contains(productParams.Search)) && 
        (!productParams.AgriTypeId.HasValue || x.AgriTypeId == productParams.AgriTypeId))
        {
            AddInclude(x => x.AgriType);

            if(!string.IsNullOrEmpty(productParams.Sort))
            {
                switch(productParams.Sort)
                {
                    case "priceAsc":
                        AddOrderBy(x => x.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(x => x.Price);
                        break;
                    default:
                        AddOrderBy(x => x.Name);
                        break;

                }
            }
        }

        public ProductSpecs(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.AgriType);
        }
    }
}
