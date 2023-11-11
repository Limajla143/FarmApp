using Core;
using Core.Entities.OrderAggregate;

namespace MyAPI.Dtos
{
    public class OrderToReturnDto
    {
        public int Id { get; set; }
        public string Buyer { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderAddress ShipToAddress { get; set; }
        public string DeliveryMethod { get; set; }
        public double ShippingPrice { get; set; }
        public IReadOnlyList<OrderItemDto> OrderItems { get; set; }
        public double Subtotal { get; set; }
        public double Total { get; set; }
        public string OrderStatus { get; set; }
    }
}
