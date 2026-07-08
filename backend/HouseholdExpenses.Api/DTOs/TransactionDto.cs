using HouseholdExpenses.Api.Models;

namespace HouseholdExpenses.Api.DTOs
{
    public class CreatePersonDto
    {
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
    }

    public class CreateTransactionDto
    {
        public string Description { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public TransactionType Type { get; set; }
        public int PersonId { get; set; }
    }

    public class TotalsReportDto
    {
        public List<PersonTotalDto> PeopleTotals { get; set; } = new();
        public decimal GrandTotalRevenue { get; set; }
        public decimal GrandTotalExpense { get; set; }
        public decimal GrandNetBalance { get; set; }
    }

    public class PersonTotalDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal TotalRevenue { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal Balance { get; set; }
    }
}
