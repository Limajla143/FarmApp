using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class ProductSpecs : BaseSpecification<Product>
    {
        public ProductSpecs(ProductParams productParams) : base(BuildCriteria(productParams))
        {
            AddInclude(x => x.AgriType);

            if (!string.IsNullOrEmpty(productParams.Sort))
            {
                switch (productParams.Sort)
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

        private static Expression<Func<Product, bool>> BuildCriteria(ProductParams productParams)
        {
            StringComparison comparison = StringComparison.OrdinalIgnoreCase;

            string[] types = new string[0];

            if (!String.IsNullOrEmpty(productParams.Types)) 
            {
                types = productParams.Types.ToLower().Split(",");
            }

            if (productParams.QuantityNotZero)
            {
              return x =>
               (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search.ToLower())) && x.Quantity > 0 &&
                (string.IsNullOrEmpty(productParams.Types) ||
                    types.Contains(x.AgriType.Name.ToLower()));
            }
            else
            {
                return x =>
               (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search.ToLower())) &&
                (string.IsNullOrEmpty(productParams.Types) ||
                    types.Contains(x.AgriType.Name.ToLower()));
            }

            
        }
    }
}
