using AutoMapper;
using Core.Entities;
using Core.Entities.OrderAggregate;
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
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BasketController(IBasketRepository basketRepository, IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
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
            var product = await _unitOfWork.Repository<Product>().GetEntityWithSpec(spec);
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

            if (basket == null) return NotFound(new ApiResponse(404, "You have no orders!"));
           
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

        [HttpPost("DeliveryMethodForBasket")]
        public async Task<ActionResult<BasketDto>> DeliveryMethodForBasket(int deliveryMethodId)
        {
            //get basket
            var basket = await RetrieveBasket();

            //create basket
            if (basket == null) basket = await CreateBasket();

            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetIdByAsync(deliveryMethodId);

            if(deliveryMethod == null) return NotFound(new ApiResponse(404, "DeliveryMethod not found!"));

            basket.DeliveryMethodId = deliveryMethod.Id;
            basket.ShippingPrice = deliveryMethod.Price;

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
