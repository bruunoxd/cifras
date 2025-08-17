import { useState, useEffect, useRef, useMemo } from "react";
import MusicPlayer from "./MusicPlayer";
import "./CifraViewer.css";

export interface ChordPosition {
  chord: string;
  position: number;
  line: number;
}

interface CifraViewerProps {
  title: string;
  artist: string;
  lyrics: string;
  chords: string;
  originalKey?: string;
  transpose?: number;
  darkMode?: boolean;
  karaoke?: boolean;
  highlightChords?: boolean;
  scrollSpeed?: number;
  autoScroll?: boolean;
  audioUrl?: string; // URL do áudio para o player
  onTranspose?: (steps: number) => void;
  onBack?: () => void; // Adicionar callback para voltar
}

export default function CifraViewer({
  title,
  artist,
  lyrics,
  chords,
  originalKey = "C",
  transpose = 0,
  darkMode = false,
  karaoke = false,
  highlightChords = false,
  scrollSpeed = 1,
  autoScroll = false,
  audioUrl,
  onTranspose,
  onBack,
}: CifraViewerProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(-1);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Parse cifra com acordes inline posicionados acima das palavras
  const parseCifraWithInlineChords = (
    lyricsText: string,
    chordsText: string
  ) => {
    // Primeiro, vamos processar o texto completo para extrair acordes entre colchetes
    const processTextWithBracketChords = (text: string) => {
      const lines = text.split("\n");
      const result: Array<{
        type: "verse" | "chorus" | "bridge";
        content: Array<{ text: string; chord?: string }>;
      }> = [];

      for (const line of lines) {
        if (!line.trim()) continue;

        // Detectar tipo de seção
        let sectionType: "verse" | "chorus" | "bridge" = "verse";
        if (
          line.toLowerCase().includes("refrão") ||
          line.toLowerCase().includes("chorus")
        ) {
          sectionType = "chorus";
        } else if (
          line.toLowerCase().includes("ponte") ||
          line.toLowerCase().includes("bridge")
        ) {
          sectionType = "bridge";
        }

        const lineContent: Array<{ text: string; chord?: string }> = [];

        // Usar uma abordagem mais simples e segura para parsing
        let currentIndex = 0;
        let currentChord = "";

        while (currentIndex < line.length) {
          // Procurar por acordes entre colchetes
          const bracketStart = line.indexOf("[", currentIndex);

          if (bracketStart === -1) {
            // Não há mais acordes, adicionar o resto do texto
            const remainingText = line.slice(currentIndex);
            if (remainingText.trim()) {
              const words = remainingText.split(/(\s+)/);
              for (let i = 0; i < words.length; i++) {
                const word = words[i];
                if (word) {
                  lineContent.push({
                    text: word,
                    chord: i === 0 ? currentChord : undefined,
                  });
                }
              }
              currentChord = ""; // Reset chord after first word
            }
            break;
          }

          // Adicionar texto antes do acorde
          const textBeforeChord = line.slice(currentIndex, bracketStart);
          if (textBeforeChord.trim()) {
            const words = textBeforeChord.split(/(\s+)/);
            for (let i = 0; i < words.length; i++) {
              const word = words[i];
              if (word) {
                lineContent.push({
                  text: word,
                  chord: i === 0 ? currentChord : undefined,
                });
              }
            }
            currentChord = ""; // Reset after using
          }

          // Encontrar o final do acorde
          const bracketEnd = line.indexOf("]", bracketStart);
          if (bracketEnd === -1) break; // Malformed chord, stop parsing

          // Extrair o acorde
          currentChord = line.slice(bracketStart + 1, bracketEnd);
          currentIndex = bracketEnd + 1;
        }
        if (lineContent.length > 0) {
          result.push({
            type: sectionType,
            content: lineContent,
          });
        }
      }

      return result;
    };

    // Se o texto das letras já contém acordes entre colchetes, usar esse formato
    if (lyricsText.includes("[") && lyricsText.includes("]")) {
      return processTextWithBracketChords(lyricsText);
    }

    // Caso contrário, usar o método original de linhas separadas
    const lyricsLines = lyricsText.split("\n");
    const chordsLines = chordsText.split("\n");
    const result: Array<{
      type: "verse" | "chorus" | "bridge";
      content: Array<{ text: string; chord?: string }>;
    }> = [];

    for (let i = 0; i < Math.max(lyricsLines.length, chordsLines.length); i++) {
      const lyric = lyricsLines[i] || "";
      const chordLine = chordsLines[i] || "";

      if (!lyric.trim() && !chordLine.trim()) continue;

      // Detectar tipo de seção
      let sectionType: "verse" | "chorus" | "bridge" = "verse";
      if (
        lyric.toLowerCase().includes("refrão") ||
        lyric.toLowerCase().includes("chorus")
      ) {
        sectionType = "chorus";
      } else if (
        lyric.toLowerCase().includes("ponte") ||
        lyric.toLowerCase().includes("bridge")
      ) {
        sectionType = "bridge";
      }

      const lineContent: Array<{ text: string; chord?: string }> = [];

      // Extrair todos os acordes da linha de acordes
      const chordMatches = [
        ...chordLine.matchAll(
          /([A-G][#b]?(?:m|maj|dim|aug|sus[24]?|add[69]|[0-9]+)?)/g
        ),
      ];

      // Dividir a linha em palavras e encontrar acordes correspondentes
      const words = lyric.split(/(\s+)/);
      let wordIndex = 0;

      for (const word of words) {
        let chordForWord = "";

        // Atribuir acordes sequencialmente às palavras (excluindo espaços)
        if (word.trim() && wordIndex < chordMatches.length) {
          chordForWord = chordMatches[wordIndex][0];
          wordIndex++;
        }

        lineContent.push({
          text: word,
          chord: chordForWord,
        });
      }

      result.push({
        type: sectionType,
        content: lineContent,
      });
    }

    return result;
  };

  const toggleAutoScroll = () => {
    if (isScrolling) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      setIsScrolling(false);
    } else {
      setIsScrolling(true);
      scrollIntervalRef.current = setInterval(() => {
        if (contentRef.current) {
          contentRef.current.scrollBy(0, scrollSpeed);
        }
      }, 50);
    }
  };

  // Função para sincronizar com o áudio
  const handleAudioTimeUpdate = (currentTime: number, duration: number) => {
    if (!contentRef.current || duration === 0) return;

    // Calcular qual acorde deve estar destacado baseado no tempo
    const totalChords = parsedCifra.reduce((total, section) => {
      return total + section.content.filter((word) => word.chord).length;
    }, 0);

    if (totalChords > 0) {
      const progressRatio = currentTime / duration;
      const newHighlightIndex = Math.floor(progressRatio * totalChords);
      setCurrentHighlightIndex(newHighlightIndex);

      // Auto-scroll baseado no progresso do áudio
      const scrollHeight =
        contentRef.current.scrollHeight - contentRef.current.clientHeight;
      const newScrollTop = scrollHeight * progressRatio;
      contentRef.current.scrollTop = newScrollTop;
    }
  };

  // Função para quando o usuário muda a posição do áudio
  const handleAudioPositionChange = (position: number) => {
    // Pode ser usado para lógica adicional quando o usuário arrasta a barra de progresso
    console.log("Audio position changed to:", position);
  };

  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  const parsedCifra = useMemo(() => {
    return parseCifraWithInlineChords(lyrics, chords);
  }, [lyrics, chords]);

  const containerClass = `cifra-viewer ${
    darkMode ? "dark-mode" : "light-mode"
  } ${karaoke ? "karaoke-mode" : ""}`;

  return (
    <div className={containerClass}>
      {/* Header da música */}
      <div className="cifra-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2>{title}</h2>
            {artist && <h3>{artist}</h3>}
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="btn-secondary"
              style={{ minWidth: "auto", padding: "0.5rem 1rem" }}
            >
              ← Voltar
            </button>
          )}
        </div>

        {/* Player de Música */}
        <MusicPlayer
          audioUrl={audioUrl}
          title={title}
          artist={artist}
          onTimeUpdate={handleAudioTimeUpdate}
          onPositionChange={handleAudioPositionChange}
        />

        <div className="cifra-controls">
          <div className="transpose-controls">
            <button onClick={() => onTranspose?.(transpose - 1)}>-</button>
            <span>
              Tom: {originalKey}{" "}
              {transpose !== 0 && `(${transpose > 0 ? "+" : ""}${transpose})`}
            </span>
            <button onClick={() => onTranspose?.(transpose + 1)}>+</button>
          </div>
          <button
            className={`scroll-btn ${isScrolling ? "active" : ""}`}
            onClick={toggleAutoScroll}
          >
            {isScrolling ? "Parar" : "Auto Scroll"}
          </button>
        </div>
      </div>

      {/* Conteúdo da cifra com acordes inline e sincronização */}
      <div className="cifra-content" ref={contentRef}>
        {parsedCifra.map((section, sectionIndex) => (
          <div key={sectionIndex} className={`cifra-section ${section.type}`}>
            <div className="cifra-line-with-chords">
              {section.content.map((wordData, wordIndex) => {
                // Calcular o índice global do acorde para highlight
                let globalChordIndex = 0;
                for (let i = 0; i < sectionIndex; i++) {
                  globalChordIndex += parsedCifra[i].content.filter(
                    (w) => w.chord
                  ).length;
                }
                globalChordIndex += section.content
                  .slice(0, wordIndex)
                  .filter((w) => w.chord).length;

                const isHighlighted =
                  wordData.chord && globalChordIndex === currentHighlightIndex;

                return (
                  <span key={wordIndex} className="word-with-chord">
                    {wordData.chord && (
                      <span
                        className={`chord-above ${
                          highlightChords || isHighlighted ? "highlight" : ""
                        } ${isHighlighted ? "current-chord" : ""}`}
                      >
                        {wordData.chord}
                      </span>
                    )}
                    <span className="word-text">{wordData.text}</span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
