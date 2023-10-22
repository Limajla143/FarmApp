using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class CustomerBasket
    {
        public CustomerBasket(){}

        public CustomerBasket(string id)
        {
            Id = id;
        }

        public string Id { get; set; }
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();

        public void AddItem(BasketProduct product, int quantity)
        {
            
            if (Items.All(item => item.Id != product.Id))
            {
                Items.Add(new BasketItem 
                { 
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    PictureUrl = product.PictureUrl,
                    Price = product.Price,
                    Types = product.Types,
                    Quantity = quantity 
                });
            }
            else
            {
                var existingItem = Items.FirstOrDefault(item => item.Id == product.Id);
                if (existingItem != null) 
                    existingItem.Quantity += quantity;
            }
        }

        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.Id == productId);
            if (item == null) return;
            item.Quantity -= quantity;
            if (item.Quantity == 0) Items.Remove(item);
        }

    }
}
