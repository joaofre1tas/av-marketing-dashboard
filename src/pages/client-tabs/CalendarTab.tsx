import { useState } from 'react'
import { Calendar as CalendarIcon, List, LayoutGrid } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export default function CalendarTab() {
  const [view, setView] = useState('month')

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm h-[600px] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold font-sans text-foreground">Calendário Exclusivo</h3>
          <p className="text-sm text-muted-foreground">
            Visão isolada do planejamento de conteúdo para este cliente.
          </p>
        </div>

        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v)}
          className="bg-background border border-border p-1 rounded-md"
        >
          <ToggleGroupItem
            value="month"
            aria-label="Month view"
            className="data-[state=on]:bg-muted"
          >
            <LayoutGrid className="h-4 w-4 mr-2" /> Mês
          </ToggleGroupItem>
          <ToggleGroupItem value="week" aria-label="Week view" className="data-[state=on]:bg-muted">
            <CalendarIcon className="h-4 w-4 mr-2" /> Semana
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view" className="data-[state=on]:bg-muted">
            <List className="h-4 w-4 mr-2" /> Lista
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex-1 border border-border rounded-lg bg-background flex flex-col overflow-hidden">
        {view === 'month' && (
          <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-[1px] bg-border">
            {/* Simple mock grid for month view */}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="bg-background p-2 relative">
                <span className="text-xs text-muted-foreground">{i + 1 > 31 ? i - 30 : i + 1}</span>
                {i === 12 && (
                  <div className="absolute top-6 left-1 right-1 bg-primary/20 text-primary text-[10px] p-1 rounded font-medium truncate border border-primary/30">
                    Post Carrossel
                  </div>
                )}
                {i === 15 && (
                  <div className="absolute top-6 left-1 right-1 bg-blue-500/20 text-blue-400 text-[10px] p-1 rounded font-medium truncate border border-blue-500/30">
                    Vídeo YouTube
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {view === 'week' && (
          <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground text-sm">
            Visualização semanal selecionada. O layout detalhado da semana aparecerá aqui.
          </div>
        )}

        {view === 'list' && (
          <div className="flex-1 p-4 space-y-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {item * 12}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">Publicação Agendada</h4>
                  <p className="text-xs text-muted-foreground">
                    Instagram • Draft pronto para revisão
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
