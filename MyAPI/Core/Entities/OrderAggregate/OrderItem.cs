using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class OrderItem : BaseEntity
    {
        public OrderItem(){}

        public OrderItem(ProductItemOrdered itemOrdered, double price, int quatity)
        {
            ItemOrdered = itemOrdered;
            Price = price;
            Quantity = quatity;
        }

        public ProductItemOrdered ItemOrdered { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
    }
}
