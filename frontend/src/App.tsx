import React, { useState, useEffect } from 'react';
import { PeopleForm } from './components/PeopleForm';
import { PeopleList } from './components/PeopleList';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { TotalsReport } from './components/TotalsReport';
import { peopleService, transactionsService } from './services/api';
import { Person, Transaction, CreatePersonDto, CreateTransactionDto, TotalsReportDto } from './types';
import './styles/index.css';

/**
 * Componente principal da aplicação.
 * Gerencia o estado global de pessoas, transações e relatórios.
 * Coordena as chamadas à API e a atualização dos dados.
 */
function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalsReport, setTotalsReport] = useState<TotalsReportDto | null>(null);
  const [activeTab, setActiveTab] = useState<'people' | 'transactions' | 'totals'>('people');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Carrega todas as pessoas da API ao montar o componente.
   */
  useEffect(() => {
    loadPeople();
  }, []);

  /**
   * Carrega todas as transações quando as pessoas mudam.
   */
  useEffect(() => {
    loadTransactions();
  }, [people]);

  /**
   * Carrega o relatório de totais quando as transações mudam.
   */
  useEffect(() => {
    loadTotalsReport();
  }, [transactions]);

  /**
   * Carrega a lista de pessoas da API.
   */
  const loadPeople = async () => {
    try {
      setError('');
      const data = await peopleService.getAll();
      setPeople(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pessoas';
      setError(errorMessage);
      console.error(errorMessage);
    }
  };

  /**
   * Carrega a lista de transações da API.
   */
  const loadTransactions = async () => {
    try {
      const data = await transactionsService.getAll();
      setTransactions(data);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
    }
  };

  /**
   * Carrega o relatório de totais da API.
   */
  const loadTotalsReport = async () => {
    try {
      const data = await transactionsService.getTotals();
      setTotalsReport(data);
    } catch (err) {
      console.error('Erro ao carregar relatório de totais:', err);
    }
  };

  /**
   * Manipula a criação de uma nova pessoa.
   */
  const handleCreatePerson = async (data: CreatePersonDto) => {
    setIsLoading(true);
    try {
      setError('');
      await peopleService.create(data);
      await loadPeople();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pessoa';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manipula a deleção de uma pessoa.
   */
  const handleDeletePerson = async (id: number) => {
    setIsLoading(true);
    try {
      setError('');
      await peopleService.delete(id);
      await loadPeople();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar pessoa';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manipula a criação de uma nova transação.
   */
  const handleCreateTransaction = async (data: CreateTransactionDto) => {
    setIsLoading(true);
    try {
      setError('');
      await transactionsService.create(data);
      await loadTransactions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar transação';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>💰 Sistema de Controle de Gastos Residenciais</h1>
      </header>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'people' ? 'active' : ''}`}
            onClick={() => setActiveTab('people')}
          >
            Pessoas
          </button>
          <button
            className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transações
          </button>
          <button
            className={`tab-button ${activeTab === 'totals' ? 'active' : ''}`}
            onClick={() => setActiveTab('totals')}
          >
            Relatório de Totais
          </button>
        </div>

        {activeTab === 'people' && (
          <div className="main-content">
            <PeopleForm onSubmit={handleCreatePerson} isLoading={isLoading} />
            <PeopleList people={people} onDelete={handleDeletePerson} isLoading={isLoading} />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="main-content">
            <TransactionForm people={people} onSubmit={handleCreateTransaction} isLoading={isLoading} />
            <TransactionList transactions={transactions} />
          </div>
        )}

        {activeTab === 'totals' && (
          <div>
            {totalsReport && <TotalsReport report={totalsReport} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
