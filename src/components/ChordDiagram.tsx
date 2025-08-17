import './ChordDiagram.css'

interface ChordDiagramProps {
  chord: string
  instrument?: 'guitar' | 'ukulele' | 'piano'
  size?: 'small' | 'medium' | 'large'
}

interface ChordData {
  frets: number[]
  fingers: number[]
}

interface ChordDatabase {
  guitar: Record<string, ChordData>
  ukulele: Record<string, ChordData>
  piano: Record<string, ChordData>
}

// Base de dados de acordes (simplificada)
const chordDatabase: ChordDatabase = {
  guitar: {
    'C': { frets: [0, 1, 0, 2, 1, 0], fingers: [0, 1, 0, 3, 2, 0] },
    'D': { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
    'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
    'F': { frets: [1, 1, 3, 3, 2, 1], fingers: [1, 1, 4, 3, 2, 1] },
    'G': { frets: [3, 2, 0, 0, 3, 3], fingers: [3, 2, 0, 0, 4, 4] },
    'A': { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
    'B': { frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 3, 4, 2, 1] },
    'Am': { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
    'Dm': { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
    'Em': { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
    'Fm': { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1] },
    'Gm': { frets: [3, 1, 1, 3, 3, 3], fingers: [3, 1, 1, 4, 4, 4] }
  },
  ukulele: {},
  piano: {}
}

export default function ChordDiagram({ 
  chord, 
  instrument = 'guitar', 
  size = 'medium' 
}: ChordDiagramProps) {
  const chordData = chordDatabase[instrument]?.[chord]
  
  if (!chordData) {
    return (
      <div className={`chord-diagram ${size} not-found`}>
        <div className="chord-name">{chord}</div>
        <div className="chord-not-found">Diagrama não encontrado</div>
      </div>
    )
  }

  const { frets, fingers } = chordData
  const strings = 6 // Para violão
  const fretCount = 5

  // Calcular dimensões baseado no tamanho
  const sizes = {
    small: { width: 60, height: 80, fretHeight: 12 },
    medium: { width: 90, height: 120, fretHeight: 18 },
    large: { width: 120, height: 160, fretHeight: 24 }
  }

  const { width, height, fretHeight } = sizes[size]

  return (
    <div className={`chord-diagram ${size}`}>
      <div className="chord-name">{chord}</div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Trastes horizontais */}
        {Array.from({ length: fretCount + 1 }, (_, i) => (
          <line
            key={`fret-${i}`}
            x1={10}
            y1={20 + i * fretHeight}
            x2={width - 10}
            y2={20 + i * fretHeight}
            stroke="#333"
            strokeWidth={i === 0 ? 3 : 1}
          />
        ))}

        {/* Cordas verticais */}
        {Array.from({ length: strings }, (_, i) => (
          <line
            key={`string-${i}`}
            x1={10 + (i * (width - 20)) / (strings - 1)}
            y1={20}
            x2={10 + (i * (width - 20)) / (strings - 1)}
            y2={20 + fretCount * fretHeight}
            stroke="#333"
            strokeWidth={1}
          />
        ))}

        {/* Posições dos dedos */}
        {frets.map((fret: number, stringIndex: number) => {
          if (fret === -1) {
            // X para corda não tocada
            const x = 10 + (stringIndex * (width - 20)) / (strings - 1)
            return (
              <g key={`mute-${stringIndex}`}>
                <line x1={x-3} y1={5} x2={x+3} y2={11} stroke="red" strokeWidth={2} />
                <line x1={x+3} y1={5} x2={x-3} y2={11} stroke="red" strokeWidth={2} />
              </g>
            )
          }
          
          if (fret === 0) {
            // Círculo vazio para corda solta
            return (
              <circle
                key={`open-${stringIndex}`}
                cx={10 + (stringIndex * (width - 20)) / (strings - 1)}
                cy={8}
                r={4}
                fill="none"
                stroke="#333"
                strokeWidth={2}
              />
            )
          }

          // Círculo preenchido para dedos
          return (
            <circle
              key={`finger-${stringIndex}`}
              cx={10 + (stringIndex * (width - 20)) / (strings - 1)}
              cy={20 + (fret - 0.5) * fretHeight}
              r={6}
              fill="#333"
            />
          )
        })}

        {/* Números dos dedos */}
        {fingers.map((finger: number, stringIndex: number) => {
          if (finger === 0 || frets[stringIndex] <= 0) return null
          
          return (
            <text
              key={`finger-number-${stringIndex}`}
              x={10 + (stringIndex * (width - 20)) / (strings - 1)}
              y={20 + (frets[stringIndex] - 0.5) * fretHeight + 2}
              textAnchor="middle"
              fontSize="10"
              fill="white"
              fontWeight="bold"
            >
              {finger}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
