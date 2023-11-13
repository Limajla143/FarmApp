using Core.Entities.OrderAggregate;
using Core.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(string buyerEmail, string basketId, OrderAddress shippingAddress);
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(OrderParams orderParams);
        Task<Order> GetOrderByIdAsync(int id, string buyer);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();
        Task SoftRemoveOrder(int id, string buyer);
    }
}
