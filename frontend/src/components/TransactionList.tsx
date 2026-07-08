import React from 'react';
import { Transaction, TransactionType } from '../types';
import '../styles/List.css';

/**
 * Props do componente TransactionList.
 */
interface TransactionListProps {
  transactions: Transaction[];
}

/**
 * Componente para exibir a lista de transações cadastradas.
 * Mostra a descrição, valor, tipo (Receita/Despesa), e a pessoa associada.
 */
export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
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

  if (transactions.length === 0) {
    return <div className="empty-state">Nenhuma transação cadastrada.</div>;
  }

  return (
    <div className="list-container">
      <h2>Transações Cadastradas</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Pessoa</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.description}</td>
              <td className={`value ${getTransactionTypeClass(transaction.type)}`}>
                {getTransactionTypeLabel(transaction.type) === 'Receita' ? '+' : '-'}
                {formatCurrency(transaction.value)}
              </td>
              <td className={`type ${getTransactionTypeClass(transaction.type)}`}>
                {getTransactionTypeLabel(transaction.type)}
              </td>
              <td>{transaction.person?.name || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
