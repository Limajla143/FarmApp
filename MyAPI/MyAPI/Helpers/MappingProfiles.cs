using AutoMapper;
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
        }
    }
}
