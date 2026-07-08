using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Xunit;
using HouseholdExpenses.Api.Data;
using HouseholdExpenses.Api.DTOs;
using HouseholdExpenses.Api.Models;
using HouseholdExpenses.Api.Services;

namespace HouseholdExpenses.Tests
{
    public class HouseholdServiceTests
    {
        /// <summary>
        /// Helper method to create a DbContext with an open in-memory SQLite connection.
        /// Using in-memory SQLite guarantees clean isolation for each test run while
        /// still using SQLite engine just like in production.
        /// </summary>
        private (AppDbContext Context, SqliteConnection Connection) CreateInMemoryDbContext()
        {
            var connection = new SqliteConnection("Filename=:memory:");
            connection.Open();

            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite(connection)
                .Options;

            var context = new AppDbContext(options);
            context.Database.EnsureCreated();

            return (context, connection);
        }

        [Fact]
        public async Task CreatePersonAsync_ShouldCreatePersonSuccessfully()
        {
            // Arrange
            var (context, connection) = CreateInMemoryDbContext();
            try
            {
                var service = new HouseholdService(context);
                var dto = new CreatePersonDto { Name = "João Silva", Age = 30 };

                // Act
                var person = await service.CreatePersonAsync(dto);

                // Assert
                Assert.True(person.Id > 0, "O ID deve ser gerado automaticamente pelo banco de dados.");
                Assert.Equal("João Silva", person.Name);
                Assert.Equal(30, person.Age);

                var dbPerson = await context.People.FindAsync(person.Id);
                Assert.NotNull(dbPerson);
                Assert.Equal("João Silva", dbPerson.Name);
                Assert.Equal(30, dbPerson.Age);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public async Task DeletePersonAsync_ShouldDeletePersonAndCascadeDeleteTransactions()
        {
            // Arrange
            var (context, connection) = CreateInMemoryDbContext();
            try
            {
                var service = new HouseholdService(context);
                
                // Cadastra uma pessoa
                var personDto = new CreatePersonDto { Name = "Maria Souza", Age = 25 };
                var person = await service.CreatePersonAsync(personDto);

                // Cadastra transações para essa pessoa
                var trans1Dto = new CreateTransactionDto
                {
                    Description = "Supermercado",
                    Value = 150.50m,
                    Type = TransactionType.Expense,
                    PersonId = person.Id
                };
                var trans2Dto = new CreateTransactionDto
                {
                    Description = "Salário",
                    Value = 3000.00m,
                    Type = TransactionType.Revenue,
                    PersonId = person.Id
                };

                await service.CreateTransactionAsync(trans1Dto);
                await service.CreateTransactionAsync(trans2Dto);

                // Verifica se as transações foram adicionadas no banco
                var totalTransactionsBefore = await context.Transactions.CountAsync(t => t.PersonId == person.Id);
                Assert.Equal(2, totalTransactionsBefore);

                // Act - Deleta a pessoa
                var deleteResult = await service.DeletePersonAsync(person.Id);

                // Assert
                Assert.True(deleteResult, "A deleção deve retornar true.");
                
                // A pessoa deve ter sido apagada do banco
                var dbPerson = await context.People.FindAsync(person.Id);
                Assert.Null(dbPerson);

                // Requisito: "Em casos que se delete uma pessoa, todas a transações dessa pessoa deverão ser apagadas."
                // As transações associadas a ela também devem ter sido apagadas
                var totalTransactionsAfter = await context.Transactions.CountAsync(t => t.PersonId == person.Id);
                Assert.Equal(0, totalTransactionsAfter);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public async Task CreateTransactionAsync_Adult_ShouldAllowRevenueAndExpense()
        {
            // Arrange
            var (context, connection) = CreateInMemoryDbContext();
            try
            {
                var service = new HouseholdService(context);
                var person = await service.CreatePersonAsync(new CreatePersonDto { Name = "Adulto", Age = 18 });

                var expenseDto = new CreateTransactionDto
                {
                    Description = "Aluguel",
                    Value = 800.00m,
                    Type = TransactionType.Expense,
                    PersonId = person.Id
                };
                var revenueDto = new CreateTransactionDto
                {
                    Description = "Freelance",
                    Value = 500.00m,
                    Type = TransactionType.Revenue,
                    PersonId = person.Id
                };

                // Act & Assert
                var (expenseResult, expenseError) = await service.CreateTransactionAsync(expenseDto);
                Assert.NotNull(expenseResult);
                Assert.Null(expenseError);
                Assert.Equal(TransactionType.Expense, expenseResult.Type);

                var (revenueResult, revenueError) = await service.CreateTransactionAsync(revenueDto);
                Assert.NotNull(revenueResult);
                Assert.Null(revenueError);
                Assert.Equal(TransactionType.Revenue, revenueResult.Type);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public async Task CreateTransactionAsync_Minor_ShouldAllowExpenseButBlockRevenue()
        {
            // Arrange
            var (context, connection) = CreateInMemoryDbContext();
            try
            {
                var service = new HouseholdService(context);
                var person = await service.CreatePersonAsync(new CreatePersonDto { Name = "Menor de Idade", Age = 17 });

                var expenseDto = new CreateTransactionDto
                {
                    Description = "Lanche",
                    Value = 25.00m,
                    Type = TransactionType.Expense,
                    PersonId = person.Id
                };
                var revenueDto = new CreateTransactionDto
                {
                    Description = "Mesada",
                    Value = 50.00m,
                    Type = TransactionType.Revenue,
                    PersonId = person.Id
                };

                // Act - Cadastra Despesa (Deve ser permitida)
                var (expenseResult, expenseError) = await service.CreateTransactionAsync(expenseDto);
                
                // Assert Despesa
                Assert.NotNull(expenseResult);
                Assert.Null(expenseError);
                Assert.Equal(TransactionType.Expense, expenseResult.Type);

                // Act - Cadastra Receita (Deve ser bloqueada)
                // Requisito: "Caso a pessoa informada seja menor de idade (menor de 18 anos), apenas despesas poderão ser cadastradas."
                var (revenueResult, revenueError) = await service.CreateTransactionAsync(revenueDto);

                // Assert Receita
                Assert.Null(revenueResult);
                Assert.Equal("Menores de idade só podem cadastrar despesas.", revenueError);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public async Task CreateTransactionAsync_NonExistingPerson_ShouldReturnError()
        {
            // Arrange
            var (context, connection) = CreateInMemoryDbContext();
            try
            {
                var service = new HouseholdService(context);
                var dto = new CreateTransactionDto
                {
                    Description = "Teste Sem Pessoa",
                    Value = 100.00m,
                    Type = TransactionType.Expense,
                    PersonId = 9999 // ID inexistente
                };

                // Act
                // Requisito: "Pessoa (identificador da pessoa); Esse valor precisa existir no cadastro de pessoa;"
                var (result, error) = await service.CreateTransactionAsync(dto);

                // Assert
                Assert.Null(result);
                Assert.Equal("A pessoa informada não existe.", error);
            }
            finally
            {
                connection.Close();
            }
        }

        [Fact]
        public async Task GetTotalsReportAsync_ShouldCalculateIndividualAndGrandTotalsCorrectly()
        {
            // Arrange
            var (context, connection) = CreateInMemoryDbContext();
            try
            {
                var service = new HouseholdService(context);
                
                // Pessoas
                var personA = await service.CreatePersonAsync(new CreatePersonDto { Name = "Pessoa A", Age = 30 });
                var personB = await service.CreatePersonAsync(new CreatePersonDto { Name = "Pessoa B", Age = 15 });

                // Transações de A (Total Receitas = 1500, Total Despesas = 400, Saldo = 1100)
                await service.CreateTransactionAsync(new CreateTransactionDto
                {
                    Description = "Salário A",
                    Value = 1500.00m,
                    Type = TransactionType.Revenue,
                    PersonId = personA.Id
                });
                await service.CreateTransactionAsync(new CreateTransactionDto
                {
                    Description = "Aluguel A",
                    Value = 400.00m,
                    Type = TransactionType.Expense,
                    PersonId = personA.Id
                });

                // Transações de B (Total Receitas = 0, Total Despesas = 100, Saldo = -100)
                await service.CreateTransactionAsync(new CreateTransactionDto
                {
                    Description = "Cinema B",
                    Value = 100.00m,
                    Type = TransactionType.Expense,
                    PersonId = personB.Id
                });

                // Act
                // Requisito: "Deverá listar todas as pessoas cadastradas, exibindo o total de receitas, despesas e o saldo... Ao final... total geral..."
                var report = await service.GetTotalsReportAsync();

                // Assert Totais Individuais
                Assert.NotNull(report);
                Assert.Equal(2, report.PeopleTotals.Count);

                var totalA = report.PeopleTotals.First(p => p.Id == personA.Id);
                Assert.Equal("Pessoa A", totalA.Name);
                Assert.Equal(1500.00m, totalA.TotalRevenue);
                Assert.Equal(400.00m, totalA.TotalExpense);
                Assert.Equal(1100.00m, totalA.Balance);

                var totalB = report.PeopleTotals.First(p => p.Id == personB.Id);
                Assert.Equal("Pessoa B", totalB.Name);
                Assert.Equal(0.00m, totalB.TotalRevenue);
                Assert.Equal(100.00m, totalB.TotalExpense);
                Assert.Equal(-100.00m, totalB.Balance);

                // Assert Totais Gerais
                Assert.Equal(1500.00m, report.GrandTotalRevenue);
                Assert.Equal(500.00m, report.GrandTotalExpense);
                Assert.Equal(1000.00m, report.GrandNetBalance);
            }
            finally
            {
                connection.Close();
            }
        }
    }
}
