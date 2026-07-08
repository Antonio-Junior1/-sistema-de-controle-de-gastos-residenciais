using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HouseholdExpenses.Api.Models
{
    /// <summary>
    /// Define os tipos possíveis de transação financeira.
    /// </summary>
    public enum TransactionType
    {
        /// <summary>
        /// Representa uma entrada de dinheiro.
        /// </summary>
        Revenue = 0, // Receita
        /// <summary>
        /// Representa uma saída de dinheiro.
        /// </summary>
        Expense = 1  // Despesa
    }

    /// <summary>
    /// Representa uma transação financeira (Receita ou Despesa) vinculada a uma pessoa específica.
    /// Cada transação possui um identificador único, descrição, valor, tipo e está associada a uma pessoa.
    /// </summary>
    public class Transaction
    {
        /// <summary>
        /// Identificador único da transação. Gerado automaticamente pelo banco de dados.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Descrição detalhada da transação. Campo obrigatório com um comprimento máximo de 255 caracteres.
        /// </summary>
        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [StringLength(255, ErrorMessage = "A descrição não pode exceder 255 caracteres.")]
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Valor monetário da transação. Campo obrigatório com precisão decimal (18 dígitos no total, 2 após a vírgula).
        /// </summary>
        [Required(ErrorMessage = "O valor é obrigatório.")]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
        public decimal Value { get; set; }

        /// <summary>
        /// Tipo da transação, indicando se é uma Receita ou Despesa.
        /// </summary>
        [Required(ErrorMessage = "O tipo de transação é obrigatório.")]
        public TransactionType Type { get; set; }

        /// <summary>
        /// Chave estrangeira para a pessoa à qual esta transação pertence.
        /// </summary>
        [Required(ErrorMessage = "O ID da pessoa é obrigatório.")]
        public int PersonId { get; set; }

        /// <summary>
        /// Propriedade de navegação para a entidade Person, representando a pessoa dona da transação.
        /// </summary>
        [ForeignKey("PersonId")]
        public virtual Person? Person { get; set; }
    }
}
