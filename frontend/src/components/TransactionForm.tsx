import React, { useState } from 'react';
import { CreateTransactionDto, TransactionType, Person } from '../types';
import '../styles/Form.css';

/**
 * Props do componente TransactionForm.
 */
interface TransactionFormProps {
  people: Person[];
  onSubmit: (data: CreateTransactionDto) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Componente para formulário de cadastro de transações.
 * Permite que o usuário insira a descrição, valor, tipo e selecione a pessoa.
 * Aplica a regra de negócio: menores de idade só podem cadastrar despesas.
 */
export const TransactionForm: React.FC<TransactionFormProps> = ({
  people,
  onSubmit,
  isLoading = false,
}) => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.Expense);
  const [personId, setPersonId] = useState<string>('');
  const [error, setError] = useState('');

  /**
   * Obtém a pessoa selecionada.
   */
  const selectedPerson = people.find((p) => p.id === parseInt(personId, 10));

  /**
   * Verifica se a pessoa é menor de idade.
   */
  const isMinor = selectedPerson && selectedPerson.age < 18;

  /**
   * Manipula o envio do formulário.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação básica
    if (!description.trim()) {
      setError('A descrição é obrigatória.');
      return;
    }

    const valueNum = parseFloat(value);
    if (isNaN(valueNum) || valueNum <= 0) {
      setError('O valor deve ser maior que zero.');
      return;
    }

    if (!personId) {
      setError('Selecione uma pessoa.');
      return;
    }

    // Regra de Negócio: Menores de idade só podem cadastrar despesas
    if (isMinor && type === TransactionType.Revenue) {
      setError('Menores de idade só podem cadastrar despesas.');
      return;
    }

    try {
      await onSubmit({
        description: description.trim(),
        value: valueNum,
        type,
        personId: parseInt(personId, 10),
      });
      setDescription('');
      setValue('');
      setType(TransactionType.Expense);
      setPersonId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar transação.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Cadastrar Transação</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="person">Pessoa:</label>
        <select
          id="person"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          disabled={isLoading || people.length === 0}
        >
          <option value="">Selecione uma pessoa</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name} ({person.age} anos)
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição:</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digite a descrição"
          disabled={isLoading}
          maxLength={255}
        />
      </div>

      <div className="form-group">
        <label htmlFor="value">Valor:</label>
        <input
          id="value"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Digite o valor"
          disabled={isLoading}
          step="0.01"
          min="0.01"
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Tipo:</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(parseInt(e.target.value, 10) as TransactionType)}
          disabled={isLoading || isMinor}
        >
          <option value={TransactionType.Expense}>Despesa</option>
          {!isMinor && <option value={TransactionType.Revenue}>Receita</option>}
        </select>
        {isMinor && <small style={{ color: '#ff6b6b' }}>Menores de idade só podem cadastrar despesas.</small>}
      </div>

      <button type="submit" disabled={isLoading || people.length === 0} className="btn btn-primary">
        {isLoading ? 'Cadastrando...' : 'Cadastrar Transação'}
      </button>
    </form>
  );
};
