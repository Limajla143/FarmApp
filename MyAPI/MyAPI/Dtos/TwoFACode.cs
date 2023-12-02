using System.ComponentModel.DataAnnotations;

namespace MyAPI.Dtos
{
    public class TwoFACode
    {
        [Required]
        [StringLength(7, ErrorMessage = "Please input code")]
        public string TwoFactorCode { get; set; }

        public bool RememberMachine { get; set; }

        public string TwoFactorProviderName { get; set; }
    }
}
