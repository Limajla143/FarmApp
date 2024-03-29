﻿namespace MyAPI.Dtos
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }
        public BasketDto Basket { get; set; }
        public int StatusId { get; set; }
        public int IdleTimer { get; set; }

    }
}
