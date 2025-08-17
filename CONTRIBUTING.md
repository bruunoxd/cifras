# Contribuindo para o Cifras App

Obrigado por seu interesse em contribuir! 🎉

## Como Contribuir

### 🐛 Reportando Bugs

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/seu-usuario/cifras/issues)
2. Use o template de bug report
3. Inclua:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots se aplicável
   - Informações do sistema (browser, OS, etc.)

### ✨ Sugerindo Melhorias

1. Abra uma nova Issue com o template de feature request
2. Descreva claramente a funcionalidade
3. Explique por que seria útil
4. Inclua mockups se possível

### 🔧 Enviando Pull Requests

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/cifras.git`
3. **Crie uma branch**: `git checkout -b feature/sua-funcionalidade`
4. **Faça suas alterações**
5. **Teste** suas mudanças
6. **Commit**: `git commit -m 'feat: adiciona nova funcionalidade'`
7. **Push**: `git push origin feature/sua-funcionalidade`
8. **Abra um Pull Request**

## 📋 Diretrizes de Código

### TypeScript

- Todo código deve ser tipado
- Use interfaces para objetos complexos
- Evite `any` - prefira `unknown` quando necessário

### React

- Use functional components e hooks
- Componentes devem ter uma única responsabilidade
- Props devem ser tipadas com interfaces

### CSS

- Use CSS modules ou styled-components
- Mantenha consistência com o design system
- Prefira CSS Grid/Flexbox para layouts

### Commits

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige bug específico
docs: atualiza documentação
style: formatação de código
refactor: refatoração sem mudança de funcionalidade
test: adiciona ou corrige testes
chore: tarefas de manutenção
```

## 🧪 Testes

- Escreva testes para novas funcionalidades
- Mantenha cobertura de testes alta
- Use Jest + Testing Library

```bash
# Rodar testes
npm test

# Cobertura
npm run test:coverage
```

## 🏗️ Setup de Desenvolvimento

1. **Clone e instale**:

```bash
git clone https://github.com/seu-usuario/cifras.git
cd cifras
npm install
```

2. **Configure o ambiente**:

```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

3. **Inicie o servidor**:

```bash
npm run dev
```

## 📝 Documentação

- Mantenha o README atualizado
- Documente funções complexas
- Use JSDoc para componentes importantes

## 🎯 Prioridades Atuais

### Alta Prioridade

- [ ] Testes unitários para componentes principais
- [ ] Melhoria da performance mobile
- [ ] Acessibilidade (ARIA labels, teclado)

### Média Prioridade

- [ ] Suporte para piano
- [ ] Themes customizáveis
- [ ] Exportação para PDF

### Baixa Prioridade

- [ ] Integração com Spotify
- [ ] Gravação de áudio
- [ ] Compartilhamento social

## ❓ Dúvidas

- Abra uma Issue com a tag `question`
- Entre em contato via email: bru_nnoxd@hotmail.com.br

## 🙏 Agradecimentos

Toda contribuição é valorizada! Seu nome será adicionado automaticamente ao hall da fama dos contribuidores.

---

**Happy coding! 🎸**
