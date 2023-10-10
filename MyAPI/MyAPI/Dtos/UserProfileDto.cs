namespace MyAPI.Dtos
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Photo { get; set; }
        public AddressDto AddressDto { get; set; }
        public bool IsActive { get; set; }
        public string MobileNumber { get; set; }
        public List<string> Roles { get; set; }
    }
}
