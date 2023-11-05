namespace MyAPI.Dtos
{
    public class BasketDto
    {
        public string Id { get; set; }
        public List<BasketItemDto> Items { get; set; }
        public int DeliveryMethodId { get; set; }
        public double ShippingPrice { get; set; }
    }
}
