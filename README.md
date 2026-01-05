# 💰 Sistema de Fechamento de Caixa

Sistema completo de fechamento de caixa para distribuidoras, desenvolvido com Angular 18+ (Standalone Components e Signals) e Firebase Firestore.

## 🚀 Tecnologias Utilizadas

- **Frontend**: Angular 18+ (Standalone Components + Signals)
- **Backend/Banco**: Firebase Firestore
- **Gráficos**: ng2-charts com Chart.js
- **Exportação**: xlsx (Excel) e jspdf (PDF)

## 📦 Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Firebase

Edite o arquivo `src/environments/environment.ts` com suas credenciais do Firebase:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
  }
};
```

**Como obter as credenciais:**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **Configurações do Projeto** > **Geral**
4. Role até "Seus aplicativos" e clique em "Web"
5. Copie as credenciais do `firebaseConfig`
6. No Firebase Console, ative o **Firestore Database** em modo de teste ou produção

### 3. Executar o Projeto

```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`

## 🎯 Funcionalidades

### 📍 Rota 1: `/fechamento` - Facilitador de Contagem

**Calculadora Automática de Caixa:**
- ✅ Contagem de moedas (R$ 0,05 a R$ 1,00)
- ✅ Contagem de cédulas (R$ 2 a R$ 200)
- ✅ Cálculo automático de subtotais usando **Signals**
- ✅ Atualização instantânea do Total em Dinheiro
- ✅ Campos para Cartão, PIX e Sangria
- ✅ **Total Geral em destaque** (animado e grande)
- ✅ Botão "Fechar Caixa" que salva no Firestore
- ✅ Layout responsivo e intuitivo

**Características Técnicas:**
- **Signals** para reatividade automática
- **Computed Signals** para cálculos derivados
- Validação de entrada
- Feedback visual de salvamento

### 📍 Rota 2: `/relatorios` - Dashboard Analítico

**Filtros e Visualizações:**
- 📅 Filtro por período (data início e fim)
- 📊 **Cards de KPI**:
  - Total Vendido
  - Ticket Médio
  - Quantidade de Fechamentos
- 💳 **Divisão por Tipo de Pagamento**:
  - Dinheiro, Cartão, PIX e Sangria
  - Barras de progresso visuais
- 📈 **Gráfico de Linha**: Evolução do faturamento diário
- 📋 **Tabela de Fechamentos**: Lista completa com todos os dados
- 📗 **Exportar Excel**: Gera arquivo `.xlsx` com os dados filtrados
- 📕 **Exportar PDF**: Gera relatório em PDF com tabela formatada

## 🗂️ Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── fechamento/
│   │   │   ├── fechamento.component.ts
│   │   │   ├── fechamento.component.html
│   │   │   └── fechamento.component.css
│   │   └── relatorios/
│   │       ├── relatorios.component.ts
│   │       ├── relatorios.component.html
│   │       └── relatorios.component.css
│   ├── models/
│   │   └── fechamento-caixa.model.ts
│   ├── services/
│   │   └── fechamento-caixa.service.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
│   └── environment.ts
├── index.html
├── main.ts
└── styles.css
```

## 📊 Modelo de Dados (Firestore)

### Coleção: `fechamentos`

```typescript
interface FechamentoCaixa {
  id?: string;
  data: Timestamp;
  detalhesDinheiro: DetalheDinheiro[];
  totalDinheiro: number;
  totalCartao: number;
  totalPix: number;
  sangria: number;
  totalGeral: number;
}

interface DetalheDinheiro {
  valorUnitario: number;
  quantidade: number;
  subtotal: number;
}
```

## 🎨 Destaques de UI/UX

- ✨ Design moderno e limpo
- 🎯 Total Geral com animação de pulse
- 📱 100% Responsivo (mobile-first)
- 🌈 Paleta de cores profissional
- ⚡ Feedback visual imediato
- 💫 Transições suaves
- 🔢 Formatação monetária brasileira (R$)

## 🛠️ Service do Firebase

O `FechamentoCaixaService` oferece:

```typescript
// Salvar fechamento
salvarFechamento(fechamento: FechamentoCaixa): Promise<string>

// Buscar todos os fechamentos
obterTodosFechamentos(): Observable<FechamentoCaixa[]>

// Filtrar por período
filtrarPorPeriodo(dataInicio: Date, dataFim: Date): Observable<FechamentoCaixa[]>

// Calcular KPIs
calcularKPIs(fechamentos: FechamentoCaixa[]): KPI

// Preparar dados para gráfico
prepararDadosGrafico(fechamentos: FechamentoCaixa[]): DadosGrafico
```

## 🔥 Funcionalidades Avançadas

### Signals e Reatividade
- Uso intensivo de **Signals** para estado reativo
- **Computed Signals** para cálculos automáticos
- Zero prop drilling, código limpo e performático

### Exportação de Dados
- **Excel**: Biblioteca XLSX para planilhas completas
- **PDF**: jsPDF + autoTable para relatórios profissionais
- Nomes de arquivo automáticos com período

### Gráficos Dinâmicos
- Chart.js integrado com ng2-charts
- Gráfico de linha responsivo
- Cores e estilos personalizados
- Formatação de valores em R$

## 📝 Como Usar

### 1. Fazer um Fechamento de Caixa

1. Acesse `/fechamento`
2. Digite a quantidade de cada moeda/cédula
3. Informe valores de Cartão, PIX e Sangria
4. Veja o Total Geral atualizar automaticamente
5. Clique em "Fechar Caixa" para salvar

### 2. Visualizar Relatórios

1. Acesse `/relatorios`
2. Selecione o período desejado
3. Clique em "Filtrar"
4. Analise os KPIs, gráfico e tabela
5. Exporte para Excel ou PDF conforme necessário

## 🚀 Build de Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/fechamento-caixa/`

## 📄 Licença

Projeto desenvolvido para fins educacionais e comerciais.

---

**Desenvolvido com ❤️ usando Angular 18+ e Firebase**
