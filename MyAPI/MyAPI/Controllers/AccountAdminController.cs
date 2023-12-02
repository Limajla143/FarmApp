using Core.Specifications;
using Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyAPI.Dtos;
using MyAPI.Extensions;
using MyAPI.Helpers;
using MyAPI.Middleware.Errors;
using AutoMapper;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MyAPI.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AccountAdminController : BaseApiController
    {
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IUserRepository _userRepository;
        private readonly ICloudinaryImageService _imageService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;

        public AccountAdminController(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, IMapper mapper,
            IUserRepository userRepository, ICloudinaryImageService imageService)
        {
            _userRepository = userRepository;
            _roleManager = roleManager;
            _mapper = mapper;
            _imageService = imageService;
            _userManager = userManager;
        }

        [HttpGet("GetUsersByAdmin")]
        public async Task<ActionResult<PagedList<UserProfileDto>>> GetUsersByAdmin([FromQuery] UsersParam usersParams)
        {
            var users = await _userRepository.GetUsersAsync(usersParams);

            var pagedUsers = PagedList<UserProfileDto>.ToPagedList(_mapper.Map<IReadOnlyList<AppUser>, IReadOnlyList<UserProfileDto>>(users),
                usersParams.PageNumber, usersParams.PageSize, users.Count());

            Response.AddPaginationHeader(pagedUsers.MetaData);

            return Ok(pagedUsers.OrderBy(x => x.UserName));
        }

        [HttpPut("UpdateUserAdmin")]
        public async Task<ActionResult> UpdateUserAdmin([FromForm] UserCreateDto userProfileDto)
        {
            var userToUpdate = await _userManager.FindUserByClaimsById(userProfileDto.Id);

            userToUpdate.UserName = userProfileDto.UserName;
            userToUpdate.Email = userProfileDto.Email;
            userToUpdate.DateOfBirth = userProfileDto.DateOfBirth;
            userToUpdate.Gender = userProfileDto.Gender;
            userToUpdate.MobileNumber = userProfileDto.MobileNumber;
            userToUpdate.IsActive = userProfileDto.IsActive;

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

            if (userProfileDto.Roles.Count > 0)
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
