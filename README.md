# TechsysLogWeb – Frontend Application

Frontend do sistema **TechsysLog**, desenvolvido com **Angular**, responsável pela interface do usuário para **autenticação, visualização e gerenciamento de pedidos, entregas e notificações em tempo real**, integrando-se ao backend via **API REST** e **SignalR**.

Este projeto foi construído com foco em **performance**, **lazy loading**, **organização modular**, **boas práticas de arquitetura frontend** e **experiência do usuário**.

---

## 1. Objetivo do Projeto

O objetivo deste frontend é fornecer uma aplicação web moderna capaz de:

- Autenticar usuários via JWT
- Manter sessão ativa mesmo após reload
- Exibir pedidos e entregas
- Receber notificações em tempo real
- Garantir navegação segura via guards
- Consumir APIs REST de forma eficiente
- Suportar crescimento do projeto com lazy loading e módulos isolados

---

## 2. Visão Funcional

Funcionalidades implementadas no frontend:

- Tela de Login
- Tela de Registro de Usuário
- Layout protegido para usuários autenticados
- Listagem de pedidos
- Listagem de entregas
- Central de notificações
- Comunicação em tempo real com o backend
- Persistência de autenticação no reload da página
- Tratamento global de erros HTTP

---

## 3. Arquitetura do Frontend

A aplicação segue uma arquitetura **modular e escalável**, alinhada às boas práticas recomendadas pelo Angular moderno.

Princípios adotados:

- Separação clara de responsabilidades
- Componentes com responsabilidades únicas
- Serviços desacoplados
- Guards para controle de acesso
- Lazy Loading para otimização de performance
- Standalone Components

---


---

## 4. Responsabilidade das Camadas

### Core
Contém elementos reutilizáveis e transversais da aplicação:

- Serviços globais
- Interceptors HTTP
- Guards de autenticação
- Models e contratos

### Features
Cada funcionalidade da aplicação fica isolada em sua própria pasta:

- auth (login e registro)
- orders
- deliveries
- notifications

### Layout
Responsável pela estrutura visual da aplicação autenticada:

- Header
- Sidebar
- Área de conteúdo

---

## 5. Roteamento e Segurança

O roteamento é feito utilizando **Angular Router**, com proteção de rotas via **AuthGuard**.

Exemplo conceitual:

- Rotas públicas:
  - `/login`
  - `/register`

- Rotas protegidas:
  - `/orders`
  - `/deliveries`
  - `/notifications`

Usuários não autenticados são redirecionados automaticamente para o login.

---

## 6. Autenticação e Sessão

- Autenticação baseada em **JWT**
- Token armazenado no `localStorage`
- Interceptor adiciona automaticamente o token nas requisições
- Validação de token no reload da aplicação
- Usuário permanece logado enquanto o token for válido

---

## 7. Comunicação com o Backend

- Consumo de API REST via `HttpClient`
- URLs centralizadas
- Tratamento global de erros HTTP
- Serviços especializados por domínio

---

## 8. Notificações em Tempo Real

- Integração com **SignalR**
- Conexão estabelecida após autenticação
- Atualizações recebidas em tempo real
- Notificações exibidas sem necessidade de refresh

---

## 9. Performance e Otimização

Medidas adotadas:

- Lazy Loading de rotas
- Standalone Components
- Separação por features
- Build otimizado para produção
- Redução de acoplamento entre componentes

---

## 10. Tecnologias Utilizadas

- Angular
- TypeScript
- Angular Router
- RxJS
- SignalR Client
- Angular CLI
- Vitest (testes)
- HTML / CSS

---

## 11. Pré-requisitos

- Node.js
- Angular CLI

---

## 12. Servidor de Desenvolvimento

Para iniciar o servidor local:

```bash
ng serve