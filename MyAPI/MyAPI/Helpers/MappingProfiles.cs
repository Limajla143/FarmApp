using AutoMapper;
using Core;
using Core.Entities;
using Core.Entities.OrderAggregate;
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
                 .ForMember(x => x.DateOfBirth, y => { y.MapFrom(z => z.DateOfBirth.ToString("yyyy-MM-dd")); } )
                 .ForPath(x => x.Roles, y => y.MapFrom(z => z.UserRoles.Select(a => a.Role.Name)))
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

            CreateMap<Product, ProductToReturn>()
                .ForMember(x => x.AgriType, y => y.MapFrom(z => z.AgriType.Name));

            CreateMap<ProductAddUpdateDto, Product>()
                .ForMember(x => x.PictureUrl, y => y.Ignore())
                .ForMember(x => x.AgriType, y => y.Ignore());

            CreateMap<Product, ProductDto>()
                .ForMember(x => x.AgriType, y => y.MapFrom(z => z.AgriType.Name));

            CreateMap<Product, BasketProduct>()
                .ForMember(x => x.Types, y => y.MapFrom(z => z.AgriType.Name));

            CreateMap<OrderAddress, AddressDto>().ReverseMap();

            CreateMap<Order, OrderToReturnDto>()
                .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
                .ForMember(d => d.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price));
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProductItemId))
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl));
        }
    }
}
