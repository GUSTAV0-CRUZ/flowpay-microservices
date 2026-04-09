# 💳 FlowPay - Async Payment Microservices

> Plataforma de pagamentos resiliente e event-driven, focada em consistência de dados crítica e inspirada em padrões reais de sistemas financeiros.

---

## 🚀 Status do Projeto

![Status](https://img.shields.io/badge/status-concluido-brightgreen)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![NestJS](https://img.shields.io/badge/framework-NestJS-red)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![RabbitMQ](https://img.shields.io/badge/messaging-RabbitMQ-orange)
![Stripe](https://img.shields.io/badge/payments-Stripe-purple)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)
![Tests](https://img.shields.io/badge/tests-Jest-blueviolet)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-black)

---

## 📌 Sobre o Projeto

O **FlowPay** é um ecossistema de microserviços projetado para resolver um dos problemas mais críticos de sistemas financeiros: **garantir consistência de dados em pagamentos distribuídos**.

A aplicação simula um fluxo real de compra:

- 💳 Criação de pagamento (Stripe)  
- 📦 Reserva de produto  
- 🔄 Confirmação ou rollback automático  
- ⏱️ Expiração de transações pendentes  
- 💸 Estorno de pagamento

---

## 🧨 Problemas Resolvidos

- Evitar cobrança duplicada (**idempotência com chave única**)  
- Garantir rollback em falhas (**Saga Pattern coreografado**)  
- Evitar dependência síncrona entre serviços  
- Garantir consistência eventual entre dados  
- Prevenir perda de mensagens em falhas de infraestrutura  

---

## 🏗️ Arquitetura

### 📷 Diagrama da Arquitetura
![Arquitetura](./docs/images/architecture.png)

```
Client → API Gateway → RabbitMQ → Microservices
```

Arquitetura orientada a eventos com comunicação totalmente assíncrona.

---

## 🔄 Fluxo de Pagamento

### 📷 Diagrama da Saga
![Fluxo](./docs/images/flow.png)

```
1. Cliente solicita compra
2. Order valida produto
3. Payment cria PaymentIntent (Stripe)
4. Produto é reservado
5. Webhook atualiza status:
   → sucesso → confirma pedido
   → falha → cancela pagamento
   → cancelado → rollback do produto
6. Expiração automática cancela pagamentos pendentes
```

---

## 🖥️ Execução em Ambiente Real

### 📦 Docker Compose em execução
![Docker](./docs/images/docker.png)

Execução isolada de múltiplos microserviços + bancos MongoDB.

---

### 📨 RabbitMQ (Filas e Exchanges)
![RabbitMQ](./docs/images/rabbitmq.png)

- Comunicação assíncrona  
- Filas desacopladas  
- Uso de **Delayed Exchange (x-delayed-message)**  

---

### 📡 Swagger (API Gateway)
![Swagger](./docs/images/swagger.png)

Documentação centralizada da API.

---

### ⚙️ CI/CD (GitHub Actions)
![CI](./docs/images/ci.png)

Pipeline automatizado garantindo qualidade e build:

```
Checkout → Install → Test → Build
```

---

## 🔹 Microserviços

### API Gateway
- Entrada HTTP  
- Recebe Webhooks do Stripe  
- Encaminha eventos para mensageria  

### Service Order
- Orquestra o fluxo de compra  
- Gerencia estado do produto  
- Coordena reserva e confirmação  

### Service Payment
- Integração com Stripe  
- Controle de status do pagamento  
- Expiração automática  

### Inventory Product
- Fonte da verdade dos produtos  
- Controle de disponibilidade  
- Sincronização via eventos  

---

## 🧠 Conceitos Aplicados

- Arquitetura orientada a eventos  
- RabbitMQ (mensageria)  
- Saga Pattern (coreografado)  
- Idempotência  
- Consistência eventual  
- ACK/NACK  
- At-least-once delivery  
- TTL com mensagens atrasadas  

---

## ⚙️ Decisões de Engenharia

### 🔹 Idempotência

- Chave única (`idPaymentIntent`)  
- Controle de estados:
  - PENDING
  - PAID
  - FAILED
  - CANCELED  

---

### 🔹 Resiliência com ACK/NACK Inteligente

- Erros de infraestrutura → `nack (requeue)`  
- Erros de negócio → `ack`  

Evita perda de mensagens e loops infinitos.

---

### 🔹 Saga Pattern (Coreografado)

- Sucesso → confirmação do pedido  
- Falha → cancelamento  
- Cancelamento → rollback  

Sem orquestrador central → baixo acoplamento.

---

### 🔹 Expiração de Pagamentos (TTL)

- Tempo limite: **10 minutos**  
- Implementado via `x-delay` no RabbitMQ  
- Evento: `payment-expire`  

---

### 🔹 Integração com Stripe

Eventos tratados:

- `payment_intent.succeeded`  
- `payment_intent.payment_failed`  
- `payment_intent.canceled`  

Webhook validado com assinatura.

---

### 🔹 Source of Truth

- Inventory Product é o dono do dado  
- Order mantém cópia sincronizada  
- Comunicação via eventos  

---

### 🔹 Custom RMQ Driver (Engineered Solution)

Durante o desenvolvimento, foi identificado que as abstrações padrão do NestJS (`ClientProxy`) não ofereciam suporte adequado para manipulação de headers específicos do protocolo AMQP, necessários para o uso do plugin `x-delayed-message`.

Em especial, não era possível garantir a injeção correta do header `x-delay`, comprometendo a implementação do mecanismo de expiração de pagamentos.

**Solução adotada:**

Desenvolvimento de um `RabbitmqService` customizado utilizando a biblioteca nativa `amqplib`, permitindo controle total sobre o protocolo AMQP.

**Benefícios:**

- **Manipulação precisa de headers**  
  Injeção direta do campo `x-delay`

- **Controle total do transporte**  
  Eliminação das limitações da abstração do NestJS

- **Compatibilidade com microserviços NestJS**  
  Emulação do envelope (`pattern` + `data`), garantindo integração com os consumidores

---

> ⚠️ Trade-off: aumento da complexidade em troca de maior controle e previsibilidade no fluxo de mensageria.

---

## 🐳 Execução Local

### 📋 Pré-requisitos

- Docker  
- Docker Compose  
- Conta Stripe (modo teste)

---

### ▶️ Rodando o projeto

```bash
git clone https://github.com/GUSTAV0-CRUZ/flowpay-microservices.git
cd flowpay-microservices
```

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

```bash
docker compose up --build
```

---

## 📁 Estrutura do Projeto

```
flowpay-microservices/
 ├── .github
 ├── api-gateway
 ├── inventory-product
 ├── rabbitmq-custom
 ├── service-order
 ├── service-payment
 ├── docker-compose.yml
 └── README.md
```

---

## 🛠️ Stack Tecnológica

| Categoria        | Tecnologia         |
|-----------------|------------------|
| Backend         | NestJS            |
| Mensageria      | RabbitMQ          |
| Pagamentos      | Stripe API        |
| Banco de Dados  | MongoDB           |
| Containerização | Docker + Compose  |
| Testes          | Jest              |
| CI/CD           | GitHub Actions    |

---

## ✅ Testes

- Testes unitários  
- Validação de regras críticas  
- Mocks de mensageria  

```bash
npm run test
```

---

## 📚 Aprendizados

- Sistemas distribuídos na prática  
- Saga Pattern real  
- Integração com Stripe  
- Resiliência com mensageria  
- Consistência eventual  

---

## 👨‍💻 Autor

<img src="https://github.com/GUSTAV0-CRUZ.png" width="100px;" />

**Gustavo Cruz**  
💼 Backend Developer (Node.js | NestJS | Microservices)  
📧 gustavo.cruzs.dev@gmail.com  

🔗 https://github.com/GUSTAV0-CRUZ