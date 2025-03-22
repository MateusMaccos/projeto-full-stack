# 📩 Broadcast Messages

Este projeto é um sistema de envio programado de mensagens, permitindo o cadastro de usuários, criação de contatos e gerenciamento de conexões. Utiliza **Firebase** para autenticação e armazenamento de dados, além de **React (Vite)** para a interface.

## 🚀 Funcionalidades

- 📌 **Login e Cadastro de Usuários**
- 📇 **Criação e Gerenciamento de Contatos**
- 🔗 **Conexão entre Usuários**
- ⏳ **Agendamento de Mensagens**
- 📤 **Envio Automático de Mensagens Programadas**

---

## 🛠️ Tecnologias Utilizadas

- **React (Vite)** - Interface do usuário
- **Firebase (Auth & Firestore)** - Autenticação e banco de dados
- **Tailwind CSS** - Estilização da interface
- **TypeScript** - Tipagem segura

---

## 📦 Configuração do Projeto

### 🔧 1. Clone o repositório

```sh
git clone https://github.com/seu-usuario/broadcast-messages.git
cd broadcast-messages
```

### 📦 2. Instale as dependências

```sh
npm install  # ou yarn install
```

### 🔑 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e adicione:

```env
VITE_FIREBASE_API_KEY=SUACHAVEAQUI
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdefghij
```

### 🚀 4. Inicie o projeto

```sh
npm run dev  # ou yarn dev
```

---

## 🎯 Fluxo de Uso

### 🛠️ **1. Cadastro e Login**

Os usuários podem se cadastrar e fazer login usando o Firebase Authentication.

### 📇 **2. Criar Contatos**

Após o login, o usuário pode adicionar contatos à sua lista de conexões.

### 🔗 **3. Conectar-se a Outros Usuários**

Os contatos são gerenciados através do Firestore, permitindo conexões entre usuários.

### ⏳ **4. Agendar Mensagens**

Os usuários podem escrever mensagens e agendar o envio para um horário específico.

### 📤 **5. Envio Automático**

O sistema verifica mensagens agendadas e as envia automaticamente no momento correto.

---

## 📄 Estrutura do Projeto

```
📂 src
 ┣ 📂 components      # Componentes reutilizáveis
 ┣ 📂 pages           # Páginas principais (Login, Dashboard, etc.)
 ┣ 📂 services        # Configuração do Firebase
 ┣ 📂 styles          # Estilização com Tailwind
 ┣ 📜 main.tsx        # Arquivo principal
 ┗ 📜 App.tsx         # Estrutura do aplicativo
```

---

## 🛠️ Melhorias Futuras

- ✅ Notificações de mensagens enviadas
- ✅ Melhor interface para seleção de contatos
- ✅ Histórico de mensagens
- ✅ Suporte a envio de mídias

