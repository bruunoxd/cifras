# Configuração do Supabase

Para configurar o banco de dados Supabase, siga estes passos:

## 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Escolha uma organização e nome para o projeto
5. Defina uma senha para o banco de dados
6. Escolha uma região (preferencialmente mais próxima do Brasil)

## 2. SQL para criar as tabelas

Execute este SQL no Editor SQL do Supabase:

```sql
-- Tabela de músicas
CREATE TABLE songs (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  key VARCHAR(10), -- Tom da música
  capo INTEGER DEFAULT 0, -- Casa do capo
  lyrics TEXT, -- Letra da música
  chords TEXT, -- Acordes/cifra
  content TEXT, -- Conteúdo completo formatado
  genre VARCHAR(100),
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de playlists
CREATE TABLE playlists (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  song_ids INTEGER[] DEFAULT '{}', -- Array de IDs das músicas
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_songs_title ON songs(title);
CREATE INDEX idx_songs_artist ON songs(artist);
CREATE INDEX idx_songs_user_id ON songs(user_id);
CREATE INDEX idx_playlists_user_id ON playlists(user_id);

-- RLS (Row Level Security) - apenas usuários autenticados podem ver suas próprias músicas
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view their own songs" ON songs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own songs" ON songs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own songs" ON songs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own songs" ON songs
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own playlists" ON playlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own playlists" ON playlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" ON playlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" ON playlists
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Onde encontrar essas informações:**
- Vá em Settings > API no seu projeto Supabase
- `VITE_SUPABASE_URL` = Project URL
- `VITE_SUPABASE_ANON_KEY` = anon/public key

## 4. Recursos do banco

### Tabela `songs`:
- **title**: Título da música
- **artist**: Nome do artista/banda
- **key**: Tom da música (C, D, E, F, G, A, B + # ou b)
- **capo**: Casa do capo (0-12)
- **lyrics**: Letra da música
- **chords**: Acordes e cifra
- **content**: Conteúdo formatado completo
- **genre**: Gênero musical
- **difficulty**: Nível de dificuldade

### Tabela `playlists`:
- **name**: Nome da playlist
- **description**: Descrição opcional
- **song_ids**: Array com IDs das músicas

### Funcionalidades:
- ✅ CRUD completo de músicas e playlists
- ✅ Busca por título, artista, letra e acordes
- ✅ Transposição de acordes
- ✅ Autenticação e segurança (RLS)
- ✅ Timestamps automáticos
