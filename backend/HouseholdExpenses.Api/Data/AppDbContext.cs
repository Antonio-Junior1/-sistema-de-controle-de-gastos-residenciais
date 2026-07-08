using Microsoft.EntityFrameworkCore;
using HouseholdExpenses.Api.Models;

namespace HouseholdExpenses.Api.Data
{
    /// <summary>
    /// Contexto do banco de dados para a aplicação.
    /// Define as tabelas e as relações entre elas.
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Person> People { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração para deletar transações em cascata quando uma pessoa for removida
            modelBuilder.Entity<Person>()
                .HasMany(p => p.Transactions)
                .WithOne(t => t.Person)
                .HasForeignKey(t => t.PersonId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
