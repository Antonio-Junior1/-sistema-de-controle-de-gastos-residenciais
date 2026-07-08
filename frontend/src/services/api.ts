import axios from 'axios';
import {
  Person,
  Transaction,
  CreatePersonDto,
  CreateTransactionDto,
  TotalsReportDto,
} from '../types';

/**
 * Configuração da URL base da API.
 * Pode ser alterada para apontar para diferentes ambientes (desenvolvimento, produção, etc.)
 */
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Instância do cliente Axios com configuração padrão.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Serviço de API para gerenciar Pessoas.
 */
export const peopleService = {
  /**
   * Obtém todas as pessoas cadastradas.
   * @returns Promise com a lista de pessoas.
   */
  getAll: async (): Promise<Person[]> => {
    const response = await apiClient.get<Person[]>('/people');
    return response.data;
  },

  /**
   * Cria uma nova pessoa.
   * @param data Dados da pessoa a ser criada.
   * @returns Promise com a pessoa criada.
   */
  create: async (data: CreatePersonDto): Promise<Person> => {
    const response = await apiClient.post<Person>('/people', data);
    return response.data;
  },

  /**
   * Deleta uma pessoa pelo ID.
   * @param id ID da pessoa a ser deletada.
   * @returns Promise que resolve quando a pessoa é deletada.
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/people/${id}`);
  },
};

/**
 * Serviço de API para gerenciar Transações.
 */
export const transactionsService = {
  /**
   * Obtém todas as transações cadastradas.
   * @returns Promise com a lista de transações.
   */
  getAll: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>('/transactions');
    return response.data;
  },

  /**
   * Cria uma nova transação.
   * @param data Dados da transação a ser criada.
   * @returns Promise com a transação criada ou um erro.
   */
  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions', data);
    return response.data;
  },

  /**
   * Obtém o relatório de totais de receitas, despesas e saldos.
   * @returns Promise com o relatório de totais.
   */
  getTotals: async (): Promise<TotalsReportDto> => {
    const response = await apiClient.get<TotalsReportDto>('/transactions/totals');
    return response.data;
  },
};
