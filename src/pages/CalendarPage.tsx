import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react'

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1)
  const days = []

  const firstDay = date.getDay()
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), isCurrentMonth: false, events: [] })
  }

  while (date.getMonth() === month) {
    const curDate = new Date(date)
    const dayOfMonth = curDate.getDate()

    const events = []
    if (dayOfMonth === 5)
      events.push({
        title: 'Post Instagram: Dicas',
        type: 'social',
        time: '10:00',
        owner: 'Maria Clara',
      })
    if (dayOfMonth === 12)
      events.push({ title: 'Artigo Blog: SEO', type: 'blog', time: '14:30', owner: 'João Silva' })
    if (dayOfMonth === 18)
      events.push({ title: 'Vídeo YouTube', type: 'video', time: '18:00', owner: 'Pedro Valor' })
    if (dayOfMonth === 25)
      events.push({
        title: 'LinkedIn: Autoridade',
        type: 'social',
        time: '09:00',
        owner: 'Pedro Valor',
      })

    days.push({ date: curDate, isCurrentMonth: true, events })
    date.setDate(date.getDate() + 1)
  }

  const lastDay = new Date(year, month + 1, 0).getDay()
  for (let i = 1; i < 7 - lastDay; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false, events: [] })
  }

  return days
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<{ date: Date; events: any[] } | null>(null)

  const today = new Date()
  const days = getDaysInMonth(today.getFullYear(), today.getMonth())

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Calendário de Conteúdo</h1>
        <p className="text-muted-foreground">Visualize os agendamentos e publicações do mês.</p>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden mt-2">
        {daysOfWeek.map((d) => (
          <div
            key={d}
            className="bg-card p-3 text-center text-sm font-semibold text-muted-foreground border-b border-border"
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
              'bg-card min-h-[120px] p-2 hover:bg-muted/30 transition-colors relative flex flex-col gap-1',
              !d.isCurrentMonth &&
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

            <div className="mt-1 space-y-1">
              {d.events.map((e, idx) => (
                <div
                  key={idx}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 truncate font-medium"
                >
                  {e.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <SheetContent className="bg-card border-l-border">
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
                  <h3 className="font-semibold text-base">{e.title}</h3>
                  <Badge
                    variant="outline"
                    className="bg-orange-500/10 text-orange-500 border-orange-500/20"
                  >
                    {e.type}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1.5 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> <span>{e.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> <span>{e.owner}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
