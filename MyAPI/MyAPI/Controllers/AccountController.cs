using AutoMapper;
using Core;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyAPI.Dtos;
using MyAPI.Extensions;
using MyAPI.Helpers;
using MyAPI.Middleware.Errors;
using System.Net;
using System.Net.Mail;

namespace MyAPI.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ICloudinaryImageService _imageService;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
     
       
        private IBasketRepository _basketRepository;
        private readonly IEmailService _emailService;
        private readonly ISmsSenderService _smsSenderService;
        private readonly IConfiguration _config;
        private readonly IConfig _configv1;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
            ITokenService tokenService, IMapper mapper, ICloudinaryImageService imageService,
            IBasketRepository basketRepository, IEmailService emailService, ISmsSenderService smsSenderService,
            IConfiguration config, IConfig configv1)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
            _basketRepository = basketRepository;
            _emailService = emailService;
            _smsSenderService = smsSenderService;
            _config = config;
            _imageService = imageService;
            _configv1 = configv1;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailFromClaimsPrincipal(loginDto.Email);

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, true);

            LogInStatus logInStatus = _configv1.GetLoginStatus(user, result);

            switch (logInStatus)
            {
                    case LogInStatus.EmailNotExist:
                           return Unauthorized(new ApiResponse(401, "Your email does not exist."));
                    case LogInStatus.Inactive:
                           return Unauthorized(new ApiResponse(401, "Your account is inactive, inquire the sysdamin."));
                    case LogInStatus.EmailUnconfirmed:
                           return Unauthorized(new ApiResponse(401, "Please confirm your email."));
                    //case LogInStatus.MobileNumberUnconfirmed:
                    //        await GenerateOTP();
                    //    break;
                    case LogInStatus.Locked:
                        return Unauthorized(new ApiResponse(401, "Your account is locked. Please try again later."));
                    case LogInStatus.NotAllowed:
                        return Unauthorized(new ApiResponse(401, "Your account is locked. Please try again later."));
                    case LogInStatus.FailedAuthentication:
                        return Unauthorized(new ApiResponse(401));
                    default:
                        break;
            }

            var basket = await _basketRepository.GetBasketAsync(user.UserName);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                Username = user.UserName,
                Basket = basket != null ? basket.MapBasketToDto() : null,
                StatusId = (int)logInStatus
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var user = new AppUser
            {
                Email = registerDto.Email,
                UserName = registerDto.Username,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            var role = await _userManager.AddToRoleAsync(user, "Member");

            if (!result.Succeeded || !role.Succeeded) return BadRequest(new ApiResponse(400, result.Errors.FirstOrDefault().Description));

            if (result.Succeeded)
            {
                var confirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                var confirmationLink = $"{_config["ClientUrl"]}/successconfirmemail/{user.Id}/{WebUtility.UrlEncode(confirmationToken)}";

                await _emailService.SendAsync(user.Email, "Please confirm email from MyFarm",
                    $"Please click on this link to confirm you email address: {confirmationLink}");
            }

            //Url.Action("ConfirmEmail", "Account",
            //values: new { userId = user.Id, token = confirmationToken }, Request.Scheme, Request.Host.ToString());

            return Ok(result);
        }

        [HttpPost("confirmemail")]
        public async Task<ActionResult> ConfirmEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest(new ApiResponse(401, "Your account does not exist."));
            }

            try
            {
                var result = await _userManager.ConfirmEmailAsync(user, token);

                if (result.Succeeded)
                {
                    return Ok(new ApiResponse(200, "You may now login"));
                }
                else if (result.Errors.Any(x => x.Code.Equals("ConcurrencyFailure")))
                {
                    await _userManager.UpdateSecurityStampAsync(user);
                    return NoContent();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse(400, $"Email confirmation failed. {ex.Message}"));
            }

            return BadRequest(new ApiResponse(400, "Email confirmation failed. Please contact the admin."));
        }

        [HttpPost("forgotPassword")]
        public async Task<ActionResult> ForgotPassword(string useremail) 
        {
            var user = await _userManager.FindByEmailAsync(useremail);

            if (user == null)
                return BadRequest(new ApiResponse(401, "Your account does not exist."));

            if(user.EmailConfirmed)
            {
                var passwordResetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

                var passwordResetLink = $"{_config["ClientUrl"]}/resetpassword/{user.Email}/{WebUtility.UrlEncode(passwordResetToken)}";

                await _emailService.SendAsync(user.Email, "Reset your password from MyFarm App",
                    $"Please click on this link to reset your password: {passwordResetLink}");

                return Ok(new ApiResponse(200, "Verification link already sent to to your email."));

            }
            else
            {
                return BadRequest(new ApiResponse(401, "Your email not yet confirmed."));
            }
        }

        [HttpPost("resetPassword")]
        public async Task<ActionResult> ResetPassword(ResetPasswordDto resetPassword)
        {
            var user = await _userManager.FindByEmailAsync(resetPassword.Email);

            if (user == null)
                return BadRequest(new ApiResponse(401, "Your account does not exist."));

            var result = await _userManager.ResetPasswordAsync(user, resetPassword.Token, resetPassword.NewPassword);

            if(result.Succeeded)
            {
                return Ok(new ApiResponse(200, "You may now login"));
            }

            return BadRequest(new ApiResponse(400, $"Change Password failed. {result.Errors.FirstOrDefault().Description}"));
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var basket = await _basketRepository.GetBasketAsync(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                Username = user.UserName,
                Basket = basket != null ? basket.MapBasketToDto() : null
            };
        }

        [Authorize]
        [HttpGet("getAddress")]
        public async Task<ActionResult<AddressDto>> GetSavedAddress()
        {
            var user = await _userManager.FindUserByClaimsPrincipleWithAddress(User);

            return _mapper.Map<Address, AddressDto>(user.Address);
        }


        [Authorize]
        [HttpPut("savedAddress")]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            var user = await _userManager.FindUserByClaimsPrincipleWithAddress(User);

            user.Address = _mapper.Map<AddressDto, Address>(address);

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) return Ok(_mapper.Map<AddressDto>(user.Address));

            return BadRequest(new ApiResponse(500, "Problem updating the user"));
        }

        [Authorize]
        [HttpGet("GetUserByUser/{email}")]
        public async Task<ActionResult<UserProfileDto>> GetUserByUser(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<AppUser, UserProfileDto>(user);
        }

        [Authorize]
        [HttpPut("UpdateUser")]
        public async Task<ActionResult> UpdateUser([FromForm] UserCreateDto userProfileDto)
        {
            var userToUpdate = await _userManager.FindUserByClaimsById(userProfileDto.Id);

            userToUpdate.UserName = userProfileDto.UserName;
            userToUpdate.DateOfBirth = userProfileDto.DateOfBirth;
            userToUpdate.Gender = userProfileDto.Gender;
            userToUpdate.MobileNumber = userProfileDto.MobileNumber;

            if (userProfileDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(userProfileDto.File);

                if (imageResult.Error != null)
                    return BadRequest(new ApiResponse(400, imageResult.Error.Message));

                if (!string.IsNullOrEmpty(userToUpdate.PublicId))
                    await _imageService.DeleteImageAsync(userToUpdate.PublicId);

                userToUpdate.Photo = imageResult.SecureUrl.ToString();
                userToUpdate.PublicId = imageResult.PublicId;
            }

            if (userProfileDto.AddressDto != null)
            {
                userToUpdate.Address = _mapper.Map<AddressDto, Address>(userProfileDto.AddressDto);
            }

            var result = await _userManager.UpdateAsync(userToUpdate);

            if (result.Succeeded) return Ok(new ApiResponse(200, "Successfully saved!"));

            return BadRequest(new ApiResponse(500, "Problem updating the user"));
        }

        //private async Task GenerateOTP()
        //{
        //    var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();

        //    if (user == null)
        //    {
        //        throw new InvalidOperationException($"Unable to load two-factor authentication user.");
        //    }

        //    try
        //    {
        //        var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Phone");
        //        await _smsSenderService.SendSmsAsync(user.PhoneNumber, $"MyFarm OTP Code is: ${token}");
        //    }
        //    catch (Exception ex)
        //    {

        //        throw;
        //    }
        //}

    }
}
