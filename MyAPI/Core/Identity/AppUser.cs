using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Core
{
    public class AppUser : IdentityUser<int>
    {
        public Address Address { get; set; }
        public string Photo { get; set; } = "";
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public bool IsActive { get; set; }
        public string MobileNumber { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
        public string PublicId { get; set; }
    }
}