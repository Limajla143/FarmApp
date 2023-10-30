using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        public Order(){}

        public Order(IReadOnlyList<OrderItem> orderItems, string buyer, OrderAddress shippingAddress,
            DeliveryMethod deliveryMethod, double subtotal)
        {
            Buyer = buyer;
            ShipToAddress = shippingAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = orderItems;
            Subtotal = subtotal;
        }

        public string Buyer { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public OrderAddress ShipToAddress { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public double Subtotal { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public double GetTotal()
        {
            return Subtotal + DeliveryMethod.Price;
        }
    }
}
