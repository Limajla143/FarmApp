using AutoMapper;
using Core;
using Core.Entities;
using MyAPI.Dtos;

namespace MyAPI.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<AgriType, AgriTypeDto>()
                .ForMember(x => x.AgriTypeId, y => y.MapFrom(z => z.Id)).ReverseMap();

            CreateMap<AppUser, UserProfileDto>()
                .ForPath(x => x.AddressDto.FirstName, opt => opt.MapFrom(y => y.Address.FirstName))
                 .ForPath(x => x.AddressDto.LastName, opt => opt.MapFrom(y => y.Address.LastName))
                 .ForPath(x => x.AddressDto.Street, opt => opt.MapFrom(y => y.Address.Street))
                 .ForPath(x => x.AddressDto.City, opt => opt.MapFrom(y => y.Address.City))
                 .ForPath(x => x.AddressDto.State, opt => opt.MapFrom(y => y.Address.State))
                 .ForPath(x => x.AddressDto.Zipcode, opt => opt.MapFrom(y => y.Address.ZipCode));

            CreateMap<UserCreateDto, AppUser>()
                 .ForPath(x => x.Address.FirstName, opt => opt.MapFrom(y => y.AddressDto.FirstName))
                 .ForPath(x => x.Address.LastName, opt => opt.MapFrom(y => y.AddressDto.LastName))
                 .ForPath(x => x.Address.Street , opt => opt.MapFrom(y => y.AddressDto.Street))
                 .ForPath(x => x.Address.City, opt => opt.MapFrom(y => y.AddressDto.City))
                 .ForPath(x => x.Address.State, opt => opt.MapFrom(y => y.AddressDto.State))
                 .ForPath(x => x.Address.ZipCode, opt => opt.MapFrom(y => y.AddressDto.Zipcode));

            CreateMap<Address, AddressDto>().ReverseMap();
        }
    }
}
