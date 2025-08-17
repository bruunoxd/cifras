import { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css";

interface MusicPlayerProps {
  audioUrl?: string;
  title: string;
  artist: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPositionChange?: (position: number) => void;
}

export default function MusicPlayer({
  audioUrl,
  title,
  artist,
  onTimeUpdate,
  onPositionChange,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Estados para controle de loop
  const [isLooping, setIsLooping] = useState(false);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(0);
  const [showLoopControls, setShowLoopControls] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      // Inicializar pontos de loop com a duração total da música
      if (loopEnd === 0) {
        setLoopEnd(audio.duration);
      }
      setIsLoading(false);
      console.log("Audio loaded, duration:", audio.duration);
    };

    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      setCurrentTime(current);

      // Callback para sincronização com cifra
      onTimeUpdate?.(current, duration);

      // Controle de loop de trecho específico
      if (isLooping && loopEnd > loopStart && current >= loopEnd) {
        audio.currentTime = loopStart;
        // Garantir que continue tocando se estava tocando
        if (!audio.paused) {
          audio.play().catch((err) => {
            console.error("Erro ao continuar loop:", err);
          });
        }
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError("");
    };

    const handleError = () => {
      setIsLoading(false);
      setError("Erro ao carregar o áudio");
      setIsPlaying(false);
    };

    const handleEnded = () => {
      if (isLooping) {
        // Se loop estiver ativo, reinicia a música
        audio.currentTime = loopStart;
        audio.play().catch((err) => {
          console.error("Erro ao reiniciar loop:", err);
          setError("Erro ao reiniciar loop");
          setIsPlaying(false);
        });
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isLooping, loopStart, loopEnd, duration, isPlaying, onTimeUpdate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Controlar propriedade loop do elemento audio
  useEffect(() => {
    if (audioRef.current) {
      // Se não há trecho específico definido, usa loop nativo do audio
      const useNativeLoop =
        isLooping && loopEnd === duration && loopStart === 0;
      audioRef.current.loop = useNativeLoop;
    }
  }, [isLooping, loopStart, loopEnd, duration]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Erro ao reproduzir áudio:", err);
      setError("Erro ao reproduzir áudio");
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);

    // Callback para posição
    onPositionChange?.(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const setLoopStartPoint = () => {
    setLoopStart(currentTime);
  };

  const setLoopEndPoint = () => {
    setLoopEnd(currentTime);
  };

  const toggleLoop = () => {
    const newLoopState = !isLooping;
    setIsLooping(newLoopState);

    // Se está ativando o loop e não tem pontos definidos, usar a música toda
    if (newLoopState && loopStart === loopEnd) {
      setLoopStart(0);
      setLoopEnd(duration || 0);
    }

    // Log para debug
    console.log("Loop toggled:", newLoopState, {
      loopStart,
      loopEnd,
      duration,
    });
  };

  const clearLoop = () => {
    setLoopStart(0);
    setLoopEnd(duration);
    setIsLooping(false);
  };

  // Speeds predefinidas
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="music-player">
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      <div className="player-header">
        <div className="track-info">
          <h4 className="track-title">{title}</h4>
          <p className="track-artist">{artist}</p>
        </div>
        <div className="player-status">
          {isLoading && (
            <span className="status-loading">⏳ Carregando...</span>
          )}
          {error && <span className="status-error">❌ {error}</span>}
          {!audioUrl && <span className="status-no-audio">🎵 Sem áudio</span>}
        </div>
      </div>

      {/* Controles principais */}
      <div className="player-controls">
        <button
          className="control-btn stop-btn"
          onClick={handleStop}
          disabled={!audioUrl}
          title="Parar"
        >
          ⏹️
        </button>

        <button
          className={`control-btn play-btn ${isPlaying ? "playing" : ""}`}
          onClick={togglePlay}
          disabled={!audioUrl || isLoading}
          title={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>

        <button
          className={`control-btn loop-btn ${isLooping ? "active" : ""}`}
          onClick={toggleLoop}
          disabled={!audioUrl}
          title={
            isLooping
              ? `Loop ativo (${formatTime(loopStart)} - ${formatTime(loopEnd)})`
              : "Ativar loop"
          }
        >
          🔁
        </button>

        <button
          className="control-btn settings-btn"
          onClick={() => setShowLoopControls(!showLoopControls)}
          disabled={!audioUrl}
          title="Controles avançados"
        >
          ⚙️
        </button>
      </div>

      {/* Barra de progresso */}
      <div className="progress-container">
        <span className="time-display">{formatTime(currentTime)}</span>
        <div className="progress-wrapper">
          <input
            type="range"
            className="progress-slider"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            disabled={!audioUrl || !duration}
          />
          {/* Indicadores de loop */}
          {isLooping && duration > 0 && (
            <div className="loop-indicators">
              <div
                className="loop-start-indicator"
                style={{ left: `${(loopStart / duration) * 100}%` }}
              />
              <div
                className="loop-end-indicator"
                style={{ left: `${(loopEnd / duration) * 100}%` }}
              />
              <div
                className="loop-range"
                style={{
                  left: `${(loopStart / duration) * 100}%`,
                  width: `${((loopEnd - loopStart) / duration) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      {/* Controles de velocidade e volume */}
      <div className="secondary-controls">
        <div className="speed-controls">
          <label>Velocidade:</label>
          <div className="speed-buttons">
            {speedOptions.map((speed) => (
              <button
                key={speed}
                className={`speed-btn ${
                  playbackRate === speed ? "active" : ""
                }`}
                onClick={() => handlePlaybackRateChange(speed)}
                disabled={!audioUrl}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <div className="volume-controls">
          <label>🔊</label>
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            disabled={!audioUrl}
          />
          <span className="volume-display">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      {/* Controles avançados de loop */}
      {showLoopControls && (
        <div className="loop-controls">
          <h5>Controles de Loop</h5>
          <div className="loop-actions">
            <button
              className="loop-action-btn"
              onClick={setLoopStartPoint}
              disabled={!audioUrl}
            >
              📍 Marcar Início ({formatTime(loopStart)})
            </button>
            <button
              className="loop-action-btn"
              onClick={setLoopEndPoint}
              disabled={!audioUrl}
            >
              🏁 Marcar Fim ({formatTime(loopEnd)})
            </button>
            <button
              className="loop-action-btn clear-btn"
              onClick={clearLoop}
              disabled={!audioUrl}
            >
              🗑️ Limpar Loop
            </button>
          </div>
          <div className="loop-info">
            <small>
              Loop: {formatTime(loopStart)} - {formatTime(loopEnd)}(
              {formatTime(loopEnd - loopStart)} de duração)
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
