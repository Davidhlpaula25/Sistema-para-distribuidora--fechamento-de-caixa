# ⚡ Comandos Rápidos

## 🚀 Instalação e Execução

### Primeira Vez
```bash
# 1. Instalar todas as dependências
npm install

# 2. Configurar Firebase (edite src/environments/environment.ts)
# Veja FIREBASE_SETUP.md para detalhes

# 3. Executar em modo desenvolvimento
npm start

# Acesse: http://localhost:4200
```

## 📦 Comandos NPM Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm start
# ou
npm run start

# Build de produção
npm run build
# Arquivos otimizados em: dist/fechamento-caixa/

# Build em modo watch (recompila automaticamente)
npm run watch
```

## 🛠️ Comandos Angular CLI

```bash
# Gerar novo componente
ng generate component components/novo-componente --standalone

# Gerar novo service
ng generate service services/novo-service

# Gerar novo model/interface
ng generate interface models/novo-model

# Verificar versão do Angular
ng version

# Ajuda
ng help
```

## 🔥 Testes Rápidos

### Testar Conexão com Firebase
```bash
# 1. Execute o projeto
npm start

# 2. Abra o console do navegador (F12)
# 3. Faça um fechamento de caixa
# 4. Verifique se aparece no console: "Fechamento salvo com ID: ..."
```

### Testar Componente de Fechamento
```bash
# Acesse: http://localhost:4200/fechamento
# Digite algumas quantidades
# Observe o Total Geral se atualizar automaticamente
# Clique em "Fechar Caixa"
# Verifique se a mensagem de sucesso aparece
```

### Testar Componente de Relatórios
```bash
# Acesse: http://localhost:4200/relatorios
# Ajuste o período de datas
# Clique em "Filtrar"
# Verifique se os KPIs aparecem
# Verifique se o gráfico é exibido
# Teste exportar Excel
# Teste exportar PDF
```

## 🧹 Limpeza de Cache

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar cache do Angular
rm -rf .angular/cache

# Limpar build
rm -rf dist
```

## 📝 Git Workflow

```bash
# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "feat: Sistema completo de fechamento de caixa"

# Adicionar repositório remoto
git remote add origin https://github.com/seu-usuario/fechamento-caixa.git

# Push para o GitHub
git push -u origin main
```

## 🌐 Deploy

### Deploy no Firebase Hosting

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login no Firebase
firebase login

# 3. Inicializar Firebase Hosting
firebase init hosting

# Selecione:
# - Use an existing project
# - Public directory: dist/fechamento-caixa
# - Single-page app: Yes
# - Overwrite index.html: No

# 4. Build de produção
npm run build

# 5. Deploy
firebase deploy --only hosting

# URL do app será exibida no console
```

### Deploy no Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Build de produção
npm run build

# 3. Deploy
vercel --prod

# Siga as instruções no terminal
```

### Deploy no Netlify

```bash
# 1. Build de produção
npm run build

# 2. Instalar Netlify CLI
npm install -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir=dist/fechamento-caixa
```

## 🔍 Debugging

### Ver Logs do Console
```bash
# No navegador, pressione F12
# Vá para a aba "Console"
# Observe mensagens de erro ou avisos
```

### Verificar Erros de Compilação
```bash
# Erros serão exibidos no terminal onde você executou npm start
# Também aparecem no navegador em vermelho
```

### Verificar Dados no Firestore
```bash
# 1. Acesse: https://console.firebase.google.com
# 2. Selecione seu projeto
# 3. Clique em "Firestore Database"
# 4. Navegue pela coleção "fechamentos"
```

## 📊 Performance

### Análise de Bundle
```bash
# Build com análise de tamanho
npm run build -- --stats-json

# Instalar webpack-bundle-analyzer
npm install -g webpack-bundle-analyzer

# Analisar bundle
webpack-bundle-analyzer dist/fechamento-caixa/stats.json
```

## 🆘 Solução de Problemas Comuns

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Port 4200 is already in use"
```bash
# Matar processo na porta 4200
# Windows:
netstat -ano | findstr :4200
taskkill /PID [número-do-pid] /F

# Linux/Mac:
lsof -ti:4200 | xargs kill -9

# Ou use outra porta:
ng serve --port 4201
```

### Erro: Firebase não conecta
```bash
# 1. Verifique as credenciais em src/environments/environment.ts
# 2. Verifique se o Firestore está ativado no Firebase Console
# 3. Verifique as regras de segurança do Firestore
```

### Erro: Gráfico não aparece
```bash
# Reinstalar ng2-charts
npm uninstall ng2-charts chart.js
npm install ng2-charts@6.0.1 chart.js@4.4.1
```

## 📱 Testes em Dispositivos Móveis

```bash
# 1. Execute em modo desenvolvimento
npm start

# 2. Descubra seu IP local
# Windows:
ipconfig
# Linux/Mac:
ifconfig

# 3. Acesse no celular usando o IP
# Exemplo: http://192.168.1.100:4200

# Para permitir acesso externo:
ng serve --host 0.0.0.0
```

## 🎓 Aprendizado

### Documentação Oficial
- Angular: https://angular.dev
- Firebase: https://firebase.google.com/docs
- Chart.js: https://www.chartjs.org/docs

### Tutoriais Recomendados
```bash
# Angular Tour of Heroes (tutorial oficial)
# https://angular.dev/tutorial/tour-of-heroes

# Firebase Quickstart
# https://firebase.google.com/docs/web/setup
```

---

**Comando mais usado:** `npm start` 🚀
**Segundo mais usado:** Verificar Firebase Console 🔥
**Terceiro mais usado:** F12 (DevTools) 🔧
