# Sistema de Controle de Estoque

Este projeto é uma aplicação web para gestão de estoque, desenvolvida com foco em agilidade, controle de entradas/saídas e visualização de dados operacionais.

## 🚀 Tecnologias

O frontend foi construído utilizando as seguintes tecnologias:

- **React:** Biblioteca principal para construção da interface.
- **Vite:** Ferramenta de build rápida para desenvolvimento.
- **Tailwind CSS:** Framework de estilização utilitária para um design moderno e responsivo.
- **React Router Dom:** Gerenciamento de rotas e navegação.
- **React Hook Form:** Gerenciamento de formulários.
- **Zod:** Validação de esquemas de dados.
- **Lucide React:** Biblioteca de ícones.

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (recomendado v18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 🛠️ Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd react-ts
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O projeto estará disponível em `http://localhost:5173` (ou conforme indicado no terminal).

## 📁 Estrutura do Projeto

- `src/components`: Componentes reutilizáveis e específicos do dashboard.
- `src/data`: Dados mockados para simulação.
- `src/hooks`: Hooks customizados para lógica de negócio (ex: `useInventory`).
- `src/layouts`: Estruturas de layout (ex: sidebar, header).
- `src/pages`: Páginas da aplicação (Login, Dashboard, Produtos, etc).
- `src/routes`: Definição das rotas e proteção de acesso (autenticação).
- `src/storage`: Lógica de persistência de dados (local storage).
- `src/utils`: Funções utilitárias.
