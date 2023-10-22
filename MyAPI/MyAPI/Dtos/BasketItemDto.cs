namespace MyAPI.Dtos
{
    public class BasketItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string PictureUrl { get; set; }
        public string Types { get; set; }
        public int Quantity { get; set; }
    }
}
