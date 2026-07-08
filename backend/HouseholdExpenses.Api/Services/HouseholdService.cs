using HouseholdExpenses.Api.Data;
using HouseholdExpenses.Api.DTOs;
using HouseholdExpenses.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HouseholdExpenses.Api.Services
{
    /// <summary>
    /// Serviço que encapsula a lógica de negócio do sistema de gastos residenciais.
    /// Responsável por gerenciar as operações relacionadas a Pessoas e Transações,
    /// incluindo a aplicação das regras de negócio e a geração de relatórios de totais.
    /// </summary>
    public class HouseholdService
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Construtor do serviço, injetando o contexto do banco de dados.
        /// </summary>
        /// <param name="context">O contexto do banco de dados da aplicação.</param>
        public HouseholdService(AppDbContext context)
        {
            _context = context;
        }

        #region Person Methods

        /// <summary>
        /// Obtém todas as pessoas cadastradas no sistema.
        /// </summary>
        /// <returns>Uma coleção de objetos Person.</returns>
        public async Task<IEnumerable<Person>> GetAllPeopleAsync()
        {
            return await _context.People.ToListAsync();
        }

        /// <summary>
        /// Cria uma nova pessoa no sistema.
        /// </summary>
        /// <param name="dto">Objeto CreatePersonDto contendo os dados da nova pessoa.</param>
        /// <returns>O objeto Person recém-criado.</returns>
        public async Task<Person> CreatePersonAsync(CreatePersonDto dto)
        {
            var person = new Person
            {
                Name = dto.Name,
                Age = dto.Age
            };

            _context.People.Add(person);
            await _context.SaveChangesAsync();
            return person;
        }

        /// <summary>
        /// Deleta uma pessoa do sistema pelo seu ID.
        /// Ao deletar uma pessoa, todas as transações associadas a ela também são apagadas
        /// devido à configuração `OnDelete(DeleteBehavior.Cascade)` no `AppDbContext`.
        /// </summary>
        /// <param name="id">O ID da pessoa a ser deletada.</param>
        /// <returns>True se a pessoa foi deletada com sucesso, False caso contrário.</returns>
        public async Task<bool> DeletePersonAsync(int id)
        {
            var person = await _context.People.FindAsync(id);
            if (person == null) return false;

            _context.People.Remove(person);
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Transaction Methods

        /// <summary>
        /// Obtém todas as transações cadastradas no sistema, incluindo os dados da pessoa associada.
        /// </summary>
        /// <returns>Uma coleção de objetos Transaction.</returns>
        public async Task<IEnumerable<Transaction>> GetAllTransactionsAsync()
        {
            return await _context.Transactions.Include(t => t.Person).ToListAsync();
        }

        /// <summary>
        /// Cria uma nova transação no sistema, aplicando as regras de negócio.
        /// </summary>
        /// <param name="dto">Objeto CreateTransactionDto contendo os dados da nova transação.</param>
        /// <returns>Uma tupla contendo o objeto Transaction criado (ou null em caso de erro) e uma mensagem de erro (se houver).</returns>
        public async Task<(Transaction? Transaction, string? Error)> CreateTransactionAsync(CreateTransactionDto dto)
        {
            var person = await _context.People.FindAsync(dto.PersonId);
            
            // Regra de Negócio: O valor (Pessoa) precisa existir no cadastro.
            // Se a pessoa não for encontrada, retorna um erro.
            if (person == null)
            {
                return (null, "A pessoa informada não existe.");
            }

            // Regra de Negócio: Se a pessoa for menor de idade (< 18 anos), apenas despesas podem ser cadastradas.
            // Se tentar cadastrar uma receita para um menor de idade, retorna um erro.
            if (person.Age < 18 && dto.Type == TransactionType.Revenue)
            {
                return (null, "Menores de idade só podem cadastrar despesas.");
            }

            var transaction = new Transaction
            {
                Description = dto.Description,
                Value = dto.Value,
                Type = dto.Type,
                PersonId = dto.PersonId
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return (transaction, null);
        }

        #endregion

        #region Totals Methods

        /// <summary>
        /// Calcula os totais de receitas, despesas e saldo para cada pessoa,
        /// e também os totais gerais de receitas, despesas e saldo líquido para todas as pessoas.
        /// </summary>
        /// <returns>Um objeto TotalsReportDto contendo os totais por pessoa e os totais gerais.</returns>
        public async Task<TotalsReportDto> GetTotalsReportAsync()
        {
            // Carrega todas as pessoas e suas transações associadas.
            var people = await _context.People
                .Include(p => p.Transactions)
                .ToListAsync();

            var report = new TotalsReportDto();

            // Itera sobre cada pessoa para calcular seus totais individuais.
            foreach (var person in people)
            {
                // Calcula o total de receitas da pessoa.
                var revenue = person.Transactions
                    .Where(t => t.Type == TransactionType.Revenue)
                    .Sum(t => t.Value);

                // Calcula o total de despesas da pessoa.
                var expense = person.Transactions
                    .Where(t => t.Type == TransactionType.Expense)
                    .Sum(t => t.Value);

                // Adiciona os totais da pessoa ao relatório.
                report.PeopleTotals.Add(new PersonTotalDto
                {
                    Id = person.Id,
                    Name = person.Name,
                    TotalRevenue = revenue,
                    TotalExpense = expense,
                    Balance = revenue - expense // Saldo = Receita - Despesa
                });
            }

            // Calcula os totais gerais somando os valores de todas as pessoas.
            report.GrandTotalRevenue = report.PeopleTotals.Sum(p => p.TotalRevenue);
            report.GrandTotalExpense = report.PeopleTotals.Sum(p => p.TotalExpense);
            report.GrandNetBalance = report.GrandTotalRevenue - report.GrandTotalExpense; // Saldo líquido geral

            return report;
        }

        #endregion
    }
}
