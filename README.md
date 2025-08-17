# 🎸 Cifras App

> **Aplicativo moderno e completo para organizar, visualizar e tocar suas cifras musicais**

Um aplicativo PWA (Progressive Web App) construído com **React + TypeScript + Supabase** que oferece uma experiência profissional para músicos organizarem sua biblioteca de cifras com recursos avançados de visualização, transposição automática e sincronização na nuvem.

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.55.0-green?logo=supabase)
![Vite](https://img.shields.io/badge/Vite-5.4.3-purple?logo=vite)
![PWA](https://img.shields.io/badge/PWA-Ready-orange)

## 🌟 Principais Recursos

### 🎵 **Visualizador Avançado de Cifras**
- **Posicionamento automático** de acordes sobre as letras
- **Scroll automático** com controle de velocidade
- **Transposição em tempo real** para qualquer tom
- **Modo karaoke** com destaque da linha atual
- **Diagramas de acordes** interativos para violão
- **Zoom ajustável** para melhor legibilidade

### 📱 **Sistema Completo**
- **Autenticação segura** com Supabase Auth
- **CRUD completo** para gerenciar suas músicas
- **Sistema de favoritos** com sincronização
- **Histórico de acessos** automático
- **Modo offline** com download de músicas
- **Busca inteligente** em tempo real
- **Listas personalizadas** (playlists)

### ☁️ **Banco de Dados na Nuvem**
- **PostgreSQL via Supabase** - Dados seguros e escaláveis
- **Row Level Security (RLS)** - Cada usuário vê apenas seus dados
- **Sincronização automática** - Acesse de qualquer dispositivo
- **Backup na nuvem** - Nunca perca suas cifras
- **Cache offline** - Funciona sem internet

### 🎨 **Interface & UX**
- **Design responsivo** - Perfeito em mobile e desktop
- **Menu hambúrguer** intuitivo
- **Modo escuro/claro** com preferências salvas
- **PWA** - Instalável como app nativo
- **Animações suaves** e feedback visual
- **Performance otimizada** (~140KB gzipped)

## 📸 Screenshots

--- Em breve ---

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Conta no Supabase** (gratuita)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/cifras.git
cd cifras
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

#### 3.1. Crie um projeto no [Supabase](https://supabase.com)

#### 3.2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

#### 3.3. Execute o SQL de setup

No painel SQL do Supabase, execute:

```sql
-- Criar tabela de músicas
CREATE TABLE musics (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  artist VARCHAR,
  content TEXT,
  key VARCHAR,
  capo INTEGER DEFAULT 0,
  genre VARCHAR,
  difficulty VARCHAR CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de favoritos
CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  music_id BIGINT REFERENCES musics(id) ON DELETE CASCADE,
  music_title VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, music_id)
);

-- Criar tabela de histórico
CREATE TABLE history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  music_id BIGINT REFERENCES musics(id) ON DELETE CASCADE,
  music_title VARCHAR,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de listas
CREATE TABLE music_lists (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  musics INTEGER[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar RLS (Row Level Security)
ALTER TABLE musics ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_lists ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own musics" ON musics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own musics" ON musics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own musics" ON musics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own musics" ON musics FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own history" ON history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own history" ON history FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lists" ON music_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own lists" ON music_lists FOR ALL USING (auth.uid() = user_id);
```

### 4. Execute o projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

O aplicativo estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── CifraViewer.tsx     # Visualizador avançado
│   ├── ChordDiagram.tsx    # Diagramas de acordes
│   ├── FavoritesManager.tsx # Sistema de favoritos
│   ├── HistoryManager.tsx   # Histórico de acessos
│   └── OfflineManager.tsx   # Gestão offline
├── hooks/               # Custom hooks
│   ├── useFavorites.ts     # Hook de favoritos
│   ├── useHistory.ts       # Hook de histórico
│   └── useOfflineMusics.ts # Hook offline
├── pages/               # Páginas da aplicação
│   ├── Musicas.tsx         # Página principal
│   ├── Favoritos.tsx       # Favoritos
│   ├── Historico.tsx       # Histórico
│   ├── Offline.tsx         # Músicas offline
│   └── ...
├── store/               # Configuração Supabase
│   ├── supabaseClient.ts   # Cliente Supabase
│   └── musicService.ts     # Serviços de música
└── main.tsx            # Ponto de entrada
```

## 🎵 Como Usar

### 1. **Fazer Login**
- Crie uma conta ou faça login
- Seus dados ficarão sincronizados na nuvem

### 2. **Adicionar Músicas**
- Clique em "Adicionar Música"
- Digite título, artista e cifra
- Use o formato padrão de cifras com acordes entre colchetes

### 3. **Visualizar Cifras**
- Clique em qualquer música para abrir o visualizador
- Use os controles para:
  - ▶️ Iniciar scroll automático
  - 🎵 Transpor para outro tom
  - 🔍 Ajustar zoom
  - 🌙 Alternar modo escuro

### 4. **Favoritar Músicas**
- Clique no coração ❤️ para favoritar
- Acesse rapidamente em "Favoritos"

### 5. **Baixar Offline**
- Clique no ícone de download 📥
- Acesse suas músicas mesmo sem internet

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| **Framework** | React | 18.3.1 |
| **Linguagem** | TypeScript | 5.5.4 |
| **Build Tool** | Vite | 5.4.3 |
| **Database** | Supabase (PostgreSQL) | 2.55.0 |
| **Autenticação** | Supabase Auth | JWT |
| **Roteamento** | React Router DOM | 6.26.2 |
| **Storage Local** | Dexie.js (IndexedDB) | 4.0.8 |
| **PWA** | Service Worker + Manifest | - |
| **CSS** | CSS Modules + CSS Variables | - |

## 🎯 Funcionalidades Detalhadas

### 🎼 **CifraViewer - Visualizador Avançado**

O coração do aplicativo é o `CifraViewer`, um componente sofisticado que oferece:

```typescript
// Exemplo de uso do visualizador
<CifraViewer 
  music={music}
  onTranspose={(newKey) => handleTranspose(newKey)}
  onClose={() => setViewingMusic(null)}
/>
```

**Recursos:**
- 🎵 **Parsing inteligente** - Detecta automaticamente acordes e letras
- 📍 **Posicionamento preciso** - Acordes alinhados perfeitamente sobre as letras
- 🔄 **Transposição automática** - Muda todos os acordes para o novo tom
- ⏯️ **Scroll automático** - Velocidade ajustável para tocar junto
- 🎤 **Modo karaoke** - Destaca a linha atual
- 🔍 **Zoom dinâmico** - Texto maior/menor conforme necessário

### 🎸 **ChordDiagram - Diagramas de Acordes**

Visualização gráfica dos acordes de violão:

```typescript
<ChordDiagram chord="Am" size="medium" />
```

**Características:**
- 📊 **SVG responsivo** - Escalável em qualquer tamanho
- 🎼 **Base de acordes completa** - Maiores, menores, com variações
- 🎯 **Dedilhado visual** - Mostra exatamente onde colocar os dedos
- 🎸 **Múltiplos instrumentos** - Extensível para outros instrumentos

### ❤️ **Sistema de Favoritos**

```typescript
const { favorites, toggleFavorite, isFavorite } = useFavorites();
```

**Funcionalidades:**
- 💾 **Sincronização automática** - Salva na nuvem instantaneamente
- 🔄 **Estado global** - Compartilhado entre todas as páginas
- 📱 **Feedback visual** - Animações suaves no coração
- 📊 **Contador** - Mostra quantas músicas estão favoritadas

### 📚 **Histórico de Acessos**

```typescript
const { addToHistory, history, clearHistory } = useHistory();
```

**Recursos:**
- ⏰ **Registro automático** - Toda visualização é gravada
- 🕐 **Timestamps precisos** - Data e hora de cada acesso
- 🧹 **Limpeza seletiva** - Remove itens específicos ou tudo
- 🔍 **Acesso rápido** - Volta facilmente às músicas recentes

### 📱 **Modo Offline**

```typescript
const { offlineMusics, downloadMusic, removeOffline } = useOfflineMusics();
```

**Capacidades:**
- 💾 **Cache IndexedDB** - Armazenamento local eficiente
- 📊 **Controle de espaço** - Mostra quanto está sendo usado
- 🔄 **Sincronização** - Atualiza quando fica online
- 📥 **Download seletivo** - Escolha quais músicas baixar

## 🔒 Segurança e Privacidade

### **Row Level Security (RLS)**
Cada usuário vê apenas seus próprios dados:

```sql
-- Política de exemplo
CREATE POLICY "Users can view own musics" 
ON musics FOR SELECT 
USING (auth.uid() = user_id);
```

### **Autenticação JWT**
- 🔐 **Tokens seguros** do Supabase Auth
- ⏰ **Expiração automática** e renovação
- 🚪 **Logout seguro** em todos os dispositivos

### **Variáveis de Ambiente**
- 🔒 **Credenciais protegidas** - Nunca expostas no código
- 🌐 **Configuração por ambiente** - Dev/prod separados
- 🛡️ **Chaves rotacionáveis** - Fácil atualização se necessário

## 📊 Performance e Otimizações

### **Bundle Size**
- 📦 **~140KB gzipped** - Carregamento rápido
- 🎯 **Tree shaking** - Só inclui código usado
- 📱 **Code splitting** - Carrega só o necessário

### **Cache Strategy**
- 🏃 **Service Worker** - Cache inteligente de assets
- 💾 **IndexedDB** - Dados offline eficientes
- 🔄 **Stale While Revalidate** - Sempre atualizado

### **Otimizações React**
- ⚡ **Lazy loading** - Componentes carregados sob demanda
- 🎯 **useMemo/useCallback** - Evita re-renders desnecessários
- 📊 **React DevTools** - Profiling e debugging

## 🚀 Deploy

### **Vercel (Recomendado)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure environment variables no dashboard
```

### **Netlify**

```bash
# Build
npm run build

# Deploy pasta dist/
# Configure redirects para SPA
```

### **GitHub Pages**

```bash
# Instale gh-pages
npm install --save-dev gh-pages

# Configure package.json
"homepage": "https://seu-usuario.github.io/cifras",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/cifras.git`
3. **Crie uma branch**: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
5. **Push** para a branch: `git push origin feature/nova-funcionalidade`
6. **Abra um Pull Request**

### **Diretrizes**

- ✅ **TypeScript** - Todo código deve ser tipado
- 🧪 **Testes** - Adicione testes para novas funcionalidades
- 📝 **Documentação** - Atualize README e comentários
- 🎨 **Estilo** - Siga os padrões existentes
- 🐛 **Issues** - Use templates para reportar bugs

## 📝 Roadmap

### **Próximas Funcionalidades**

- [ ] 🎹 **Suporte para piano** - Diagramas de teclas
- [ ] 🎤 **Gravação de áudio** - Grave suas performances
- [ ] 🌐 **Compartilhamento público** - Publique suas cifras
- [ ] 📊 **Estatísticas** - Analytics de uso
- [ ] 🤖 **IA para acordes** - Reconhecimento automático
- [ ] 📱 **App mobile nativo** - React Native
- [ ] 🎵 **Metrônomo integrado** - Para prática
- [ ] 📚 **Importação em lote** - CSV, JSON, etc.

### **Melhorias Técnicas**

- [ ] 🧪 **Testes unitários** - Jest + Testing Library
- [ ] 🧪 **Testes E2E** - Playwright ou Cypress
- [ ] 📊 **Monitoring** - Sentry para erros
- [ ] 🚀 **CI/CD** - GitHub Actions
- [ ] 📱 **Capacitor** - Build para iOS/Android
- [ ] 🔍 **SEO** - Meta tags e structured data

## 🐛 Problemas Conhecidos

### **Limitações Atuais**

1. **Diagramas de acordes** - Apenas violão por enquanto
2. **Transposição** - Não suporta acordes muito complexos
3. **Mobile Safari** - Algumas animações podem ser mais lentas
4. **Importação** - Formato limitado a texto simples

### **Workarounds**

- Para **acordes complexos**: Use a notação simplificada
- Para **performance no Safari**: Desative animações nas configurações
- Para **importação avançada**: Use o editor manual

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2024 Cifras App

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👤 Autor

**Bruno** - Desenvolvedor Full Stack

- 🐙 **GitHub**: [@bruunoxd](https://github.com/bruunoxd)
- 📧 **Email**: bru_nnoxd@hotmail.com.br
- 💼 **LinkedIn**: [Bruno](https://linkedin.com/in/bruno-garciaxd)

## 🙏 Agradecimentos

- **[Supabase](https://supabase.com)** - Backend as a Service incrível
- **[React Team](https://react.dev)** - Pela biblioteca fantástica
- **[Vite](https://vitejs.dev)** - Build tool super rápida
- **[Vercel](https://vercel.com)** - Hospedagem simples e eficiente
- **Comunidade Open Source** - Por todas as bibliotecas utilizadas

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela! ⭐**

**🎸 Feito com ❤️ para a comunidade musical 🎵**

[⬆ Voltar ao topo](#-cifras-app)

</div>
