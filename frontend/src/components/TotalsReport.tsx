import React from 'react';
import { TotalsReportDto } from '../types';
import '../styles/Report.css';

/**
 * Props do componente TotalsReport.
 */
interface TotalsReportProps {
  report: TotalsReportDto;
}

/**
 * Componente para exibir o relatório de totais de receitas, despesas e saldos.
 * Mostra os totais por pessoa e os totais gerais.
 */
export const TotalsReport: React.FC<TotalsReportProps> = ({ report }) => {
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
   * Obtém a classe CSS para o saldo (positivo ou negativo).
   */
  const getBalanceClass = (balance: number): string => {
    return balance >= 0 ? 'positive' : 'negative';
  };

  return (
    <div className="report-container">
      <h2>Relatório de Totais</h2>

      {report.peopleTotals.length === 0 ? (
        <div className="empty-state">Nenhuma pessoa ou transação cadastrada.</div>
      ) : (
        <>
          <table className="table report-table">
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Total de Receitas</th>
                <th>Total de Despesas</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {report.peopleTotals.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td className="revenue">{formatCurrency(person.totalRevenue)}</td>
                  <td className="expense">{formatCurrency(person.totalExpense)}</td>
                  <td className={`balance ${getBalanceClass(person.balance)}`}>
                    {formatCurrency(person.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grand-totals">
            <h3>Totais Gerais</h3>
            <div className="totals-grid">
              <div className="total-card">
                <span className="label">Total de Receitas:</span>
                <span className="value revenue">{formatCurrency(report.grandTotalRevenue)}</span>
              </div>
              <div className="total-card">
                <span className="label">Total de Despesas:</span>
                <span className="value expense">{formatCurrency(report.grandTotalExpense)}</span>
              </div>
              <div className="total-card">
                <span className="label">Saldo Líquido:</span>
                <span className={`value balance ${getBalanceClass(report.grandNetBalance)}`}>
                  {formatCurrency(report.grandNetBalance)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
