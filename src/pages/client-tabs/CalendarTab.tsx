import { useState, useMemo } from 'react'
import { Calendar as CalendarIcon, List, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import useMainStore from '@/stores/main'

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function CalendarTab() {
  const { posts } = useMainStore()
  const [view, setView] = useState('month')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date()
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()

  const nextPeriod = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const prevPeriod = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }

  const days = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const dateList = []

    if (view === 'month') {
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      const startPadding = firstDay.getDay()
      for (let i = startPadding - 1; i >= 0; i--) {
        dateList.push({ date: new Date(year, month, -i), isCurrentMonth: false })
      }
      for (let i = 1; i <= lastDay.getDate(); i++) {
        dateList.push({ date: new Date(year, month, i), isCurrentMonth: true })
      }
      const endPadding = lastDay.getDay()
      for (let i = 1; i < 7 - endPadding; i++) {
        dateList.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
      }
    } else {
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek)
        d.setDate(startOfWeek.getDate() + i)
        dateList.push({ date: d, isCurrentMonth: d.getMonth() === month })
      }
    }

    return dateList.map((d) => {
      const dayPosts = posts.filter((p) => {
        if (statusFilter !== 'Todos' && p.status !== statusFilter) return false

        const pDate = new Date(p.postDate)
        return (
          pDate.getDate() === d.date.getDate() &&
          pDate.getMonth() === d.date.getMonth() &&
          pDate.getFullYear() === d.date.getFullYear()
        )
      })

      return { ...d, events: dayPosts }
    })
  }, [currentDate, view, posts, statusFilter])

  const filteredPostsList = useMemo(() => {
    return posts
      .filter((item) => {
        if (statusFilter !== 'Todos' && item.status !== statusFilter) return false
        return true
      })
      .sort((a, b) => new Date(a.postDate).getTime() - new Date(b.postDate).getTime())
  }, [posts, statusFilter])

  const monthYearStr = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const capitalizedMonthYear = monthYearStr.charAt(0).toUpperCase() + monthYearStr.slice(1)

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm min-h-[600px] flex flex-col">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold font-sans text-foreground">Calendário Exclusivo</h3>
          <p className="text-sm text-muted-foreground">
            Visão isolada do planejamento de conteúdo para este cliente.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
          {view !== 'list' && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevPeriod} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextPeriod} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-32 text-center">{capitalizedMonthYear}</span>
            </div>
          )}

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
            <ToggleGroupItem value="month" className="data-[state=on]:bg-muted px-2">
              <LayoutGrid className="h-4 w-4 sm:mr-2" />{' '}
              <span className="hidden sm:inline">Mês</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="week" className="data-[state=on]:bg-muted px-2">
              <CalendarIcon className="h-4 w-4 sm:mr-2" />{' '}
              <span className="hidden sm:inline">Semana</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="list" className="data-[state=on]:bg-muted px-2">
              <List className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Lista</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="flex-1 border border-border rounded-lg bg-background flex flex-col overflow-hidden">
        {(view === 'month' || view === 'week') && (
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-7 border-b border-border bg-muted/30">
              {daysOfWeek.map((d) => (
                <div
                  key={d}
                  className="p-2 text-center text-xs font-semibold text-muted-foreground border-r border-border last:border-0"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-7 gap-px bg-border">
              {days.map((d, i) => (
                <div
                  key={i}
                  className={cn(
                    'bg-background p-2 relative flex flex-col gap-1',
                    view === 'month' ? 'min-h-[100px]' : 'min-h-[300px]',
                    !d.isCurrentMonth && view === 'month' && 'bg-muted/10 opacity-50',
                  )}
                >
                  <span
                    className={cn(
                      'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full',
                      isToday(d.date) && 'bg-primary text-primary-foreground',
                    )}
                  >
                    {d.date.getDate()}
                  </span>

                  <div className="flex-1 space-y-1 overflow-y-auto">
                    {d.events.map((e) => (
                      <div
                        key={e.id}
                        className="text-[10px] p-1.5 rounded border font-medium truncate bg-primary/10 text-primary border-primary/20"
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'list' && (
          <div className="flex-1 p-4 space-y-2 overflow-auto">
            {filteredPostsList.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="h-10 w-10 rounded bg-primary/10 flex flex-col items-center justify-center shrink-0 border border-primary/20">
                  <span className="text-[10px] font-semibold text-primary/80 leading-none mb-0.5 uppercase">
                    {new Date(item.postDate)
                      .toLocaleDateString('pt-BR', { month: 'short' })
                      .replace('.', '')}
                  </span>
                  <span className="text-sm font-bold text-primary leading-none">
                    {new Date(item.postDate).getDate()}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.format} • Status: {item.status}
                  </p>
                </div>
              </div>
            ))}
            {filteredPostsList.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <CalendarIcon className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum conteúdo encontrado para o filtro selecionado.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
