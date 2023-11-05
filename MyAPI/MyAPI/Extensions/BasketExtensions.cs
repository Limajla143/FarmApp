using Microsoft.EntityFrameworkCore;
using MyAPI.Dtos;
using Core.Entities;

namespace MyAPI.Extensions
{
    public static class BasketExtensions
    {
        public static BasketDto MapBasketToDto(this CustomerBasket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    Id = item.Id,
                    Name = item.Name,
                    Description = item.Description,
                    Price = item.Price,
                    PictureUrl = item.PictureUrl,
                    Types = item.Types,
                    Quantity = item.Quantity
                }).ToList(),
                DeliveryMethodId = basket.DeliveryMethodId ?? 0,
                ShippingPrice = basket.ShippingPrice,
            };
        }
    }
}
