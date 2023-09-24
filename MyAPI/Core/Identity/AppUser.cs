﻿using Microsoft.AspNetCore.Identity;

namespace Core
{
    public class AppUser : IdentityUser<int>
    {
        public string DisplayName { get; set; }
        public Address Address { get; set; }
        public string Photo { get; set; } = "";
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}