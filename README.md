# Sistema de Controle de Gastos Residenciais

Este projeto é um sistema de controle de gastos residenciais desenvolvido . O sistema permite o cadastro de pessoas, o registro de transações financeiras (receitas e despesas) e a visualização de relatórios consolidados de totais.

## Tecnologias Utilizadas

O sistema foi construído utilizando tecnologias modernas e robustas para garantir qualidade e manutenibilidade. No **back-end**, utilizamos o **.NET 8 com C#**, seguindo padrões de desenvolvimento como Injeção de Dependência e uma arquitetura organizada. Para a persistência de dados, foi utilizado o **Entity Framework Core com SQLite**, o que garante que as informações sejam mantidas mesmo após fechar a aplicação. No **front-end**, a aplicação foi desenvolvida com **React e TypeScript**, proporcionando uma interface de usuário reativa, tipada e eficiente, com o auxílio do **Vite** para o build e **Axios** para a comunicação com a API.

## Funcionalidades e Regras de Negócio

O sistema implementa as seguintes funcionalidades principais:

1.  **Cadastro de Pessoas**: Permite criar, listar e deletar pessoas. Cada pessoa possui um identificador único gerado automaticamente, nome e idade. Uma regra importante implementada é que, ao deletar uma pessoa, todas as suas transações associadas são removidas automaticamente (deleção em cascata).
2.  **Cadastro de Transações**: Permite registrar receitas e despesas vinculadas a uma pessoa cadastrada. Cada transação contém descrição, valor, tipo e o vínculo com a pessoa.
3.  **Regra de Idade**: O sistema valida se a pessoa é menor de idade (menos de 18 anos). Caso seja, o sistema permite apenas o cadastro de **despesas**, bloqueando o registro de receitas para menores.
4.  **Consulta de Totais**: Exibe uma listagem de todas as pessoas com seus respectivos totais de receitas, despesas e saldo individual. Ao final, apresenta um resumo geral com o total de receitas, despesas e o saldo líquido de todas as pessoas cadastradas.

## Como Executar o Projeto

### Pré-requisitos
- .NET 8 SDK
- Node.js (v18 ou superior)
- NPM ou PNPM

### Executando o Back-end
1. Navegue até a pasta `backend/HouseholdExpenses.Api`.
2. Execute o comando `dotnet run`.
3. A API estará disponível em `http://localhost:5000` (ou na porta configurada).
4. O banco de dados SQLite `household.db` será criado automaticamente na primeira execução.

### Executando o Front-end
1. Navegue até a pasta `frontend`.
2. Execute `npm install` para instalar as dependências.
3. Execute `npm run dev` para iniciar o servidor de desenvolvimento.
4. Acesse a aplicação em `http://localhost:3000`.

## Estrutura do Código

O código foi desenvolvido prezando pela legibilidade e seguindo boas práticas. No back-end, a lógica de negócio está centralizada no `HouseholdService`, mantendo os Controllers limpos e focados em lidar com as requisições HTTP. No front-end, os componentes são modulares e utilizam TypeScript para garantir a integridade dos dados trafegados. Todo o código está devidamente comentado, explicando a lógica por trás de cada funcionalidade e regra de negócio implementada.
