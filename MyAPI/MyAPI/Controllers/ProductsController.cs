using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifiactions;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;
using MyAPI.Dtos;
using MyAPI.Extensions;
using MyAPI.Helpers;
using MyAPI.Middleware.Errors;
using System.Collections.Generic;
using System.ComponentModel;

namespace MyAPI.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<AgriType> _agriType;
        private readonly IMapper _mapper;
        private readonly IFileStorageService _fileStorageService;
        private string prodContainer = "products";

        public ProductsController(IGenericRepository<Product> productsRepo, IGenericRepository<AgriType> agriType,
            IMapper mapper, IFileStorageService fileStorageService)
        {
            _productsRepo = productsRepo;
            _agriType = agriType;
            _mapper = mapper;
            _fileStorageService = fileStorageService;
        }

        [HttpGet("getProducts")]
        public async Task<ActionResult<PagedList<ProductToReturn>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var spec = new ProductSpecs(productParams);
            var countSpec = new ProductSpecsCount(productParams);
            var totalItems = await _productsRepo.CountAsync(countSpec);
            var productsResult = await _productsRepo.ListSpecAsync(spec);

            var data = PagedList<Product>.ToPagedList(productsResult, productParams.PageNumber, productParams.PageSize, totalItems);

            Response.AddPaginationHeader(data.MetaData);

            return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturn>>(data));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturn>> GetProduct(int id)
        {
            var spec = new ProductSpecs(id);

            var product = await _productsRepo.GetEntityWithSpec(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<Product, ProductToReturn>(product);
        }


        [HttpPost("AddUpdateProduct")]
        public async Task<ActionResult<ProductToReturn>> CreateUpdateProduct([FromForm] ProductAddUpdateDto productAddUpdateDto)
        {
            var productToModify = new Product();
            string imageUrl = "";

            if(productAddUpdateDto.SalesTax != 0)
            {
                productAddUpdateDto.Price = ComputeRealPrice(productAddUpdateDto.Price, productAddUpdateDto.SalesTax);
            }

            if(productAddUpdateDto.File != null)
            {
                imageUrl = await _fileStorageService.EditFile(prodContainer, productAddUpdateDto.File, imageUrl);
            }

            var agriTypeParam = new AgriTypeParam();
            agriTypeParam.Search = productAddUpdateDto.AgriType;

            var agriTypeSpecs = new AgriTypeSpecs(agriTypeParam);
            var agriType = await _agriType.GetEntityWithSpec(agriTypeSpecs);

            if(productAddUpdateDto.Id == 0)
            {
                productToModify = _mapper.Map<Product>(productAddUpdateDto);
                productToModify.AgriTypeId = agriType.Id;
                productToModify.PictureUrl = imageUrl;
                _productsRepo.Add(productToModify);
            }
            else
            {
                productToModify = await _productsRepo.GetIdByAsync(productAddUpdateDto.Id);
                productToModify.Name = productAddUpdateDto.Name;
                productToModify.Description = productAddUpdateDto.Description;
                productToModify.Price = productAddUpdateDto.Price;
                productToModify.SalesTax = productAddUpdateDto.SalesTax;
                productToModify.Quantity = productAddUpdateDto.Quantity;
                productToModify.AgriTypeId = agriType.Id;
                _productsRepo.Update(productToModify);
            }

            var result = await _productsRepo.SaveAsync();

            if (result <= 0)
            {
                return BadRequest(new ApiResponse(400, "Problem create/update product"));
            }

            return Ok(_mapper.Map<ProductToReturn>(productToModify));

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _productsRepo.GetIdByAsync(id);

            if (product == null) return NotFound();

            if (!string.IsNullOrEmpty(product.PictureUrl))
            {
                await _fileStorageService.DeleteFile(product.PictureUrl, prodContainer);
            }

           _productsRepo.Delete(product);   

            var result = await _productsRepo.SaveAsync();

            if (result <= 0)
            {
                return BadRequest(new ApiResponse(400, "Problem deleting product"));
            }

            return NoContent();
        }

        private long ComputeRealPrice(long price, int salesTax)
        {
            return  (long)(price * ((double)salesTax / 100)) + price;
        }

    }
}
