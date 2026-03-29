import { useState } from 'react'
import { Calendar as CalendarIcon, List, LayoutGrid } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import useMainStore from '@/stores/main'

export default function CalendarTab() {
  const { posts } = useMainStore()
  const [view, setView] = useState('month')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const filteredPosts = posts.filter(
    (item) => statusFilter === 'Todos' || item.status === statusFilter,
  )

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm h-[600px] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold font-sans text-foreground">Calendário Exclusivo</h3>
          <p className="text-sm text-muted-foreground">
            Visão isolada do planejamento de conteúdo para este cliente.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Decupagem">Decupagem</SelectItem>
              <SelectItem value="Redação">Redação</SelectItem>
              <SelectItem value="Revisão">Revisão</SelectItem>
              <SelectItem value="Alteração">Alteração</SelectItem>
              <SelectItem value="Produção">Produção</SelectItem>
              <SelectItem value="Agendamento">Agendamento</SelectItem>
              <SelectItem value="Postado">Postado</SelectItem>
            </SelectContent>
          </Select>

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
            <ToggleGroupItem
              value="week"
              aria-label="Week view"
              className="data-[state=on]:bg-muted"
            >
              <CalendarIcon className="h-4 w-4 mr-2" /> Semana
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              aria-label="List view"
              className="data-[state=on]:bg-muted"
            >
              <List className="h-4 w-4 mr-2" /> Lista
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
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
          <div className="flex-1 p-4 space-y-2 overflow-auto">
            {filteredPosts.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {new Date(item.postDate).getDate()}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {item.format} • Status: {item.status}
                  </p>
                </div>
              </div>
            ))}
            {filteredPosts.length === 0 && (
              <p className="text-sm text-muted-foreground p-4">
                Nenhum conteúdo encontrado para o filtro selecionado.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
