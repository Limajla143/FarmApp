using Core.Entities.OrderAggregate;
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
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyer);
        Task<Order> GetOrderByIdAsync(int id, string buyer);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();
    }
}
