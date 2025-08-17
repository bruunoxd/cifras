# Cifras App - Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-17

### ✨ Adicionado
- **Visualizador avançado de cifras** com posicionamento automático de acordes
- **Sistema de autenticação** completo com Supabase Auth
- **CRUD de músicas** com busca em tempo real
- **Sistema de favoritos** com sincronização na nuvem
- **Histórico de acessos** automático
- **Modo offline** com download de músicas
- **Transposição automática** de acordes para qualquer tom
- **Scroll automático** com velocidade ajustável
- **Modo karaoke** com destaque da linha atual
- **Diagramas de acordes** interativos para violão
- **PWA** (Progressive Web App) - instalável como app nativo
- **Modo escuro/claro** com preferências salvas
- **Interface responsiva** mobile-first
- **Menu hambúrguer** intuitivo
- **Listas de músicas** (playlists) personalizadas
- **Importação de arquivos** .txt de cifras
- **Backup e restauração** de dados

### 🎨 Interface
- **Design moderno** com CSS Grid e Flexbox
- **Animações suaves** e feedback visual
- **Componentes reutilizáveis** bem estruturados
- **Typography** otimizada para leitura
- **Cores e temas** consistentes

### ⚡ Performance
- **Bundle otimizado** (~140KB gzipped)
- **Lazy loading** de componentes
- **Cache inteligente** com Service Worker
- **IndexedDB** para armazenamento offline eficiente

### 🔒 Segurança
- **Row Level Security (RLS)** no Supabase
- **Autenticação JWT** segura
- **Políticas de acesso** granulares
- **Variáveis de ambiente** protegidas

### 🛠️ Tecnologias
- **React 18.3.1** com hooks modernos
- **TypeScript 5.5.4** para tipagem segura
- **Vite 5.4.3** como build tool
- **Supabase 2.55.0** para backend
- **React Router DOM 6.26.2** para navegação
- **Dexie.js 4.0.8** para IndexedDB

### 📱 Recursos Mobile
- **Touch gestures** otimizados
- **Viewport** responsivo
- **Scroll nativo** suave
- **Orientação** adaptável

### 🎵 Recursos Musicais
- **Parser de cifras** inteligente
- **Detecção automática** de acordes
- **Transposição** com algoritmo preciso
- **Formato padrão** de cifras brasileiro
- **Suporte a capo** e alterações

## [0.9.0] - 2024-08-10

### ✨ Adicionado
- Estrutura inicial do projeto
- Configuração do Vite + React + TypeScript
- Setup básico do Supabase
- Componentes base da interface

### 🔧 Configuração
- ESLint e Prettier
- Configuração do TypeScript
- Estrutura de pastas organizada

## [0.8.0] - 2024-08-05

### ✨ Adicionado
- Planejamento inicial do projeto
- Definição da arquitetura
- Escolha das tecnologias

---

## Tipos de Mudanças

- `✨ Adicionado` para novas funcionalidades
- `🔧 Alterado` para mudanças em funcionalidades existentes
- `❌ Descontinuado` para funcionalidades que serão removidas
- `🗑️ Removido` para funcionalidades removidas
- `🐛 Corrigido` para correções de bugs
- `🔒 Segurança` para vulnerabilidades corrigidas

## Links

- [1.0.0]: https://github.com/seu-usuario/cifras/releases/tag/v1.0.0
- [0.9.0]: https://github.com/seu-usuario/cifras/releases/tag/v0.9.0
- [0.8.0]: https://github.com/seu-usuario/cifras/releases/tag/v0.8.0
