import { useOnlineStatus } from '../hooks/useOnlineStatus'

export function OnlineStatusIndicator() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null // Não mostrar quando online

  return (
    <div className="status-indicator status-offline">
      📶 Modo offline
    </div>
  )
}
