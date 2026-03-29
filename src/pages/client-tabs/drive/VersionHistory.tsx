import { Button } from '@/components/ui/button'
import { X, Clock, RotateCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function VersionHistory({ onClose }: { onClose: () => void }) {
  const { toast } = useToast()
  const versions = [
    { id: 1, date: 'Hoje, 14:30', author: 'Você', current: true },
    { id: 2, date: 'Hoje, 10:15', author: 'Ana Silva' },
    { id: 3, date: 'Ontem, 16:45', author: 'Você' },
    { id: 4, date: '25 Mar, 09:00', author: 'Carlos Souza' },
  ]

  const restoreVersion = () => {
    toast({
      title: 'Versão Restaurada',
      description: 'O documento foi revertido para a versão selecionada.',
    })
    onClose()
  }

  return (
    <div className="w-80 border-l border-[#171717] bg-[#121212] flex flex-col h-full animate-fade-in">
      <div className="p-4 border-b border-[#171717] flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <Clock className="w-4 h-4" /> Histórico
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {versions.map((v) => (
          <div
            key={v.id}
            className="p-3 border border-[#171717] rounded-lg bg-card/50 hover:bg-card transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{v.date}</span>
              {v.current && (
                <span className="text-[10px] uppercase bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  Atual
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3">Modificado por {v.author}</p>
            {!v.current && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-7"
                onClick={restoreVersion}
              >
                <RotateCcw className="w-3 h-3 mr-2" /> Restaurar
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
