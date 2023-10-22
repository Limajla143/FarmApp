using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAPI.Dtos;
using MyAPI.Extensions;
using MyAPI.Middleware.Errors;

namespace MyAPI.Controllers
{
    [Authorize]
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IMapper _mapper;

        public BasketController(IBasketRepository basketRepository, IGenericRepository<Product> productRepository,
            IMapper mapper)
        {
            _basketRepository = basketRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        [HttpGet("GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound(new ApiResponse(404, "No Items!"));

            return basket.MapBasketToDto();
        }

        [HttpPost("AddItemToBasket")]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            //get basket
            var basket = await RetrieveBasket();

            //create basket
            if (basket == null) basket = await CreateBasket();

            ProductSpecs spec = new ProductSpecs(productId);
            var product = await _productRepository.GetEntityWithSpec(spec);
            if(product == null) return BadRequest(new ApiResponse(401, "Product not found!"));

            var bkProduct = _mapper.Map<BasketProduct>(product);

            basket.AddItem(bkProduct, quantity);

            try
            {
                await _basketRepository.UpdateBasketAsync(basket);

                return Ok(basket.MapBasketToDto());
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse(400, ex.Message));
            }
        }

        [HttpDelete("RemoveItemFromBasket")]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            //get basket
            var basket = await RetrieveBasket();
            if (basket == null) return NotFound();

           
            try
            {
                //remove item or reduce quantity
                basket.RemoveItem(productId, quantity);

                //save changes
                if(basket.Items.Count <= 0)
                {
                    await _basketRepository.DeleteBasketAsync(basket.Id);
                }
                else
                {
                    await _basketRepository.UpdateBasketAsync(basket);
                }
                
               return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse(400, "Problem removing item from basket"));
            }
        }

        private string GetBuyerId()
        {
            return User.Identity.Name;
        }

        private async Task<CustomerBasket> RetrieveBasket()
        {
            return await _basketRepository.GetBasketAsync(GetBuyerId());
        }

        private async Task<CustomerBasket> CreateBasket()
        {
            var buyerId = GetBuyerId();

            var basket = new CustomerBasket(buyerId);

            await _basketRepository.UpdateBasketAsync(basket);

            return basket;
        }
    }
}
