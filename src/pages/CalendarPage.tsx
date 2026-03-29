import { useState, useMemo } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import useMainStore from '@/stores/main'

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function CalendarPage() {
  const { posts, clients } = useMainStore()
  const [selectedDate, setSelectedDate] = useState<{ date: Date; events: any[] } | null>(null)
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [clientFilter, setClientFilter] = useState('Todos')
  const [view, setView] = useState('month')
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
      const dayPosts = posts
        .filter((p) => {
          if (statusFilter !== 'Todos' && p.status !== statusFilter) return false
          if (clientFilter !== 'Todos' && p.clientId !== clientFilter) return false

          const pDate = new Date(p.postDate)
          return (
            pDate.getDate() === d.date.getDate() &&
            pDate.getMonth() === d.date.getMonth() &&
            pDate.getFullYear() === d.date.getFullYear()
          )
        })
        .map((p) => {
          const pDate = new Date(p.postDate)
          const timeStr = pDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

          return {
            title: p.title,
            type: p.format,
            status: p.status,
            time: timeStr !== '00:00' ? timeStr : '10:00',
            owner: 'Admin',
          }
        })

      return { ...d, events: dayPosts }
    })
  }, [currentDate, view, posts, statusFilter, clientFilter])

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Decupagem':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'Redação':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'Revisão':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'Alteração':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'Produção':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'Agendamento':
        return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
      case 'Postado':
        return 'bg-green-600/10 text-green-500 border-green-600/20'
      default:
        return 'bg-muted/50 text-muted-foreground border-border'
    }
  }

  const monthYearStr = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const capitalizedMonthYear = monthYearStr.charAt(0).toUpperCase() + monthYearStr.slice(1)

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-1">Calendário de Conteúdo</h1>
          <p className="text-muted-foreground">Visualize os agendamentos e publicações.</p>
        </div>

        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && setView(v)}
            className="bg-card border border-border p-1 rounded-md"
          >
            <ToggleGroupItem value="month" className="data-[state=on]:bg-muted px-3 h-8 text-sm">
              <LayoutGrid className="w-4 h-4 mr-2" /> Mês
            </ToggleGroupItem>
            <ToggleGroupItem value="week" className="data-[state=on]:bg-muted px-3 h-8 text-sm">
              <CalendarIcon className="w-4 h-4 mr-2" /> Semana
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={prevPeriod} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextPeriod} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-medium min-w-[150px]">{capitalizedMonthYear}</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-full sm:w-[220px] h-9 bg-background">
              <SelectValue placeholder="Filtrar por cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os clientes</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 bg-background">
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
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden border border-border">
        {daysOfWeek.map((d) => (
          <div
            key={d}
            className="bg-muted/50 p-3 text-center text-sm font-semibold text-muted-foreground border-b border-border"
          >
            {d}
          </div>
        ))}
        {days.map((d, i) => (
          <div
            key={i}
            onClick={() =>
              d.events.length > 0 && setSelectedDate({ date: d.date, events: d.events })
            }
            className={cn(
              'bg-card p-2 hover:bg-muted/30 transition-colors relative flex flex-col gap-1',
              view === 'month' ? 'min-h-[120px]' : 'min-h-[400px]',
              !d.isCurrentMonth &&
                view === 'month' &&
                'text-muted-foreground/30 bg-card/50 hover:bg-card/50 cursor-default',
              isToday(d.date) && 'ring-2 ring-inset ring-primary z-10',
              d.events.length > 0 && d.isCurrentMonth && 'cursor-pointer',
            )}
          >
            <span
              className={cn(
                'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                isToday(d.date) && 'bg-primary text-primary-foreground',
              )}
            >
              {d.date.getDate()}
            </span>

            <div className="mt-1 flex flex-col gap-1 overflow-y-auto max-h-full pb-2">
              {d.events.map((e, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'text-[10px] sm:text-xs px-2 py-1.5 rounded truncate font-medium border transition-colors',
                    getStatusBadgeClass(e.status),
                  )}
                >
                  {e.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <SheetContent className="bg-card border-l-border overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">
              {selectedDate?.date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </SheetTitle>
            <SheetDescription>Conteúdos programados para esta data.</SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            {selectedDate?.events.map((e, idx) => (
              <div
                key={idx}
                className="bg-muted/30 border border-border p-4 rounded-xl flex flex-col gap-3 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-av" />
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base pr-2">{e.title}</h3>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20 shrink-0"
                  >
                    {e.type}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1.5 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />{' '}
                    <span>
                      Status:{' '}
                      <Badge
                        variant="outline"
                        className={cn('ml-1 font-medium', getStatusBadgeClass(e.status))}
                      >
                        {e.status}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> <span>{e.time}</span>
                  </div>
                </div>
              </div>
            ))}
            {selectedDate?.events.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8">
                Nenhum evento para esta data.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
