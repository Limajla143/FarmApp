namespace MyAPI.Dtos
{
    public class OrderDto
    {
        public int DeliveryMethodId { get; set; }
        public AddressDto ShipToAddress { get; set; }
        public bool SaveAddress { get; set; }
    }
}
