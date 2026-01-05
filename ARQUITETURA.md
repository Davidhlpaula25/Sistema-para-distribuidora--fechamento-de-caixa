# 🏗️ Arquitetura do Projeto

## 📁 Estrutura Completa de Arquivos

```
Sistema de caixa/
│
├── node_modules/                    # Dependências instaladas
│
├── src/                             # Código fonte
│   ├── app/                         # Aplicação Angular
│   │   ├── components/              # Componentes da aplicação
│   │   │   ├── fechamento/          # ⭐ Componente de Fechamento
│   │   │   │   ├── fechamento.component.ts       # Lógica com Signals
│   │   │   │   ├── fechamento.component.html     # Template HTML
│   │   │   │   └── fechamento.component.css      # Estilos
│   │   │   │
│   │   │   └── relatorios/          # ⭐ Componente de Relatórios
│   │   │       ├── relatorios.component.ts       # Lógica do dashboard
│   │   │       ├── relatorios.component.html     # Template HTML
│   │   │       └── relatorios.component.css      # Estilos
│   │   │
│   │   ├── models/                  # Interfaces TypeScript
│   │   │   └── fechamento-caixa.model.ts         # 📋 Modelos de dados
│   │   │
│   │   ├── services/                # Serviços
│   │   │   └── fechamento-caixa.service.ts       # 🔥 Service do Firebase
│   │   │
│   │   ├── app.component.ts         # Componente raiz
│   │   ├── app.config.ts            # Configuração do app
│   │   └── app.routes.ts            # 🛣️ Rotas da aplicação
│   │
│   ├── environments/                # Configurações de ambiente
│   │   ├── environment.ts           # Desenvolvimento
│   │   └── environment.prod.ts      # Produção
│   │
│   ├── assets/                      # Arquivos estáticos
│   ├── index.html                   # HTML principal
│   ├── main.ts                      # Ponto de entrada
│   └── styles.css                   # Estilos globais
│
├── angular.json                     # Configuração do Angular CLI
├── tsconfig.json                    # Configuração TypeScript
├── tsconfig.app.json                # Config TS para app
├── package.json                     # Dependências do projeto
├── package-lock.json                # Lock de dependências
│
├── .gitignore                       # Arquivos ignorados pelo Git
├── README.md                        # 📖 Documentação principal
├── FIREBASE_SETUP.md                # 🔥 Guia de setup Firebase
└── GUIA_DE_USO.md                   # 💡 Guia de uso prático
```

## 🧩 Fluxo de Dados

### 1️⃣ Fechamento de Caixa

```
┌─────────────────────────────────────────────────────────────┐
│                    FECHAMENTO COMPONENT                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Template HTML (fechamento.component.html)            │  │
│  │ • Input de quantidades                               │  │
│  │ • Inputs de Cartão/PIX/Sangria                       │  │
│  │ • Botão "Fechar Caixa"                               │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                          │
│                   │ (two-way binding)                        │
│                   ▼                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ TypeScript (fechamento.component.ts)                 │  │
│  │ • denominacoes = signal([...])     ← Estado          │  │
│  │ • totalDinheiro = computed(...)    ← Cálculo Auto    │  │
│  │ • totalGeral = computed(...)       ← Cálculo Auto    │  │
│  │ • fecharCaixa() → Service          ← Ação            │  │
│  └────────────────┬─────────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    │ fechamentoService.salvarFechamento()
                    ▼
┌─────────────────────────────────────────────────────────────┐
│            FECHAMENTO CAIXA SERVICE                          │
│  • salvarFechamento(fechamento) → Firebase                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE FIRESTORE                        │
│  Collection: fechamentos                                     │
│  • Documento criado com timestamp                            │
│  • Dados persistidos na nuvem                                │
└─────────────────────────────────────────────────────────────┘
```

### 2️⃣ Dashboard de Relatórios

```
┌─────────────────────────────────────────────────────────────┐
│                   RELATORIOS COMPONENT                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Template HTML (relatorios.component.html)            │  │
│  │ • Filtros de data                                    │  │
│  │ • Cards de KPI                                       │  │
│  │ • Gráfico (ng2-charts)                               │  │
│  │ • Tabela de fechamentos                              │  │
│  │ • Botões exportar                                    │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                          │
│                   ▼                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ TypeScript (relatorios.component.ts)                 │  │
│  │ • ngOnInit() → busca dados                           │  │
│  │ • filtrarRelatorios() → filtra por período           │  │
│  │ • exportarExcel() → gera arquivo XLSX               │  │
│  │ • exportarPDF() → gera arquivo PDF                   │  │
│  └────────────────┬─────────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    │ fechamentoService.filtrarPorPeriodo()
                    ▼
┌─────────────────────────────────────────────────────────────┐
│            FECHAMENTO CAIXA SERVICE                          │
│  • filtrarPorPeriodo(inicio, fim) → Observable               │
│  • calcularKPIs(fechamentos) → KPI                           │
│  • prepararDadosGrafico(fechamentos) → DadosGrafico          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE FIRESTORE                        │
│  Query: where('data', '>=', inicio)                          │
│         .where('data', '<=', fim)                            │
│  • Retorna Observable<FechamentoCaixa[]>                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Subscribe
                  ▼
┌─────────────────────────────────────────────────────────────┐
│               PROCESSAMENTO NO COMPONENT                     │
│  • Dados recebidos via Observable                            │
│  • KPIs calculados                                           │
│  • Gráfico atualizado                                        │
│  • Tabela populada                                           │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Padrões Arquiteturais Utilizados

### 1. **Standalone Components** (Angular 18+)
```typescript
@Component({
  selector: 'app-fechamento',
  standalone: true,  // ✅ Sem módulos NgModule
  imports: [CommonModule, FormsModule],
  // ...
})
```

**Vantagens:**
- Menos boilerplate
- Melhor tree-shaking
- Carregamento lazy load mais simples

### 2. **Signals** (Reatividade Moderna)
```typescript
// Estado reativo
denominacoes = signal([...]);

