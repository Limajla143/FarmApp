using Core;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(IBasketRepository basketRepo, IUnitOfWork unitOfWork)
        {

            _basketRepo = basketRepo;
            _unitOfWork = unitOfWork;
        }
        public async Task<Order> CreateOrderAsync(string buyer, int deliveryMethodId, string basketId, OrderAddress shippingAddress)
        {
            var basket = await _basketRepo.GetBasketAsync(basketId);

            // get items from the product repo
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetIdByAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }

            //get delivery method from repo'
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetIdByAsync(deliveryMethodId);

            // calc subtotal
            var subtotal = items.Sum(item => item.Price * item.Quantity);

            // create order
            var order = new Order(items, buyer, shippingAddress, deliveryMethod, subtotal, basket.PaymentIntentId);
            _unitOfWork.Repository<Order>().Add(order);

            // TO DO: save to db
            var result = await _unitOfWork.Complete();

            if (result <= 0) return null;

            // return order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsSpecification(id, buyerEmail);

            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyer)
        {
            var spec = new OrdersWithItemsSpecification(buyer);

            return await _unitOfWork.Repository<Order>().ListSpecAsync(spec);
        }
    }
}
