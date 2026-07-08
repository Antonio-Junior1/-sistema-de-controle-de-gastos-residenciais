import React, { useState, useEffect } from 'react';
import { PeopleForm } from './components/PeopleForm';
import { PeopleList } from './components/PeopleList';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { TotalsReport } from './components/TotalsReport';
import { peopleService, transactionsService } from './services/api';
import { Person, Transaction, CreatePersonDto, CreateTransactionDto, TotalsReportDto } from './types';
import { Users, Receipt, LayoutDashboard, Pencil, Zap, X, Plus, Home } from 'lucide-react';
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
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('userName') || '');
  const [inputName, setInputName] = useState('');
  const [lastActivity, setLastActivity] = useState<string>(() => localStorage.getItem('lastActivity') || 'Nenhuma atividade registrada recente.');

  const saveActivity = (text: string) => {
    localStorage.setItem('lastActivity', text);
    setLastActivity(text);
  };

  const handleResetName = () => {
    localStorage.removeItem('userName');
    setUserName('');
    setInputName('');
  };

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
      saveActivity(`Membro "${data.name}" (${data.age} anos) foi adicionado.`);
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
      saveActivity("Um membro da família foi excluído (e suas transações).");
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
      saveActivity(`${Number(data.type) === 0 ? 'Receita' : 'Despesa'} de R$ ${data.value.toFixed(2)} ("${data.description}") cadastrada.`);
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
      <div className="app-container">
        <header>
          <div className="header-content">
            <div className="brand">
              <div className="brand-logo">
                <Home size={20} className="brand-icon" />
              </div>
              <span className="brand-name">
                Finanças<span>do Lar</span>
              </span>
            </div>
            
            {/* Desktop Navigation Tabs */}
            <div className="desktop-tabs">
              <button 
                className={`desktop-tab-item ${activeTab === 'people' ? 'active' : ''}`} 
                onClick={() => setActiveTab('people')}
              >
                <Users size={16} />
                Membros
              </button>
              <button 
                className={`desktop-tab-item ${activeTab === 'transactions' ? 'active' : ''}`} 
                onClick={() => setActiveTab('transactions')}
              >
                <Receipt size={16} />
                Extrato
              </button>
              <button 
                className={`desktop-tab-item ${activeTab === 'totals' ? 'active' : ''}`} 
                onClick={() => setActiveTab('totals')}
              >
                <LayoutDashboard size={16} />
                Painel
              </button>
            </div>
          </div>
        </header>

        <div className="container main-content-wrapper">
          {error && <div className="error-message">{error}</div>}

          {activeTab === 'people' && (
            <div className="tab-view animate-fade">
              {userName && (
                <div className="user-welcome-bar">
                  <div className="welcome-greeting">
                    <span>Olá, <strong>{userName}</strong>! 👋</span>
                    <button className="btn-edit-name" onClick={handleResetName} title="Alterar nome">
                      <Pencil size={13} />
                    </button>
                  </div>
                  {lastActivity && (
                    <div className="last-activity-badge">
                      <span className="badge-icon">
                        <Zap size={13} />
                      </span>
                      <span className="badge-text">{lastActivity}</span>
                    </div>
                  )}
                </div>
              )}
              <PeopleList 
                people={people} 
                onDelete={handleDeletePerson} 
                isLoading={isLoading} 
                onAddClick={() => setIsAddPersonOpen(true)}
              />
              
              <button className="fab" onClick={() => setIsAddPersonOpen(true)} title="Cadastrar Pessoa">
                <Plus size={24} />
              </button>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="tab-view animate-fade">
              <TransactionList 
                transactions={transactions} 
                onAddClick={() => setIsAddTransactionOpen(true)}
              />
              
              <button className="fab" onClick={() => setIsAddTransactionOpen(true)} title="Cadastrar Transação">
                <Plus size={24} />
              </button>
            </div>
          )}

          {activeTab === 'totals' && (
            <div className="tab-view animate-fade">
              {totalsReport && <TotalsReport report={totalsReport} />}
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="bottom-nav">
          <button
            className={`nav-item ${activeTab === 'people' ? 'active' : ''}`}
            onClick={() => setActiveTab('people')}
          >
            <Users size={20} />
            <span>Membros</span>
          </button>
          
          <button
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <Receipt size={20} />
            <span>Extrato</span>
          </button>
          
          <button
            className={`nav-item ${activeTab === 'totals' ? 'active' : ''}`}
            onClick={() => setActiveTab('totals')}
          >
            <LayoutDashboard size={20} />
            <span>Painel</span>
          </button>
        </nav>

        {/* Modals - Bottom Sheets */}
        {isAddPersonOpen && (
          <div className="modal-overlay" onClick={() => setIsAddPersonOpen(false)}>
            <div className="modal-content bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="modal-drag-handle"></div>
              <button className="modal-close" onClick={() => setIsAddPersonOpen(false)}>
                <X size={18} />
              </button>
              <PeopleForm onSubmit={async (data) => {
                await handleCreatePerson(data);
                setIsAddPersonOpen(false);
              }} isLoading={isLoading} />
            </div>
          </div>
        )}

        {isAddTransactionOpen && (
          <div className="modal-overlay" onClick={() => setIsAddTransactionOpen(false)}>
            <div className="modal-content bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="modal-drag-handle"></div>
              <button className="modal-close" onClick={() => setIsAddTransactionOpen(false)}>
                <X size={18} />
              </button>
              <TransactionForm people={people} onSubmit={async (data) => {
                await handleCreateTransaction(data);
                setIsAddTransactionOpen(false);
              }} isLoading={isLoading} />
            </div>
          </div>
        )}

        {/* Welcome Modal */}
        {!userName && (
          <div className="welcome-overlay">
            <div className="welcome-card">
              <h2>🏡 Bem-vindo!</h2>
              <p>Para começar a organizar as finanças da sua casa, por favor digite seu nome:</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (inputName.trim()) {
                  localStorage.setItem('userName', inputName.trim());
                  setUserName(inputName.trim());
                }
              }}>
                <div className="welcome-input-group">
                  <label htmlFor="user-name-input">Seu Nome</label>
                  <input
                    id="user-name-input"
                    type="text"
                    placeholder="Ex: João"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Começar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
