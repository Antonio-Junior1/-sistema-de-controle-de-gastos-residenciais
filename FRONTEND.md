# 💻 Documentação do Front-end - Finanças do Lar

Este documento resume a evolução, as decisões de design e as novas funcionalidades implementadas no front-end da aplicação **Finanças do Lar**.

---

## 🎨 Identidade Visual e Temática

Substituímos o tema escuro/genérico por um visual aconchegante, moderno e comercial, focado na experiência de uso familiar:
* **Paleta de Cores**: Composta por variações suaves de azul claro, branco puro e cinza-azulado para transmitir tranquilidade e organização.
* **Tipografia**: Utiliza a fonte premium Google Fonts **Plus Jakarta Sans** com renderização suave e pesos contrastantes.
* **Logotipo Moderno (Estilo SaaS)**: O antigo emoji genérico `🏡` foi substituído por um logotipo com o ícone `Home` da biblioteca Lucide React abrigado em um container com gradiente azul e sombra suave. A escrita utiliza pesos duplos: **Finanças** em negrito pesado (`850`) e **do Lar** em peso médio (`500`).

---

## 📱💻 Layout Adaptativo Inteligente (Responsividade Total)

O aplicativo foi projetado com suporte nativo a dois modos de exibição dinâmicos que se adaptam conforme o tamanho da tela:

### 1. Comportamento em Desktops (Computadores/PC)
* **Dashboard Expandido**: Largura máxima limitada a `1100px` centralizada na tela, com bordas arredondadas e sombra flutuante.
* **Navegação do Cabeçalho**: Links horizontais limpos no topo da tela (`Membros`, `Extrato`, `Painel`) para navegação clássica.
* **Modais Popup**: Formulários de cadastro abrem centralizados na tela sobre uma camada desfocada (*backdrop filter blur*).
* **Botões de Cabeçalho**: Botões de cadastro (`+ Novo Membro`, `+ Nova Transação`) integrados diretamente no topo de cada seção.

### 2. Comportamento em Celulares (Smartphones)
* **Visual Compacto**: O aplicativo ocupa toda a largura da tela sem bordas excessivas.
* **Barra de Navegação Inferior (Bottom Nav Bar)**: Os links do cabeçalho são ocultados e uma barra de acesso rápido aparece no rodapé com ícones fáceis de tocar.
* **Gavetas Deslizantes (Bottom Sheets)**: Os formulários deslizam de baixo para cima com animações fluidas simulando um app nativo iOS/Android.
* **Botão Flutuante (FAB)**: Os botões de cabeçalho dão lugar a um botão flutuante circular `+` fixo no canto inferior direito.

---

## 🚪 Fluxo de Entrada e Atividades Recentes

* **Tela de Identificação**: Ao abrir a aplicação pela primeira vez, uma tela com efeito *glassmorphism* solicita o nome do usuário. O nome é gravado no `localStorage` do navegador para evitar perguntas subsequentes.
* **Saudação Personalizada**: Exibida exclusivamente no topo da tela principal ("Membros"), mostrando a mensagem `Olá, [Seu Nome]! 👋` junto com um botão de edição (`✏️`) para alteração rápida.
* **Rastreador de Atividade (⚡)**: Uma etiqueta dinâmica monitora as ações do usuário em tempo real (ex: `"Despesa de R$ 50,00 ("Supermercado") cadastrada."` ou `"Membro foi adicionado"`) persistindo as informações localmente.

---

## 📊 Componentes Visuais e Contêineres de Dados

* **Bordas superiores de Destaque**: As caixas principais de Membros, Extrato e Relatório ganharam uma borda azul superior de `4px` para estruturação de marca.
* **Tabelas Zebradas e Fortalecidas**:
  * As linhas das tabelas agora possuem coloração alternada (zebra striping) em azul-claro sutil (`rgba(59, 130, 246, 0.03)`), facilitando a leitura horizontal.
  * As linhas divisórias foram fortalecidas para `1.5px` para delimitar melhor as linhas da tabela.
  * As colunas de **Valor** e **Tipo** (no extrato e relatórios) foram horizontalmente **centralizadas** na tela para melhor alinhamento e organização dos números.
* **Cartões de Totais com Cores Reais**:
  * **Receitas**: Fundo gradiente verde-claro com textos em verde-escuro e ícone de tendência para cima (`TrendingUp`).
  * **Despesas**: Fundo gradiente vermelho/rosa-claro com textos em vermelho-escuro e ícone de tendência para baixo (`TrendingDown`).
  * **Saldo Geral Inteligente**: Adapta-se automaticamente. Se o saldo consolidado for positivo, pinta-se de verde; se negativo, pinta-se imediatamente de vermelho.

---

## 🛠️ Tecnologias Utilizadas no Front-end

1. **Vite + React + TypeScript** (Build rápido e tipagem estática).
2. **Lucide React** (Pacote premium de ícones vetoriais integrados).
3. **CSS Customizado** (Estilos organizados em arquivos modulares separados por componentes, sem ad-hocs ou frameworks pesados).
4. **LocalStorage API** (Para persistência local de nome de usuário e última atividade).
