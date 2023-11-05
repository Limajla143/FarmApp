namespace MyAPI.Dtos
{
    public class OrderDto
    {
        public AddressDto ShipToAddress { get; set; }
        public bool SaveAddress { get; set; }
    }
}
