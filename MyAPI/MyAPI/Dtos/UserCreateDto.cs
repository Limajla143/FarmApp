﻿namespace MyAPI.Dtos
{
    public class UserCreateDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public IFormFile File { get; set; }
        public AddressDto AddressDto { get; set; }
        public bool IsActive { get; set; }
        public string MobileNumber { get; set; }
        public List<string> Roles { get; set; }
    }
}
