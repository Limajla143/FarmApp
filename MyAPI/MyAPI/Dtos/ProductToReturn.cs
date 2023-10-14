using Core.Entities;

namespace MyAPI.Dtos
{
    public class ProductToReturn
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string PictureUrl { get; set; }
        public long Price { get; set; }
        public int SalesTax { get; set; }
        public string AgriType { get; set; }
        public int Quantity { get; set; }
    }
}
