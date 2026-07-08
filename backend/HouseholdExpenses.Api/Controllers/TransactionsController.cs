using HouseholdExpenses.Api.DTOs;
using HouseholdExpenses.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HouseholdExpenses.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly HouseholdService _service;

        public TransactionsController(HouseholdService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var transactions = await _service.GetAllTransactionsAsync();
            return Ok(transactions);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _service.CreateTransactionAsync(dto);
            if (result.Transaction == null)
            {
                return BadRequest(new { message = result.Error });
            }

            return CreatedAtAction(nameof(GetAll), new { id = result.Transaction.Id }, result.Transaction);
        }

        [HttpGet("totals")]
        public async Task<IActionResult> GetTotals()
        {
            var report = await _service.GetTotalsReportAsync();
            return Ok(report);
        }
    }
}
