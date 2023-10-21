using System.ComponentModel.DataAnnotations;

namespace MyAPI.Dtos
{
    public class ProductAddUpdateDto 
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        [Range(1, Double.PositiveInfinity)]
        public double Price { get; set; } 

        [Required]
        public int SalesTax { get; set; }

        public IFormFile File { get; set; }

        [Required]
        public string AgriType { get; set; }

        [Required]
        [Range(0, 200)]
        public int Quantity { get; set; }
    }
}
