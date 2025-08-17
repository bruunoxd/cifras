// Hook simplificado para modo offline
export const useHistoryManager = () => {
  const registerAccess = (songId: string) => {
    console.log('Acesso registrado em modo offline:', songId)
  }

  return { registerAccess }
}
