using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyAPI.Dtos;
using MyAPI.Extensions;
using MyAPI.Helpers;
using MyAPI.Middleware.Errors;

namespace MyAPI.Controllers
{
    [Authorize]
    public class UsersProductController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<AgriType> _agriType;
        private readonly IMapper _mapper;
        public UsersProductController(IGenericRepository<Product> productsRepo, IGenericRepository<AgriType> agriType,
            IMapper mapper)
        {
            _productsRepo = productsRepo;
            _agriType = agriType;
            _mapper = mapper;
        }

        [HttpGet("getProducts")]
        public async Task<ActionResult<PagedList<ProductDto>>> GetProducts([FromQuery] ProductParams productParams)
        {
            productParams.QuantityNotZero = true;
            var spec = new ProductSpecs(productParams);
            var productsResult = await _productsRepo.ListSpecAsync(spec);

            var data = PagedList<Product>.ToPagedList(productsResult, productParams.PageNumber, productParams.PageSize, productsResult.Count());

            Response.AddPaginationHeader(data.MetaData);

            return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductDto>>(data) );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var spec = new ProductSpecs(id);

            var product = await _productsRepo.GetEntityWithSpec(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<Product, ProductDto>(product);
        }

        [HttpGet("prodFilters")]
        public async Task<ActionResult<List<string>>> GetFilters()
        {
            var agriTypes = await _agriType.ListAllAsync();

            return Ok(agriTypes.Select(x => x.Name).ToList());
        }
    }
}
