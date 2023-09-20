using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifiactions;
using Core.Specifications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyAPI.Dtos;
using MyAPI.Helpers;
using MyAPI.Middleware.Errors;

namespace MyAPI.Controllers
{
    public class AgriTypesController : BaseApiController
    {
        private readonly IGenericRepository<AgriType> _agriTypes;
        private readonly IMapper _mapper;

        public AgriTypesController(IGenericRepository<AgriType> agriTypes, IMapper mapper)
        {
            _agriTypes = agriTypes;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<AgriTypeDto>>> GetAgriTypes([FromQuery]AgriTypeParam agrParam)
        {
            var spec = new AgriTypeSpecs(agrParam);
            var totalItems = await _agriTypes.CountAsync(spec);
            var agrTypes = await _agriTypes.ListSpecAsync(spec);

            var data = _mapper.Map<IReadOnlyList<AgriType>, IReadOnlyList<AgriTypeDto>>(agrTypes);

            return Ok(new PagedList<AgriTypeDto>(data, totalItems, agrParam.PageNumber, agrParam.PageSize));
        }

        [HttpGet("{id}", Name = "GetAgriType")]
        public async Task<ActionResult<AgriTypeDto>> GetAgriType(int id)
        {
            var agrType = await _agriTypes.GetIdByAsync(id);

            if (agrType == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<AgriType, AgriTypeDto>(agrType);
        }

        [HttpPost]
        public async Task<ActionResult<AgriType>> CreateUpdateAgriType([FromForm] AgriTypeDto agriTypeDto)
        {
            var agrType = _mapper.Map<AgriType>(agriTypeDto);

            if(agrType.Id == 0)
            {
                _agriTypes.Add(agrType);
            }
            else
            {
                _agriTypes.Update(agrType);
            }

            var result = await _agriTypes.SaveAsync();

            if (result <= 0)
            {
                return BadRequest(new ApiResponse(400, "Problem create/update agri product"));
            }

            return Ok(_mapper.Map<AgriTypeDto>(agrType));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAgriType(int id)
        {
            var agrType = await _agriTypes.GetIdByAsync(id);

            if (agrType == null) return BadRequest(new ApiResponse(404, "No agriType exists..."));

            _agriTypes.Delete(agrType);

            await _agriTypes.SaveAsync();

            return Ok();
        }
    }
}
