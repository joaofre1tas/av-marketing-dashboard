import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Users, MousePointerClick, TrendingUp, Target, MessageSquare } from 'lucide-react'

const performanceData = [
  { name: '10/Out', reach: 12000, engagement: 2400 },
  { name: '15/Out', reach: 18000, engagement: 3100 },
  { name: '20/Out', reach: 25000, engagement: 4200 },
  { name: '25/Out', reach: 45000, engagement: 8900 },
  { name: '30/Out', reach: 52000, engagement: 12000 },
  { name: '04/Nov', reach: 89000, engagement: 21000 },
]

const chartConfig = {
  reach: {
    label: 'Alcance',
    color: 'hsl(var(--chart-1))',
  },
  engagement: {
    label: 'Engajamento',
    color: 'hsl(var(--chart-2))',
  },
}

const recentActivities = [
  { id: 1, text: "Novo post no Blog: 'Estratégias de 2024'", time: 'Há 2 horas' },
  { id: 2, text: "Status alterado: Reel 'Design System' para Publicado", time: 'Há 4 horas' },
  { id: 3, text: 'Pedro deixou um comentário no rascunho', time: 'Ontem' },
  { id: 4, text: "Campanha 'Black Friday' agendada", time: 'Ontem' },
]

export default function Dashboard() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Análise de Performance</h1>
        <p className="text-muted-foreground">
          Acompanhe os resultados da sua estratégia de conteúdo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:scale-[1.02] transition-transform shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alcance Total
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124.5k</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12.5% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.02] transition-transform shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engajamento</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +0.8% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.02] transition-transform shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversão</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8%</div>
            <p className="text-xs text-destructive flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 rotate-180" /> -0.2% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.02] transition-transform shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leads Ativos
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +15% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-none">
          <CardHeader>
            <CardTitle>Crescimento de Audiência</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart
                data={performanceData}
                margin={{ top: 10, left: -20, right: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-reach)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-reach)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-engagement)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-engagement)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="var(--color-reach)"
                  fill="url(#colorReach)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="var(--color-engagement)"
                  fill="url(#colorEng)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {activity.text}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
