using HouseholdExpenses.Api.DTOs;
using HouseholdExpenses.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HouseholdExpenses.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PeopleController : ControllerBase
    {
        private readonly HouseholdService _service;

        public PeopleController(HouseholdService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var people = await _service.GetAllPeopleAsync();
            return Ok(people);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePersonDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            
            var person = await _service.CreatePersonAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = person.Id }, person);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeletePersonAsync(id);
            if (!success) return NotFound();
            
            return NoContent();
        }
    }
}