// Valores computados automaticamente
totalGeral = computed(() => 
  this.totalDinheiro() + this.totalCartao() + this.totalPix()
);
```

**Vantagens:**
- Reatividade granular
- Melhor performance
- Código mais limpo

### 3. **Dependency Injection**
```typescript
private fechamentoService = inject(FechamentoCaixaService);
private router = inject(Router);
```

**Vantagens:**
- Testabilidade
- Desacoplamento
- Reutilização

### 4. **Observable Pattern** (RxJS)
```typescript
filtrarPorPeriodo(inicio, fim): Observable<FechamentoCaixa[]> {
  // Retorna stream de dados
}
```

**Vantagens:**
- Operações assíncronas
- Composição de dados
- Cancelamento automático

## 🔄 Ciclo de Vida dos Componentes

### Fechamento Component
```
1. Constructor executado
2. Signals inicializados
3. Template renderizado
4. Usuário digita quantidade → Signal atualiza
5. Computed signals recalculam automaticamente
6. Template re-renderiza apenas o necessário
7. Usuário clica "Fechar Caixa"
8. Service salva no Firebase
9. Callback de sucesso → mensagem exibida
```

### Relatórios Component
```
1. Constructor executado
2. ngOnInit() chamado
   ├─ filtrarRelatorios() executado
   ├─ Service faz query no Firestore
   └─ Observable emite dados
3. Subscribe recebe dados
   ├─ fechamentos signal atualizado
   ├─ KPIs calculados
   ├─ Dados do gráfico preparados
   └─ Template atualizado automaticamente
```

## 📊 Modelo de Dados no Firestore

```
Firestore Database
│
└── fechamentos (Collection)
    │
    ├── [auto-id-1] (Document)
    │   ├── data: Timestamp(2026-01-05 18:30:00)
    │   ├── detalhesDinheiro: Array
    │   │   ├── [0]
    │   │   │   ├── valorUnitario: 50
    │   │   │   ├── quantidade: 10
    │   │   │   └── subtotal: 500
    │   │   └── [1]
    │   │       ├── valorUnitario: 100
    │   │       ├── quantidade: 5
    │   │       └── subtotal: 500
    │   ├── totalDinheiro: 1000
    │   ├── totalCartao: 1500
    │   ├── totalPix: 800
    │   ├── sangria: 200
    │   └── totalGeral: 3100
    │
    ├── [auto-id-2] (Document)
    │   └── ... (mesma estrutura)
    │
    └── [auto-id-n]
        └── ...
```

## 🚦 Fluxo de Roteamento

```
URL: http://localhost:4200
        │
        ├─ /                    → Redirect para /fechamento
        │
        ├─ /fechamento          → FechamentoComponent (lazy load)
        │   └── Calculadora automática de caixa
        │
        ├─ /relatorios          → RelatoriosComponent (lazy load)
        │   └── Dashboard analítico
        │
        └─ /** (qualquer outra) → Redirect para /fechamento
```

## 🎨 Sistema de Design

### Paleta de Cores
```css
--primary-color: #2c3e50    /* Azul escuro - Headers */
--secondary-color: #3498db  /* Azul - Botões secundários */
--success-color: #27ae60    /* Verde - Valores positivos */
--warning-color: #f39c12    /* Amarelo - Alertas */
--danger-color: #e74c3c     /* Vermelho - Sangria */
--light-bg: #ecf0f1         /* Cinza claro - Backgrounds */
```

### Componentes UI
- **Cards**: Bordas arredondadas (12px), sombra sutil
- **Botões**: Transições suaves, efeito hover (translateY)
- **Inputs**: Borda 2px, foco com cor secundária
- **Total Geral**: Destaque máximo (4rem, animação pulse)

## 🔧 Tecnologias por Camada

| Camada           | Tecnologia          | Propósito                    |
|------------------|---------------------|------------------------------|
| **Frontend**     | Angular 18+         | Framework principal          |
| **UI**           | CSS Grid/Flexbox    | Layout responsivo            |
| **Estado**       | Signals             | Gerenciamento de estado      |
| **Navegação**    | Angular Router      | Roteamento SPA               |
| **Backend**      | Firebase Firestore  | Banco de dados NoSQL         |
| **Gráficos**     | ng2-charts + Chart.js | Visualização de dados      |
| **Exportação**   | xlsx + jsPDF        | Geração de arquivos          |
| **Build**        | Angular CLI         | Bundling e otimização        |

---

**Arquitetura moderna, escalável e de fácil manutenção! 🚀**
