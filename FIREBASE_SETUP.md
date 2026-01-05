# 🔥 Guia de Configuração do Firebase

## Passo 1: Criar Projeto no Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Digite um nome para o projeto: `fechamento-caixa` (ou o nome que preferir)
4. (Opcional) Desabilite o Google Analytics se não for necessário
5. Clique em **"Criar projeto"**

## Passo 2: Adicionar Web App

1. Na página inicial do projeto, clique no ícone **</>** (Web)
2. Digite um apelido para o app: `Fechamento Caixa Web`
3. **NÃO** marque "Firebase Hosting" (não é necessário por enquanto)
4. Clique em **"Registrar app"**
5. **COPIE** o código do `firebaseConfig` que aparecerá

Exemplo do que você verá:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. Cole essas credenciais em:
   - `src/environments/environment.ts` (desenvolvimento)
   - `src/environments/environment.prod.ts` (produção)

## Passo 3: Ativar Firestore Database

1. No menu lateral do Firebase Console, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"** ou **"Create database"**
3. Escolha a localização:
   - Recomendado para Brasil: `southamerica-east1` (São Paulo)
4. Escolha o modo de segurança:
   - **Modo de teste** (para desenvolvimento): Permite leitura/escrita por 30 dias
   - **Modo de produção**: Exige configuração de regras de segurança

### Opção: Modo de Teste (Desenvolvimento)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 3, 1);
    }
  }
}
```

### Opção: Modo de Produção (Recomendado)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /fechamentos/{docId} {
      // Permite leitura e escrita autenticada
      allow read, write: if request.auth != null;
      
      // OU para aplicação simples sem autenticação:
      // allow read, write: if true;
    }
  }
}
```

5. Clique em **"Criar"** ou **"Enable"**

## Passo 4: Estrutura do Firestore

Após o primeiro fechamento de caixa, o Firestore criará automaticamente:

```
Firestore Database
└── fechamentos (collection)
    └── [documento auto-gerado] (document)
        ├── data: Timestamp
        ├── detalhesDinheiro: Array
        │   └── [0]
        │       ├── valorUnitario: number
        │       ├── quantidade: number
        │       └── subtotal: number
        ├── totalDinheiro: number
        ├── totalCartao: number
        ├── totalPix: number
        ├── sangria: number
        └── totalGeral: number
```

## Passo 5: Testar Conexão

1. Execute o projeto:
   ```bash
   npm start
   ```

2. Acesse: `http://localhost:4200`

3. Faça um fechamento de caixa de teste

4. Volte ao Firebase Console e verifique se o documento foi criado em `Firestore Database` > `fechamentos`

## 🔐 Dicas de Segurança

### Para Desenvolvimento:
- Use o **modo de teste** com prazo limitado
- Nunca comite as credenciais do Firebase no Git público

### Para Produção:
- Implemente **Firebase Authentication**
- Configure **regras de segurança** adequadas
- Use **variáveis de ambiente** para credenciais
- Ative **App Check** para proteção contra bots

### Exemplo de Regras Seguras com Autenticação:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Função auxiliar para verificar autenticação
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Coleção de fechamentos
    match /fechamentos/{docId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📊 Índices (Opcional - Para Melhor Performance)

Se você notar lentidão nas queries, crie índices no Firestore:

1. Vá em **Firestore Database** > **Índices**
2. Clique em **"Criar índice"**
3. Configure:
   - **Coleção**: `fechamentos`
   - **Campos**:
     - `data` - Crescente
   - **Status**: Crescente

## 🆘 Solução de Problemas

### Erro: "Missing or insufficient permissions"
- Verifique as regras de segurança do Firestore
- Certifique-se de que o modo de teste está ativo

### Erro: "Firebase: Firebase App named '[DEFAULT]' already exists"
- Reinicie o servidor de desenvolvimento
- Limpe o cache do navegador

### Erro: "Cannot read property 'toDate' of undefined"
- Verifique se há dados no Firestore
- Certifique-se de que os documentos têm o campo `data` do tipo Timestamp

## ✅ Checklist de Configuração

- [ ] Projeto criado no Firebase Console
- [ ] Web App registrado
- [ ] Credenciais copiadas para `environment.ts`
- [ ] Firestore Database ativado
- [ ] Regras de segurança configuradas
- [ ] Aplicação testada localmente
- [ ] Primeiro fechamento de caixa salvo com sucesso

---

**Pronto! Seu Firebase está configurado e pronto para uso! 🚀**
