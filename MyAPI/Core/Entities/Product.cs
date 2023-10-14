using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string PictureUrl { get; set; }
        public long Price { get; set; }
        public int SalesTax { get; set; }
        public int AgriTypeId { get; set; }
        public AgriType AgriType { get; set; }
        public int Quantity { get; set; }
    }
}
