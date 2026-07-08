import React, { useState } from 'react';
import { CreatePersonDto } from '../types';
import '../styles/Form.css';

/**
 * Props do componente PeopleForm.
 */
interface PeopleFormProps {
  onSubmit: (data: CreatePersonDto) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Componente para formulário de cadastro de pessoas.
 * Permite que o usuário insira o nome e a idade de uma nova pessoa.
 */
export const PeopleForm: React.FC<PeopleFormProps> = ({ onSubmit, isLoading = false }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  /**
   * Manipula o envio do formulário.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação básica
    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      setError('A idade deve estar entre 0 e 150.');
      return;
    }

    try {
      await onSubmit({ name: name.trim(), age: ageNum });
      setName('');
      setAge('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar pessoa.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Cadastrar Pessoa</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="name">Nome:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome"
          disabled={isLoading}
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="age">Idade:</label>
        <input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Digite a idade"
          disabled={isLoading}
          min="0"
          max="150"
        />
      </div>

      <button type="submit" disabled={isLoading} className="btn btn-primary">
        {isLoading ? 'Cadastrando...' : 'Cadastrar Pessoa'}
      </button>
    </form>
  );
};
