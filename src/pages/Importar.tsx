import { useState } from 'react'
import { db } from '../store/db'

function parseTxt(content: string){
  // Convenção simples: primeira linha título, segunda opcional 'Artista: X', e o resto é a cifra
  const lines = content.split(/\r?\n/)
  const title = lines.shift()?.trim() || 'Sem título'
  let artist = ''
  if(lines[0]?.toLowerCase().startsWith('artista:')){
    artist = lines.shift()!.split(':')[1].trim()
  }
  const body = lines.join('\n')
  return { title, artist, content: body }
}

export default function Importar(){
  const [status, setStatus] = useState('')

  const onFiles = async (files: FileList | null) => {
    if(!files || files.length===0) return
    let ok = 0
    for(const file of Array.from(files)){
      if(!file.name.toLowerCase().endsWith('.txt')) continue
      const text = await file.text()
      const song = parseTxt(text)
      await db.songs.add(song)
      ok++
    }
    setStatus(`${ok} arquivo(s) importado(s).`)
  }

  return (
    <div>
      <h2>Importar .txt</h2>
      <div className="card">
        <input type="file" accept=".txt" multiple onChange={e=>onFiles(e.target.files)} />
        {status && <p style={{marginTop:8}}>{status}</p>}
      </div>
    </div>
  )
}
