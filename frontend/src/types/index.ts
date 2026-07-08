/**
 * Tipos e interfaces TypeScript para o sistema de controle de gastos.
 */

/**
 * Tipos de transação: Receita ou Despesa.
 */
export enum TransactionType {
  Revenue = 0,  // Receita
  Expense = 1   // Despesa
}

/**
 * Interface para representar uma pessoa.
 */
export interface Person {
  id: number;
  name: string;
  age: number;
}

/**
 * Interface para representar uma transação.
 */
export interface Transaction {
  id: number;
  description: string;
  value: number;
  type: TransactionType;
  personId: number;
  person?: Person;
}

/**
 * Interface para o DTO de criação de pessoa.
 */
export interface CreatePersonDto {
  name: string;
  age: number;
}

/**
 * Interface para o DTO de criação de transação.
 */
export interface CreateTransactionDto {
  description: string;
  value: number;
  type: TransactionType;
  personId: number;
}

/**
 * Interface para os totais de uma pessoa.
 */
export interface PersonTotalDto {
  id: number;
  name: string;
  totalRevenue: number;
  totalExpense: number;
  balance: number;
}

/**
 * Interface para o relatório de totais.
 */
export interface TotalsReportDto {
  peopleTotals: PersonTotalDto[];
  grandTotalRevenue: number;
  grandTotalExpense: number;
  grandNetBalance: number;
}
