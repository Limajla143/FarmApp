﻿using AutoMapper;
using Core;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAPI.Dtos;
using MyAPI.Extensions;
using MyAPI.Helpers;
using MyAPI.Middleware.Errors;

namespace MyAPI.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;

        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        [HttpPost("createOrder")]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var username = HttpContext.User?.RetrieveNameFromPrincipal();

            var address = _mapper.Map<AddressDto, OrderAddress>(orderDto.ShipToAddress);

            var order = await _orderService.CreateOrderAsync(username, username, address);

            if(order.Id > 0)
            {
                return CreatedAtRoute("GetOrderByIdForUser", new { id = order.Id }, order.Id);
            }

            return BadRequest(new ApiResponse(400, "Problem creating order"));
        }

        [HttpGet("GetOrdersForUsers")]
        public async Task<ActionResult<PagedList<OrderToReturnDto>>> GetOrdersForUser([FromQuery] OrderParams orderParams)
        {
            orderParams.username = User.RetrieveNameFromPrincipal();

            var orders = await _orderService.GetOrdersForUserAsync(orderParams);

            var data = PagedList<Order>.ToPagedList(orders, orderParams.PageNumber, orderParams.PageSize, orders.Count());

            Response.AddPaginationHeader(data.MetaData);

            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(data));
        }

        [HttpGet("{id}", Name = "GetOrderByIdForUser")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
        {
            var username = User.RetrieveNameFromPrincipal();

            var order = await _orderService.GetOrderByIdAsync(id, username);

            if (order == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<OrderToReturnDto>(order);
        }

        [HttpDelete("RemoveOrder/{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            var username = User.RetrieveNameFromPrincipal();

            var order = await _orderService.GetOrderByIdAsync(id, username);

            if (order == null) return NotFound(new ApiResponse(404));

            await _orderService.SoftRemoveOrder(id, username);

            return NoContent();
        }

        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            return Ok(await _orderService.GetDeliveryMethodsAsync());
        }
    }
}
