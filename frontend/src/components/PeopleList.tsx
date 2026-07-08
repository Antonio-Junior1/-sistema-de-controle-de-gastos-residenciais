import React from 'react';
import { Person } from '../types';
import { Trash2, UserPlus } from 'lucide-react';
import '../styles/List.css';

/**
 * Props do componente PeopleList.
 */
interface PeopleListProps {
  people: Person[];
  onDelete: (id: number) => Promise<void>;
  isLoading?: boolean;
  onAddClick?: () => void;
}

/**
 * Componente para exibir a lista de pessoas cadastradas.
 * Permite deletar uma pessoa da lista.
 */
export const PeopleList: React.FC<PeopleListProps> = ({ 
  people, 
  onDelete, 
  isLoading = false,
  onAddClick 
}) => {
  /**
   * Manipula a exclusão de uma pessoa com confirmação.
   */
  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Tem certeza que deseja deletar ${name}? Todas as transações serão removidas.`)) {
      try {
        await onDelete(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erro ao deletar pessoa.');
      }
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Membros Cadastrados</h2>
        {onAddClick && (
          <button 
            onClick={onAddClick} 
            disabled={isLoading} 
            className="btn btn-primary btn-desktop"
          >
            <UserPlus size={16} />
            Novo Membro
          </button>
        )}
      </div>

      {people.length === 0 ? (
        <div className="empty-state">Nenhum membro cadastrado.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Idade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td>{person.id}</td>
                <td>{person.name}</td>
                <td>{person.age}</td>
                <td>
                  <button
                    onClick={() => handleDelete(person.id, person.name)}
                    disabled={isLoading}
                    className="btn btn-danger btn-small"
                  >
                    <Trash2 size={13} />
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
