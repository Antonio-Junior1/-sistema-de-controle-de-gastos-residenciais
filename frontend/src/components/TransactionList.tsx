import React from 'react';
import { Transaction, TransactionType } from '../types';
import { Plus } from 'lucide-react';
import '../styles/List.css';

/**
 * Props do componente TransactionList.
 */
interface TransactionListProps {
  transactions: Transaction[];
  onAddClick?: () => void;
}

/**
 * Componente para exibir a lista de transações cadastradas.
 * Mostra a descrição, valor, tipo (Receita/Despesa), e a pessoa associada.
 */
export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions,
  onAddClick
}) => {
  /**
   * Formata o valor monetário para exibição.
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  /**
   * Obtém o tipo de transação formatado.
   */
  const getTransactionTypeLabel = (type: TransactionType): string => {
    return type === TransactionType.Revenue ? 'Receita' : 'Despesa';
  };

  /**
   * Obtém a classe CSS para o tipo de transação.
   */
  const getTransactionTypeClass = (type: TransactionType): string => {
    return type === TransactionType.Revenue ? 'revenue' : 'expense';
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Histórico de Transações</h2>
        {onAddClick && (
          <button 
            onClick={onAddClick} 
            className="btn btn-primary btn-desktop"
          >
            <Plus size={16} />
            Nova Transação
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">Nenhuma transação cadastrada.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th className="text-center">Valor</th>
              <th className="text-center">Tipo</th>
              <th>Pessoa</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.description}</td>
                <td className={`value ${getTransactionTypeClass(transaction.type)} text-center`}>
                  {getTransactionTypeLabel(transaction.type) === 'Receita' ? '+' : '-'}
                  {formatCurrency(transaction.value)}
                </td>
                <td className="text-center">
                  <span className={`type ${getTransactionTypeClass(transaction.type)}`}>
                    {getTransactionTypeLabel(transaction.type)}
                  </span>
                </td>
                <td>{transaction.person?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
