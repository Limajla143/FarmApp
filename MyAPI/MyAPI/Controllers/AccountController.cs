using AutoMapper;
using Core;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyAPI.Dtos;
using MyAPI.Extensions;
using MyAPI.Helpers;
using MyAPI.Middleware.Errors;

namespace MyAPI.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly RoleManager<AppRole> _roleManager;
        private string container = "usersImg";

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
            ITokenService tokenService, IMapper mapper, IUserRepository userRepository, IFileStorageService fileStorageService,
            RoleManager<AppRole> roleManager)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
            _fileStorageService = fileStorageService;
            _roleManager = roleManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized(new ApiResponse(401));

            if(!user.IsActive)
            {
                return Unauthorized(new ApiResponse(401, "Your account is inactive, inquire the sysdamin."));
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized(new ApiResponse(401));


            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var user = new AppUser
            {
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            var role = await _userManager.AddToRoleAsync(user, "Member");

            if (!result.Succeeded || !role.Succeeded) return BadRequest(new ApiResponse(400, result.Errors.FirstOrDefault().Description));

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email
            };
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }  

        //ADMIN SIDE

        [HttpGet("GetUsersByAdmin")]
        public async Task<ActionResult<PagedList<UserProfileDto>>> GetUsersByAdmin([FromQuery] UsersParam usersParams)
        {
            var users = await _userRepository.GetUsersAsync(usersParams);

            var pagedUsers = PagedList<UserProfileDto>.ToPagedList(_mapper.Map<IReadOnlyList<AppUser>, IReadOnlyList<UserProfileDto>>(users),
                usersParams.PageNumber, usersParams.PageSize, users.Count());

            Response.AddPaginationHeader(pagedUsers.MetaData);

            return Ok(pagedUsers.OrderBy(x => x.UserName));
        }


        [HttpGet("GetUserByAdmin/{id}")]
        public async Task<ActionResult<UserProfileDto>> GetUserByAdmin(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);

            if (user == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<AppUser, UserProfileDto>(user);
        }

        [HttpPut("UpdateUser")]
        public async Task<ActionResult> UpdateUser([FromForm] UserCreateDto userProfileDto)
        {
            var userToUpdate = await _userManager.FindUserByClaimsPrincipleWithAddress(userProfileDto.Id);

            userToUpdate.UserName = userProfileDto.UserName;
            userToUpdate.Email = userProfileDto.Email;
            userToUpdate.DateOfBirth = userProfileDto.DateOfBirth;
            userToUpdate.Gender = userProfileDto.Gender;
            userToUpdate.MobileNumber = userProfileDto.MobileNumber;
            userToUpdate.IsActive = userProfileDto.IsActive;

            if(userProfileDto.File != null)
            {
                userToUpdate.Photo = await _fileStorageService.EditFile(container, userProfileDto.File, userToUpdate.Photo);
            }

            if(userProfileDto.AddressDto != null)
            {
                userToUpdate.Address = _mapper.Map<AddressDto, Address>(userProfileDto.AddressDto);
            }

            if(userProfileDto.Roles.Count > 0)
            {
                var userRoles = await _userManager.GetRolesAsync(userToUpdate);
                var rolesIncludes = userProfileDto.Roles.Except(userRoles);
                var rolesExcludes = userRoles.Except(userProfileDto.Roles);

                foreach (var role in rolesIncludes)
                {
                    if (!await _roleManager.RoleExistsAsync(role))
                    {
                        return BadRequest($"Role '{role}' does not exist.");
                    }
                }

                await _userManager.AddToRolesAsync(userToUpdate, rolesIncludes);
                await _userManager.RemoveFromRolesAsync(userToUpdate, rolesExcludes);
            }

            var result = await _userManager.UpdateAsync(userToUpdate);

            if (result.Succeeded) return NoContent();

            return BadRequest("Problem updating the user");
        }

        [HttpGet("GetRoles")]
        public async Task<ActionResult<List<string>>> GetAllRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();

            return Ok(roles.Select(x => x.Name).ToList());
        }

    }
}
