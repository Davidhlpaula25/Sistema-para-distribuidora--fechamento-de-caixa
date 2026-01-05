# 🚀 Guia de Deploy na Vercel

## ✅ **Seu projeto está PRONTO para deploy!**

Siga este passo a passo para fazer o deploy na Vercel.

---

## 📋 **Pré-requisitos**

- [x] Código Angular funcionando
- [x] Firebase configurado
- [x] Conta no GitHub (criar em https://github.com se não tiver)
- [ ] Conta na Vercel (criar em https://vercel.com)

---

## 🔐 **IMPORTANTE: Segurança das Chaves do Firebase**

### **Opção 1: Commitar com as chaves (Mais Fácil - Recomendado para este projeto)**

✅ **Pode commitar normalmente** - As chaves do Firebase no `environment.ts` são **públicas por natureza** e ficam expostas no frontend de qualquer forma. Elas são protegidas pelas **regras de segurança do Firestore**.

**Vantagem**: Deploy simples e direto, sem configuração adicional.

### **Opção 2: Usar Variáveis de Ambiente (Mais Seguro - Recomendado para produção)**

Se quiser máxima segurança:

1. **Antes do commit**, abra `.gitignore` e descomente estas linhas:
   ```
   /src/environments/environment.ts
   /src/environments/environment.prod.ts
   ```

2. **Na Vercel**, após importar o projeto, adicione as variáveis de ambiente:
   - `NG_FIREBASE_API_KEY`: AIzaSyD63SZEHG2vUPFjpGuHvy8OaTeFeCQT9XE
   - `NG_FIREBASE_AUTH_DOMAIN`: fechamento-caixa1.firebaseapp.com
   - `NG_FIREBASE_PROJECT_ID`: fechamento-caixa1
   - etc...

---

## 🎯 **Passo a Passo: Deploy na Vercel**

### **1️⃣ Preparar o Repositório Git**

Abra o PowerShell na pasta do projeto e execute:

```powershell
# Inicializar Git (se ainda não fez)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "feat: Sistema completo de fechamento de caixa com Angular e Firebase"

# Verificar se está tudo ok
git status
```

### **2️⃣ Criar Repositório no GitHub**

1. Acesse: https://github.com/new
2. Nome do repositório: `fechamento-caixa` (ou o nome que preferir)
3. Descrição: "Sistema de Fechamento de Caixa para Distribuidoras"
4. Deixe como **público** ou **privado** (sua escolha)
5. **NÃO** marque nenhuma opção (README, .gitignore, etc)
6. Clique em **"Create repository"**

### **3️⃣ Conectar e Enviar para o GitHub**

O GitHub vai mostrar instruções. Execute no PowerShell:

```powershell
# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/fechamento-caixa.git

# Renomear branch para main (se necessário)
git branch -M main

# Enviar para o GitHub
git push -u origin main
```

**Se pedir autenticação**: Use seu usuário do GitHub e um **Personal Access Token** (não senha).

### **4️⃣ Deploy na Vercel**

#### **Via Interface Web (Recomendado)**

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"** ou **"Log In"**
3. Escolha **"Continue with GitHub"**
4. Após logar, clique em **"Add New Project"**
5. Clique em **"Import Git Repository"**
6. Selecione o repositório **"fechamento-caixa"**
7. Configure:
   - **Framework Preset**: Detecta automaticamente como Angular
   - **Root Directory**: `./` (deixe como está)
   - **Build Command**: `npm run vercel-build` (já configurado)
   - **Output Directory**: `dist/fechamento-caixa/browser` (já configurado)
8. Clique em **"Deploy"**

#### **Via CLI (Alternativa)**

```powershell
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

### **5️⃣ Aguardar o Deploy**

- A Vercel vai:
  1. Instalar as dependências (`npm install`)
  2. Compilar o projeto (`ng build`)
  3. Fazer o deploy

- Tempo estimado: **2-4 minutos**

### **6️⃣ Acessar o Site**

Após o deploy, a Vercel vai mostrar a URL do seu site:
- Exemplo: `https://fechamento-caixa-abc123.vercel.app`

**Pronto! Seu sistema está no ar! 🎉**

---

## 🔄 **Atualizações Futuras**

Sempre que fizer alterações no código:

```powershell
# Adicionar as mudanças
git add .

# Commitar
git commit -m "descrição da mudança"

# Enviar para o GitHub
git push

# A Vercel faz o deploy automático! ✨
```

---

## 🐛 **Solução de Problemas**

### **Erro: "Build failed"**

1. Verifique se o build funciona localmente:
   ```powershell
   npm run build
   ```

2. Se funcionar localmente, verifique os logs na Vercel

### **Erro: "Firebase not configured"**

- Verifique se commitou o arquivo `src/environments/environment.ts`
- OU configure as variáveis de ambiente na Vercel

### **Erro: "404 Page Not Found" ao navegar**

- O arquivo `vercel.json` já está configurado para redirecionar todas as rotas
- Se ainda der erro, verifique se o arquivo existe na raiz do projeto

### **Site funciona mas não salva dados**

- Verifique as **regras do Firestore** no Firebase Console
- Certifique-se de que está assim:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /fechamentos/{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```

---

## 📊 **Verificação Pós-Deploy**

Após o deploy, teste:

- ✅ Acessar a URL do site
- ✅ Navegar para `/fechamento`
- ✅ Fazer um fechamento de caixa
- ✅ Verificar se salvou no Firebase
- ✅ Navegar para `/relatorios`
- ✅ Filtrar e ver os dados
- ✅ Exportar Excel e PDF

---

## 🎯 **Domínio Personalizado (Opcional)**

Se você tiver um domínio próprio (ex: `www.meusite.com.br`):

1. Na Vercel, vá em **"Settings"** > **"Domains"**
2. Adicione seu domínio
3. Configure o DNS conforme as instruções
4. Aguarde a propagação (pode levar até 24h)

---

## 💡 **Dicas de Performance**

Seu site já está otimizado, mas se quiser melhorar ainda mais:

```powershell
# Análise de bundle
npm run build -- --stats-json
```

---

## 📞 **Suporte**

- Documentação Vercel: https://vercel.com/docs
- Documentação Angular: https://angular.dev
- Firebase Console: https://console.firebase.google.com

---

**Seu sistema está pronto para o mundo! 🚀💰**
