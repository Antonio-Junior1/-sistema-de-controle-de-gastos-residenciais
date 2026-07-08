using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HouseholdExpenses.Api.Models
{
    /// <summary>
    /// Representa uma pessoa no sistema de controle de gastos residenciais.
    /// Cada pessoa possui um identificador único, nome, idade e pode ter múltiplas transações associadas.
    /// </summary>
    public class Person
    {
        /// <summary>
        /// Identificador único da pessoa. Gerado automaticamente pelo banco de dados.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Nome da pessoa. Campo obrigatório com um comprimento máximo de 100 caracteres.
        /// </summary>
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Idade da pessoa. Campo obrigatório com um valor entre 0 e 150.
        /// </summary>
        [Required(ErrorMessage = "A idade é obrigatória.")]
        [Range(0, 150, ErrorMessage = "A idade deve estar entre 0 e 150.")]
        public int Age { get; set; }

        /// <summary>
        /// Coleção de transações associadas a esta pessoa. Propriedade de navegação para o relacionamento um-para-muitos.
        /// </summary>
        public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
